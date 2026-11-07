import {scrypt, timingSafeEqual} from 'node:crypto';
import {BackendError, assertOrigin, readJson} from './core.ts';
import {rateLimit, type Database} from './state.ts';
import {validateAddress, type Address} from '../commerce/checkout.ts';

export type CustomerConfig={origin?:string;emailKey?:string;emailFrom?:string};
export type Customer={id:string;email:string;name:string};
type Credentials=Customer&{password_hash:string;password_version:number};
export type SavedAddress=Address&{id:string;label:string};
export type CustomerOrder={id:string;number:string;placedAt:string;status:string;currency:'KES'|'USD'|'GBP';totalMinor:number;items:{name:string;quantity:number;variant:string}[]};
export type ResetMail={to:string;url:string};
export type Mailer=(mail:ResetMail)=>Promise<void>;
const DAY=86400000, SESSION_DAYS=7, RESET_MINUTES=30;
const encoder=new TextEncoder();
const hex=(bytes:Uint8Array)=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
const random=()=>hex(crypto.getRandomValues(new Uint8Array(32)));
export const digest=async(value:string)=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))));
export function appOrigin(config:CustomerConfig){try{const url=new URL(config.origin||'');if(url.origin!==config.origin||!(url.protocol==='https:'||(url.protocol==='http:'&&url.hostname==='127.0.0.1')))throw new Error();return url.origin;}catch{throw new BackendError(503,'CUSTOMER_CONFIG_REQUIRED','Customer accounts are awaiting store configuration. Please try again later.');}}
function password(value:unknown){if(typeof value!=='string'||value.length<12||value.length>128)throw new BackendError(400,'PASSWORD_INVALID','Use a password between 12 and 128 characters.');return value;}
function email(value:unknown){if(typeof value!=='string'||value.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))throw new BackendError(400,'EMAIL_INVALID','Enter a valid email address.');return value.trim().toLowerCase();}
// Native scrypt: OWASP N=2^14, r=8, p=5. No plaintext credentials or raw tokens are stored.
export async function hashPassword(value:string,salt=hex(crypto.getRandomValues(new Uint8Array(16)))){const key=await new Promise<Buffer>((resolve,reject)=>scrypt(value,salt,32,{N:16384,r:8,p:5,maxmem:32*1024*1024},(error,key)=>error?reject(error):resolve(key)));return `scrypt$16384$8$5$${salt}$${key.toString('hex')}`;}
async function matches(value:string,stored:string){const parts=stored.split('$'),candidate=await hashPassword(value,parts[4]);return timingSafeEqual(Buffer.from(candidate),Buffer.from(stored));}
const publicCustomer=(row:Customer):Customer=>({id:row.id,email:row.email,name:row.name});
function cookieName(config:CustomerConfig){return appOrigin(config).startsWith('https:')?'__Host-dd_customer':'dd_customer';}
export function customerCookie(token:string,config:CustomerConfig,clear=false){return `${cookieName(config)}=${clear?'':token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear?0:SESSION_DAYS*86400}${appOrigin(config).startsWith('https:')?'; Secure':''}`;}
function tokenFrom(request:Request,config:CustomerConfig){return request.headers.get('Cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName(config)+'='))?.split('=')[1]||'';}
async function newSession(db:Database,customer:Credentials,now:number){const token=random();const row=await db.prepare('INSERT INTO customer_sessions (token_hash, customer_id, password_version, expires_at) SELECT ?, id, password_version, ? FROM customers WHERE id = ? AND password_version = ? RETURNING customer_id').bind(await digest(token),now+SESSION_DAYS*DAY,customer.id,customer.password_version).first();if(!row)throw new BackendError(401,'SIGN_IN_REQUIRED','Please sign in again.');await db.prepare('DELETE FROM customer_sessions WHERE expires_at < ?').bind(now).run();return token;}
export async function sessionCustomer(db:Database,request:Request,config:CustomerConfig,now=Date.now()):Promise<Customer|null>{const token=tokenFrom(request,config);if(!/^[a-f0-9]{64}$/.test(token))return null;const row=await db.prepare('SELECT c.id, c.email, c.name FROM customer_sessions s JOIN customers c ON c.id = s.customer_id AND c.password_version = s.password_version WHERE s.token_hash = ? AND s.expires_at > ?').bind(await digest(token),now).first<Customer>();return row?publicCustomer(row):null;}
async function requireCustomer(db:Database,request:Request,config:CustomerConfig,now:number){const customer=await sessionCustomer(db,request,config,now);if(!customer)throw new BackendError(401,'SIGN_IN_REQUIRED','Please sign in to your customer account.');return customer;}
async function jsonRows<T>(db:Database,sql:string,owner:string):Promise<T[]>{const row=await db.prepare(sql).bind(owner).first<{rows:string}>();return JSON.parse(row?.rows||'[]');}
function addressInput(input:Record<string,unknown>):Omit<SavedAddress,'id'>{const raw=input.address;if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new BackendError(400,'ADDRESS_INVALID','Complete your address.');const source=raw as Record<string,unknown>,address={} as Address;for(const key of ['firstName','lastName','line1','line2','city','region','postalCode','country'] as const){if(typeof source[key]!=='string'||source[key].length>150)throw new BackendError(400,'ADDRESS_INVALID','Complete the address using 150 characters or fewer per field.');address[key]=source[key].trim();}if(Object.keys(validateAddress(address,'address')).length)throw new BackendError(400,'ADDRESS_INVALID','Complete the address and enter a valid postal code for Kenya, USA or UK.');if(typeof source.label!=='string'||!source.label.trim()||source.label.length>40)throw new BackendError(400,'ADDRESS_INVALID','Add an address label of up to 40 characters.');return {...address,label:source.label.trim()};}
export async function customerAction(db:Database,request:Request,action:string,config:CustomerConfig,mailer?:Mailer,now=Date.now()):Promise<Response>{
 const origin=appOrigin(config),headers=new Headers({'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
 const reply=(body:unknown,status=200)=>Response.json(body,{status,headers});
 if(request.method==='GET'){
  if(action==='session')return reply({customer:await sessionCustomer(db,request,config,now)});
  const user=await requireCustomer(db,request,config,now);
  if(action==='addresses')return reply({addresses:await jsonRows<SavedAddress>(db,"SELECT json_group_array(json(payload)) AS rows FROM (SELECT payload FROM customer_addresses WHERE customer_id = ? ORDER BY created_at, id)",user.id)});
  if(action==='orders')return reply({orders:await jsonRows<CustomerOrder>(db,"SELECT json_group_array(json(payload)) AS rows FROM (SELECT payload FROM customer_orders WHERE customer_id = ? ORDER BY placed_at DESC LIMIT 100)",user.id)});
  throw new BackendError(404,'NOT_FOUND','This account page was not found.');
 }
 if(request.method!=='POST')throw new BackendError(405,'METHOD_NOT_ALLOWED','This action needs a POST request.');
 assertOrigin(request);if(new URL(request.url).origin!==origin)throw new BackendError(403,'ORIGIN_REJECTED','Open your account from the store.');
 const input=await readJson(request,8192);
 // Only the edge-provided CF-Connecting-IP is used; spoofable X-Forwarded-For is ignored.
 const ip=request.headers.get('CF-Connecting-IP')||'unidentified';
 await rateLimit(db,await digest(ip),'customer-write',30,now);
 if(action==='register'||action==='login'){
  const address=email(input.email),value=password(input.password);
  await rateLimit(db,await digest(address),action,5,now);
  let row:Credentials|null;
  if(action==='register'){
   if(typeof input.name!=='string'||!input.name.trim()||input.name.trim().length>100)throw new BackendError(400,'NAME_INVALID','Enter your name (up to 100 characters).');
   row=await db.prepare('INSERT INTO customers (id, email, name, password_hash, password_version, created_at) VALUES (?, ?, ?, ?, 1, ?) ON CONFLICT(email) DO NOTHING RETURNING id, email, name, password_hash, password_version').bind(crypto.randomUUID(),address,input.name.trim(),await hashPassword(value),now).first<Credentials>();
   if(!row)throw new BackendError(409,'REGISTRATION_UNAVAILABLE','Unable to create this account. Try signing in or resetting your password.');
  }else{
   row=await db.prepare('SELECT id, email, name, password_hash, password_version FROM customers WHERE email = ?').bind(address).first<Credentials>();
   // Unknown accounts do the same expensive KDF work as known accounts.
   const valid=row?await matches(value,row.password_hash):Boolean(await hashPassword(value))&&false;
   if(!row||!valid)throw new BackendError(401,'CREDENTIALS_INVALID','Email or password is incorrect.');
  }
  headers.set('Set-Cookie',customerCookie(await newSession(db,row,now),config));return reply({customer:publicCustomer(row)},action==='register'?201:200);
 }
 if(action==='forgot-password'){
  const address=email(input.email);await rateLimit(db,await digest(address),'reset-request',3,now);
  if(!mailer)throw new BackendError(503,'EMAIL_NOT_CONFIGURED','Password reset email is not available yet. Please contact the store.');
  const token=random(),row=await db.prepare('UPDATE customers SET reset_hash = ?, reset_expires_at = ? WHERE email = ? RETURNING id').bind(await digest(token),now+RESET_MINUTES*60000,address).first();
  if(row){try{await mailer({to:address,url:`${origin}/account/reset-password#token=${token}`});}catch{console.error('Customer password reset email delivery failed.');}}
  return reply({message:'If an account exists for this email, a reset link will be sent. Check your inbox and spam folder.'});
 }
 if(action==='reset-password'){
  const value=password(input.password);if(typeof input.token!=='string'||!/^[a-f0-9]{64}$/.test(input.token))throw new BackendError(400,'RESET_INVALID','This reset link is invalid or expired. Request a new link.');
  // One atomic SQL statement consumes the token, changes the hash, and revokes ALL sessions
  // through password_version. This also makes concurrent/replayed resets fail safely on D1.
  const row=await db.prepare('UPDATE customers SET password_hash = ?, password_version = password_version + 1, reset_hash = NULL, reset_expires_at = NULL WHERE reset_hash = ? AND reset_expires_at > ? RETURNING id').bind(await hashPassword(value),await digest(input.token),now).first();
  if(!row)throw new BackendError(400,'RESET_INVALID','This reset link is invalid or expired. Request a new link.');headers.set('Set-Cookie',customerCookie('',config,true));return reply({message:'Your password has been updated. Please sign in with your new password.'});
 }
 const user=await requireCustomer(db,request,config,now);
 if(action==='logout'){await db.prepare('DELETE FROM customer_sessions WHERE token_hash = ? AND customer_id = ?').bind(await digest(tokenFrom(request,config)),user.id).run();headers.set('Set-Cookie',customerCookie('',config,true));return reply({ok:true});}
 if(action==='addresses'){
  let row:unknown;
  if(input.operation==='delete')row=await db.prepare('DELETE FROM customer_addresses WHERE id = ? AND customer_id = ? RETURNING id').bind(String(input.id),user.id).first();
  else if(input.operation==='update'){const address=addressInput(input),id=String(input.id);row=await db.prepare('UPDATE customer_addresses SET payload = ? WHERE id = ? AND customer_id = ? RETURNING id').bind(JSON.stringify({...address,id}),id,user.id).first();}
  else if(input.operation==='create'){const address=addressInput(input),id=crypto.randomUUID();row=await db.prepare('INSERT INTO customer_addresses (id, customer_id, payload, created_at) SELECT ?, ?, ?, ? WHERE (SELECT count(*) FROM customer_addresses WHERE customer_id = ?) < 10 RETURNING id').bind(id,user.id,JSON.stringify({...address,id}),now,user.id).first();if(!row)throw new BackendError(409,'ADDRESS_LIMIT','You can save up to 10 addresses.');}
  else throw new BackendError(400,'ACTION_INVALID','Choose an address action.');
  if(!row)throw new BackendError(404,'ADDRESS_NOT_FOUND','This address was not found in your account.');return reply({ok:true});
 }
 throw new BackendError(404,'NOT_FOUND','This account action was not found.');
}
export function resetMailer(config:CustomerConfig,requestFetch:typeof fetch=fetch):Mailer|undefined{if(!config.emailKey||!config.emailFrom)return undefined;return async({to,url})=>{const response=await requestFetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${config.emailKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:config.emailFrom,to:[to],subject:'Reset your DARICY DANIELS password',text:`We received a password reset request for your DARICY DANIELS customer account.\n\n${url}\n\nThis link expires in 30 minutes and can be used once. If you did not request this, ignore this email.`}),signal:AbortSignal.timeout(10000),redirect:'error'});if(!response.ok)throw new Error('Email delivery rejected');};}
