import {applySavedAddress} from '../lib/commerce/checkout.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {products,money} from '../lib/commerce/catalog.ts';
import {lineKey,updateBagLine,sampleQuote,validateGuest,emptyAddress,checkoutProvider,type GuestDetails} from '../lib/commerce/checkout.ts';
import type {BagLine} from '../lib/commerce/product.ts';
const line:BagLine={productId:'sculpted-drape',color:'burgundy',size:'S',quantity:2};
const valid:GuestDetails={email:'sample@example.com',shipping:{...emptyAddress,firstName:'Sample',lastName:'Guest',line1:'123 Sample Street',city:'New York',region:'NY',postalCode:'10001'},billingSame:true,billing:{...emptyAddress},method:'standard'};
test('cart size edits merge matching variants and reject combined quantities over five',()=>{const other={...line,size:'M',quantity:3};assert.equal(updateBagLine([line,other],lineKey(line),{size:'M'},products)[0].quantity,5);assert.throws(()=>updateBagLine([line,{...other,quantity:4}],lineKey(line),{size:'M'},products));assert.throws(()=>updateBagLine([line],lineKey(line),{size:'XS'},products));});
test('cart edits reject stale keys and invalid quantities without changing the source',()=>{const lines=[{...line}];assert.throws(()=>updateBagLine(lines,'stale',{quantity:1},products));for(const n of [0,6,1.5,Infinity])assert.throws(()=>updateBagLine(lines,lineKey(line),{quantity:n},products));assert.equal(lines[0].quantity,2);});
test('sample quote uses minor units, applies one discount and always leaves tax unknown',()=>{const q=sampleQuote([line],products,'standard',' preview10 ');assert.deepEqual(q,{subtotal:84000,discount:8400,shipping:1200,estimatedTotal:76800,currency:'USD',tax:null});assert.equal(sampleQuote([line],products,'express').estimatedTotal,86500);assert.equal(sampleQuote([],products).estimatedTotal,0);});
test('tampered, unavailable lines and unknown promos cannot produce an accepted quote',()=>{assert.throws(()=>sampleQuote([{...line,size:'XS'}],products));assert.throws(()=>sampleQuote([{...line,quantity:10}],products));assert.throws(()=>sampleQuote([line],products,'standard','NOTREAL'));});
test('guest validation catches missing data, malformed email, ZIP and unsupported destinations',()=>{assert.deepEqual(validateGuest(valid),{});assert.ok(validateGuest({...valid,email:'not email'}).email);assert.ok(validateGuest({...valid,shipping:{...valid.shipping,postalCode:'ABC'}})['shipping.postalCode']);assert.ok(validateGuest({...valid,shipping:{...valid.shipping,country:'other'}})['shipping.country']);assert.ok(validateGuest({...valid,shipping:{...emptyAddress}})['shipping.line1']);});
test('separate billing must be complete; matching billing needs no duplicate address',()=>{assert.deepEqual(validateGuest(valid),{});assert.ok(validateGuest({...valid,billingSame:false})['billing.line1']);assert.deepEqual(validateGuest({...valid,billingSame:false,billing:{...valid.shipping}}),{});});
test('unconfigured payment provider cannot claim an order or payment success',async()=>{const result=await checkoutProvider.prepare();assert.equal(result.ok,false);assert.equal(result.code,'PROVIDER_NOT_CONFIGURED');assert.match(result.message,/No order was placed/);assert.equal('orderId' in result,false);assert.equal('redirectUrl' in result,false);});

test('fractional dollar discounts and totals remain visible to the cent',()=>{const q=sampleQuote([{productId:'arc-bag',color:'burgundy',size:'One size',quantity:1}],products.map(p=>p.id==='arc-bag'?{...p,price:27500}:p),'standard','PREVIEW10');assert.equal(q.discount,2750);assert.equal(money(q.discount),'$27.50');assert.equal(money(q.estimatedTotal),'$259.50');});

test('saved address selection copies only shipping/contact fields and preserves independent billing and delivery',()=>{
 const billing={...emptyAddress,firstName:'Billing',country:'GB',postalCode:'SW1A 1AA'};
 const original={email:'guest@example.invalid',shipping:{...emptyAddress},billingSame:false,billing,method:'express' as const};
 const saved={...emptyAddress,id:'owned-address',label:'Home',firstName:' Sample ',lastName:'Customer',line1:'10 Sample Street',city:'Nairobi',region:'Nairobi',postalCode:'00100',country:'KE'};
 const result=applySavedAddress(original,saved,'customer@example.invalid');
 assert.equal(result.email,'customer@example.invalid');assert.equal(result.shipping.country,'KE');assert.equal(result.shipping.firstName,'Sample');assert.equal('id' in result.shipping,false);assert.equal('label' in result.shipping,false);assert.deepEqual(result.billing,billing);assert.equal(result.billingSame,false);assert.equal(result.method,'express');assert.equal(original.email,'guest@example.invalid');assert.equal(original.shipping.firstName,'');assert.equal(saved.firstName,' Sample ');
 result.shipping.line1='Checkout-only edit';assert.equal(saved.line1,'10 Sample Street');
});
test('saved-address application rejects incomplete addresses and preserves checkout state on failure',()=>{
 const details={email:'guest@example.invalid',shipping:{...emptyAddress},billingSame:true,billing:{...emptyAddress},method:'standard' as const};const before=JSON.stringify(details);
 assert.throws(()=>applySavedAddress(details,{...emptyAddress,country:'FR'},'customer@example.invalid'));assert.throws(()=>applySavedAddress(details,{...emptyAddress,firstName:'A',lastName:'B',line1:'10 Sample Street',city:'London',region:'',country:'GB',postalCode:'SW1A 1AA'},'invalid'));assert.equal(JSON.stringify(details),before);
});
