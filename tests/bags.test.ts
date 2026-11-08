import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {bagProducts} from '../lib/commerce/bags.ts';
import {products,filterProducts,parseFilters} from '../lib/commerce/catalog.ts';
import {addSampleLine} from '../lib/commerce/product.ts';
import {displayQuote} from '../lib/commerce/checkout.ts';
import {convertMinor} from '../lib/commerce/currency.ts';
test('eight bag styles use the selected USD prices and original supplied assets',()=>{
 assert.deepEqual(bagProducts.map(p=>[p.id,p.price]),[['sculptural-tote',20000],['crescent-bag',12500],['petal-bag',17500],['vanity-case',19000],['fold-bag',14000],['arc-bag',15000],['circle-bag',16500],['portrait-bag',16000]]);
 const assets=new Set<string>();for(const p of bagProducts){assert.equal(p.currency,'USD');assert.equal(p.category,'bags');assert.ok(!p.pricePending);for(const photo of p.photos||[]){assert.ok(existsSync('public'+photo.image.src));assert.ok(photo.image.width&&photo.image.height);assert.ok(p.variants.some(v=>v.color===photo.color));assets.add(photo.image.src);}}
 assert.equal(assets.size,16);
});
test('bag category and denim filters exclude garments and unavailable colorways',()=>{
 const f=parseFilters(new URLSearchParams('color=denim'));const items=filterProducts(products,f,{category:'bags'});assert.equal(items.length,7);assert.ok(items.every(p=>p.category==='bags'&&p.id!=='arc-bag'));assert.ok(filterProducts(products,parseFilters(new URLSearchParams()),{preset:'ready'}).every(p=>p.category!=='bags'));
});
test('priced bags can be added and totals use the selected amount in all currencies',()=>{
 for(const p of bagProducts){const v=p.variants[0],lines=addSampleLine([],p,v.color,v.size,2);for(const c of ['USD','KES','GBP'] as const){const quote=displayQuote(lines,products,'standard','',c);assert.equal(quote.subtotal,2*convertMinor(p.price,c));}}
});
