import {BackendError,assertOrigin,readJson} from './core.ts';
import {rateLimit,type Database} from './state.ts';
import {sessionCustomer,digest,appOrigin,type CustomerConfig} from './customer.ts';
import {CommerceClient,commerceLive,type CommerceConfig} from './commerce.ts';
import {emptyAddress,type Address,type GuestDetails} from '../commerce/checkout.ts';
import type {BagLine} from '../commerce/product.ts';
function guestName(config:CustomerConfig){return appOrigin(config).startsWith('https:')?'__Host-dd_checkout':'dd_checkout';}
export function guestCookie(config:CustomerConfig,token='',clear=false){return `${guestName(config)}=${clear?'':token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear?0:604800}${appOrigin(config).startsWith('https:')?'; Secure':''}`;}
function address(value:unknown):Address{if(!value||typeof value!=='object'||Array.isArray(value))throw new BackendError(400,'DETAILS_INVALID','Complete your delivery details.');const input=value as Record<string,unknown>,result={} as Address;for(const key of Object.keys(emptyAddress) as (keyof Address)[]){if(typeof input[key]!=='string'||(input[key] as string).length>150)throw new BackendError(400,'DETAILS_INVALID','Complete your delivery details.');result[key]=(input[key] as string).trim();}return result;}
function details(value:unknown):GuestDetails{if(!value||typeof value!=='object'||Array.isArray(value))throw new BackendError(400,'DETAILS_INVALID','Complete your contact and delivery details.');const v=value as Record<string,unknown>;if(typeof v.email!=='string'||typeof v.billingSame!=='boolean')throw new BackendError(400,'DETAILS_INVALID','Complete your contact and delivery details.');return {email:v.email,shipping:address(v.shipping),billing:address(v.billing),billingSame:v.billingSame,method:'standard'};}
export async function commerceAction(db:Database,request:Request,action:string,config:CommerceConfig,customerConfig:CustomerConfig,client=new CommerceClient(config),now=Date.now()){
 const headers=new Headers({'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'}),reply=(body:unknown,status=200)=>Response.json(body,{status,headers});
 if(action==='status'&&request.method==='GET')return reply({mode:commerceLive(config)?'live':'preview',purchasingEnabled:false,paymentStatus:'not-configured'});
 if(!commerceLive(config))throw new BackendError(503,'COMMERCE_NOT_CONFIGURED','The live commerce backend has not been connected. No order or payment was created.');
 if(request.method==='GET'&&action==='catalog')return reply({products:await client.catalog()});
 if(request.method==='POST'){assertOrigin(request);if(new URL(request.url).origin!==appOrigin(customerConfig))throw new BackendError(403,'ORIGIN_REJECTED','Open checkout from the store.');await rateLimit(db,await digest(request.headers.get('CF-Connecting-IP')||'unidentified'),'commerce-write',30,now);}
 const customer=await sessionCustomer(db,request,customerConfig,now);let subject=customer?'user:'+customer.id:'';
 if(!subject){const token=request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(guestName(customerConfig)+'='))?.split('=')[1];if(token&&/^[a-f0-9]{64}$/.test(token))subject='guest:'+await digest(token);else if(action==='session'&&request.method==='POST'){const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');subject='guest:'+await digest(token);headers.set('Set-Cookie',guestCookie(customerConfig,token));}else throw new BackendError(401,'CHECKOUT_SESSION_REQUIRED','Start a new checkout to continue securely.');}
 await rateLimit(db,subject,'commerce-'+request.method,60,now);
 if(request.method==='GET'){const cartId=new URL(request.url).searchParams.get('cartId')||'';if(action==='cart')return reply({cart:await client.getCart(subject,cartId)});if(action==='shipping')return reply({shippingOptions:await client.shipping(subject,cartId)});if(action==='orders'){if(!customer)throw new BackendError(401,'SIGN_IN_REQUIRED','Sign in to see your orders.');return reply({orders:await client.orders(subject)});}}
 if(request.method==='POST'){const body=await readJson(request);if(action==='session')return reply({customer:Boolean(customer)});
  if(action==='cart'){if(typeof body.country!=='string'||typeof body.currency!=='string'||typeof body.requestId!=='string'||!Array.isArray(body.bag))throw new BackendError(400,'CART_INVALID','Review your bag and delivery country.');return reply({cart:await client.createCart(subject,{country:body.country,currency:body.currency,requestId:body.requestId,bag:body.bag as BagLine[]})},201);}
  if(typeof body.cartId!=='string'||typeof body.revision!=='number')throw new BackendError(400,'CART_INVALID','Refresh your checkout before continuing.');
  if(action==='details')return reply({cart:await client.details(subject,body.cartId,body.revision,details(body.details),typeof body.promo==='string'?body.promo:'')});
  if(action==='shipping'){if(typeof body.optionId!=='string')throw new BackendError(400,'DELIVERY_INVALID','Choose a delivery option.');return reply({cart:await client.chooseShipping(subject,body.cartId,body.revision,body.optionId)});}
  if(action==='payment'||action==='complete')throw new BackendError(503,'PAYMENTS_NOT_CONFIGURED','Payments are not activated. No order was placed.');
 }
 throw new BackendError(404,'NOT_FOUND','This commerce action was not found.');
}
