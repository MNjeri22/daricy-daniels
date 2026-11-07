import type {Product} from './catalog.ts';
export const SAMPLE_BAG_KEY='dd-sample-bag-v1';
export type BagLine={productId:string;color:string;size:string;quantity:number};
export function selectedVariant(product:Product,color:string,size:string){return product.variants.find(v=>v.color===color&&v.size===size);}
export function validQuantity(quantity:number){return Number.isInteger(quantity)&&quantity>=1&&quantity<=5;}
export function readBag(value:unknown,items:Product[]):BagLine[]{
 if(!Array.isArray(value))return [];
 const result:BagLine[]=[];
 for(const raw of value.slice(0,100)){if(!raw||typeof raw!=='object')continue;const line=raw as BagLine,p=items.find(p=>p.id===line.productId);if(!p||!validQuantity(line.quantity)||!selectedVariant(p,line.color,line.size)?.available)continue;const existing=result.find(l=>l.productId===line.productId&&l.color===line.color&&l.size===line.size);if(existing)existing.quantity=Math.min(5,existing.quantity+line.quantity);else result.push({productId:p.id,color:line.color,size:line.size,quantity:line.quantity});}
 return result;
}
export function addSampleLine(lines:BagLine[],product:Product,color:string,size:string,quantity:number):BagLine[]{
 if(!validQuantity(quantity)||!selectedVariant(product,color,size)?.available)throw new Error('Choose an available color and size, and a quantity from 1 to 5.');
 const existing=lines.find(l=>l.productId===product.id&&l.color===color&&l.size===size);
 const limit=Math.min(5,selectedVariant(product,color,size)?.stockQuantity??5);
 if((existing?.quantity||0)+quantity>limit)throw new Error(`Only ${limit} of this size and color can currently be added to your bag.`);
 return existing?lines.map(l=>l===existing?{...l,quantity:l.quantity+quantity}:l):[...lines,{productId:product.id,color,size,quantity}];
}
export function recommendations(product:Product,items:Product[],completeLook=false){return items.filter(p=>p.id!==product.id&&(!completeLook||p.category!==product.category)).sort((a,b)=>Number(b.variants.some(v=>v.available))-Number(a.variants.some(v=>v.available))||Number(b.collection===product.collection)-Number(a.collection===product.collection)||Number(b.category===product.category)-Number(a.category===product.category)||a.rank-b.rank).slice(0,3);}
export const galleryViews=[{name:'Editorial view',scale:1,x:50,y:50},{name:'Shape & drape crop',scale:1.65,x:50,y:30},{name:'Finishing crop',scale:2.2,x:50,y:65}];
export const sizeChart=[['XS',80,62,88],['S',84,66,92],['M',90,72,98],['L',96,78,104],['XL',102,84,110]] as const;
