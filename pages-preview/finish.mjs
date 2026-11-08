import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('pages-dist'),html=await readFile(path.join(root,'index.html'),'utf8');
// Derive every current catalog/editorial route from the approved fixtures at build time.
const {products,categories,collections}=await import('../lib/commerce/catalog.ts');
const {stories,carePages}=await import('../lib/storefront-content.ts');
const routes=['newsletter','shop','wishlist','new-arrivals','best-sellers','ready-to-wear','about','collections','journal','size-guide','cart','checkout','account','account/login','account/register','account/forgot-password','account/reset-password','account/orders','account/addresses','studio',...products.map(p=>'products/'+p.slug),...categories.map(c=>'categories/'+c.slug),...collections.map(c=>'collections/'+c.slug),...stories.map(s=>'journal/'+s.slug),...Object.keys(carePages)];
for(const route of routes){const directory=path.join(root,route);await mkdir(directory,{recursive:true});await writeFile(path.join(directory,'index.html'),html);}
await writeFile(path.join(root,'404.html'),html);await writeFile(path.join(root,'.nojekyll'),'');
// Public design-lab files are copied by Vite, so prefix their root-relative assets too.
async function patch(directory){for(const file of await readdir(directory,{withFileTypes:true})){const target=path.join(directory,file.name);if(file.isDirectory())await patch(target);else if(/\.(html|css|js)$/.test(file.name)){const source=await readFile(target,'utf8');await writeFile(target,source.replace(/(["'`])\/assets\//g,'$1/daricy-daniels/assets/'));}}}
await patch(path.join(root,'design-system'));
console.log(`Built ${routes.length+1} GitHub Pages preview routes.`);
