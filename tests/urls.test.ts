import test from 'node:test';
import assert from 'node:assert/strict';
import {storePath} from '../lib/commerce/urls.ts';
test('script-driven navigation and share URLs preserve the GitHub Pages subpath once',()=>{assert.equal(storePath('/shop?category=dresses','/daricy-daniels/'),'/daricy-daniels/shop?category=dresses');assert.equal(storePath('/daricy-daniels/shop','/daricy-daniels/'),'/daricy-daniels/shop');assert.equal(storePath('/products/piece'),'/products/piece');for(const url of ['https://example.com/x','//example.com/x','#details','mailto:hello@example.com'])assert.equal(storePath(url,'/daricy-daniels/'),url);});
