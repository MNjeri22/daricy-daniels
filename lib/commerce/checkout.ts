import {countries,convertMinor,type Currency} from './currency.ts';
import type {Product} from './catalog.ts';
import {readBag,selectedVariant,validQuantity,type BagLine} from './product.ts';
export const lineKey=(line:Pick<BagLine,'productId'|'color'|'size'>)=>`${line.productId}:${line.color}:${line.size}`;
export function updateBagLine(lines:BagLine[],key:string,patch:Partial<Pick<BagLine,'color'|'size'|'quantity'>>,items:Product[]):BagLine[]{
 const current=lines.find(l=>lineKey(l)===key);if(!current)throw new Error('This piece changed in another window. Refresh your bag and try again.');
 const next={...current,...patch},product=items.find(p=>p.id===next.productId);
 if(!product||product.pricePending||!validQuantity(next.quantity)||!selectedVariant(product,next.color,next.size)?.available)throw new Error('Choose an available size and color, with a quantity from 1 to 5.');
 const limit=Math.min(5,selectedVariant(product,next.color,next.size)?.stockQuantity??5);if(next.quantity>limit)throw new Error(`Only ${limit} of this size and color are currently available.`);
 const others=lines.filter(l=>lineKey(l)!==key),duplicate=others.find(l=>lineKey(l)===lineKey(next));
 if(duplicate&&duplicate.quantity+next.quantity>limit)throw new Error('Your bag allows up to 5 of each size and color. Reduce the quantity first.');
 return duplicate?others.map(l=>l===duplicate?{...l,quantity:l.quantity+next.quantity}:l):lines.map(l=>lineKey(l)===key?next:l);
}
export const sampleShipping=[{id:'standard',name:'Standard delivery',amount:1200},{id:'express',name:'Express delivery',amount:2500}] as const;
export type ShippingMethod=typeof sampleShipping[number]['id'];
export const normalizePromo=(value:string)=>value.trim().toUpperCase();
export function sampleQuote(lines:BagLine[],items:Product[],method:ShippingMethod='standard',promo=''){
 const safe=readBag(lines,items);if(safe.length!==lines.length||lines.some((line,i)=>lineKey(line)!==lineKey(safe[i])||line.quantity!==safe[i].quantity))throw new Error('Your bag changed. Please review the available pieces again.');
 const code=normalizePromo(promo);if(code&&code!=='PREVIEW10')throw new Error('This promotion code is not recognized.');
 const subtotal=safe.reduce((sum,l)=>sum+items.find(p=>p.id===l.productId)!.price*l.quantity,0),discount=code?Math.round(subtotal*.1):0;
 const shipping=safe.length?sampleShipping.find(s=>s.id===method)?.amount:0;if(shipping===undefined)throw new Error('Choose a shipping method.');
 return {subtotal,discount,shipping,estimatedTotal:subtotal-discount+shipping,currency:'USD' as const,tax:null};
}
export type Address={firstName:string;lastName:string;line1:string;line2:string;city:string;region:string;postalCode:string;country:string};
export type GuestDetails={email:string;shipping:Address;billingSame:boolean;billing:Address;method:ShippingMethod};
export const emptyAddress:Address={firstName:'',lastName:'',line1:'',line2:'',city:'',region:'',postalCode:'',country:'US'};
export function validateAddress(address:Address,prefix:string){const errors:Record<string,string>={};for(const key of ['firstName','lastName','line1','city','region','postalCode'] as const){if(!(key==='region'&&address.country==='GB')&&!address[key].trim())errors[`${prefix}.${key}`]='Please complete this field.';else if(address[key].length>150)errors[`${prefix}.${key}`]='Use 150 characters or fewer.';}if(!countries.some(c=>c.code===address.country))errors[`${prefix}.country`]='Choose Kenya, USA or UK.';if(address.country==='KE'&&address.postalCode.trim()&&!/^\d{5}$/.test(address.postalCode.trim()))errors[`${prefix}.postalCode`]='Enter a five-digit Kenyan postal code.';if(address.country==='GB'&&address.postalCode.trim()&&!/^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i.test(address.postalCode.trim()))errors[`${prefix}.postalCode`]='Enter a valid UK postcode.';if(address.country==='US'&&address.postalCode.trim()&&!/^\d{5}(-\d{4})?$/.test(address.postalCode.trim()))errors[`${prefix}.postalCode`]='Enter a five-digit US ZIP code (or ZIP+4).';return errors;}
export function validateGuest(details:GuestDetails){const errors:Record<string,string>={};if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())||details.email.length>254)errors.email='Enter a valid email address.';Object.assign(errors,validateAddress(details.shipping,'shipping'));if(!details.billingSame)Object.assign(errors,validateAddress(details.billing,'billing'));if(!sampleShipping.some(s=>s.id===details.method))errors.method='Choose a shipping method.';return errors;}
export type CheckoutResult={ok:false;code:'PROVIDER_NOT_CONFIGURED'|'PREVIEW_ONLY'|'SERVER_UNAVAILABLE';message:string};
export interface CheckoutProvider{prepare(input?:{bag:BagLine[];currency:Currency;country:string;method:ShippingMethod;promo?:string}):Promise<CheckoutResult>}
// The backend validates preview selections. Live activation must create an authoritative Medusa payment session.
export const checkoutProvider:CheckoutProvider={async prepare(input){if(!input)return {ok:false,code:'PROVIDER_NOT_CONFIGURED',message:'Payment is not connected yet. No order was placed and no payment was collected. Your bag is unchanged.'};try{const response=await fetch('/api/backend/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)}),body=await response.json() as {error?:string;message?:string};if(!response.ok)return {ok:false,code:'SERVER_UNAVAILABLE',message:body.error||'The server could not validate checkout. Please try again.'};return {ok:false,code:'PREVIEW_ONLY',message:body.message||'Your selection has been checked. Ordering opens soon.'};}catch{return {ok:false,code:'SERVER_UNAVAILABLE',message:'The server could not be reached. Your bag is unchanged. Please try again.'};}}};

export function displayQuote(lines:BagLine[],items:Product[],method:ShippingMethod,promo:string,currency:Currency){const base=sampleQuote(lines,items,method,promo);const subtotal=lines.reduce((sum,line)=>sum+convertMinor(items.find(p=>p.id===line.productId)!.price,currency)*line.quantity,0),discount=normalizePromo(promo)?Math.round(subtotal*.1):0,shipping=convertMinor(base.shipping,currency);return {subtotal,discount,shipping,estimatedTotal:subtotal-discount+shipping,currency,tax:null};}

// Applying a saved address copies only checkout fields; account IDs and labels never enter
// the shipping payload. Billing, delivery choice and currency preferences stay independent.
export function applySavedAddress(details:GuestDetails,saved:Address,email:string):GuestDetails{
 const shipping={} as Address;for(const key of Object.keys(emptyAddress) as (keyof Address)[]){if(typeof saved[key]!=='string')throw new Error('This saved address is incomplete. Edit it in your account.');shipping[key]=saved[key].trim();}
 if(Object.keys(validateAddress(shipping,'shipping')).length||!/^\S+@\S+\.\S+$/.test(email)||email.length>254)throw new Error('This saved address is incomplete. Edit it in your account.');
 return {...details,email,shipping};
}
