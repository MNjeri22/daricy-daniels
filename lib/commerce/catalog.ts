export const categories = [
  {slug:'dresses',name:'Dresses',description:'Fluid lines and a singular presence.'},
  {slug:'tops',name:'Tops',description:'Soft structure. Expressive detail.'},
  {slug:'bottoms',name:'Bottoms',description:'A considered foundation.'},
  {slug:'outerwear',name:'Outerwear',description:'Layers with quiet confidence.'},
  {slug:'accessories',name:'Accessories',description:'The finishing expression.'},
] as const;
export const collections = [
  {slug:'abundance',name:'Abundance',description:'Rich burgundy. Sculptural form. An expressive chapter.',image:'/assets/campaign-concept.webp'},
  {slug:'the-considered-edit',name:'The Considered Edit',description:'Cream, tan, and the art of the everyday.',image:'/assets/shop-concepts.webp'},
] as const;
export const sizes=['XS','S','M','L','XL','One size'] as const;
export const colors=[{slug:'burgundy',name:'Burgundy',hex:'#651d32'},{slug:'cream',name:'Cream',hex:'#efe7dc'},{slug:'tan',name:'Tan',hex:'#c3a17e'}] as const;
export type Product = {id:string;slug:string;name:string;category:string;collection:string;price:number;currency:'USD';description:string;image:{src:string;columns:number;rows:number;column:number;row:number};variants:{size:string;color:string;available:boolean}[];newArrival:boolean;featured:boolean;rank:number;introduced:number};
const variant=(sizeList:string[],color:string,out:string[]=[])=>sizeList.map(size=>({size,color,available:!out.includes(size)}));
const studio=(column:number,row=0)=>({src:'/assets/shop-concepts.webp',columns:3,rows:2,column,row});
const original=(column:number)=>({src:'/assets/collection-concept.webp',columns:3,rows:1,column,row:0});
// All amounts, sizes and availability below are illustrative fixtures, never live offers.
export const products:Product[]=[
  {id:'sculpted-drape',slug:'sculpted-drape',name:'The Sculpted Drape',category:'dresses',collection:'abundance',price:42000,currency:'USD',description:'Asymmetric folds and a fluid line, exploring the expressive depth of burgundy.',image:original(0),variants:variant(['XS','S','M','L'],'burgundy',['XS']),newArrival:true,featured:true,rank:1,introduced:9},
  {id:'tailored-form',slug:'tailored-form',name:'The Tailored Form',category:'tops',collection:'the-considered-edit',price:29000,currency:'USD',description:'A softly structured cream jacket, shown with tan trousers. Sample price refers to the jacket.',image:original(1),variants:variant(['XS','S','M','L','XL'],'cream',['XL']),newArrival:false,featured:true,rank:2,introduced:4},
  {id:'modern-trench',slug:'modern-trench',name:'The Modern Trench',category:'outerwear',collection:'the-considered-edit',price:65000,currency:'USD',description:'A generous tan layer with a deliberate silhouette. A study in quiet confidence.',image:original(2),variants:variant(['S','M','L','XL'],'tan',['S']),newArrival:false,featured:true,rank:3,introduced:3},
  {id:'ivory-column',slug:'ivory-column',name:'The Ivory Column',category:'dresses',collection:'abundance',price:39500,currency:'USD',description:'A long cream silhouette with a clean neckline and a sense of ease.',image:studio(0),variants:variant(['XS','S','M','L'],'cream'),newArrival:true,featured:false,rank:4,introduced:8},
  {id:'satin-expression',slug:'satin-expression',name:'The Satin Expression',category:'tops',collection:'abundance',price:18500,currency:'USD',description:'Burgundy sheen and soft movement. The sample price is for the blouse, shown styled with cream trousers.',image:studio(1),variants:variant(['XS','S','M','L','XL'],'burgundy',['XS','S','M','L','XL']),newArrival:true,featured:false,rank:5,introduced:7},
  {id:'wide-leg',slug:'wide-leg',name:'The Wide-Leg Trouser',category:'bottoms',collection:'the-considered-edit',price:24000,currency:'USD',description:'A warm tan foundation with a long, relaxed line. Sample price refers to the trousers.',image:studio(2),variants:variant(['XS','S','M','L','XL'],'tan',['XS','XL']),newArrival:false,featured:true,rank:6,introduced:2},
  {id:'soft-sculpture',slug:'soft-sculpture',name:'The Soft Sculpture Top',category:'tops',collection:'abundance',price:21000,currency:'USD',description:'Cream folds form a sculptural neckline. A concept top, styled with a tan skirt.',image:studio(0,1),variants:variant(['XS','S','M','L'],'cream',['L']),newArrival:true,featured:false,rank:7,introduced:6},
  {id:'arc-bag',slug:'arc-bag',name:'The Arc Bag',category:'accessories',collection:'abundance',price:27500,currency:'USD',description:'A curved burgundy silhouette and a considered finishing gesture. An illustrative accessory concept.',image:studio(1,1),variants:variant(['One size'],'burgundy'),newArrival:false,featured:true,rank:8,introduced:1},
  {id:'longline-coat',slug:'longline-coat',name:'The Longline Coat',category:'outerwear',collection:'the-considered-edit',price:59500,currency:'USD',description:'A cream outer layer with a confident, elongated form. Styled with a tan ensemble.',image:studio(2,1),variants:variant(['S','M','L','XL'],'cream',['XL']),newArrival:true,featured:false,rank:9,introduced:5},
];
export type CatalogContext={category?:string;collection?:string;preset?:'new'|'best'|'ready';wishlist?:boolean};
export type Filters={q:string;category:string[];collection:string[];size:string[];color:string[];min:number|null;max:number|null;available:boolean;sort:string;page:number};
export const sorts=[['featured','Featured'],['newest','Newest first'],['price-asc','Price: low to high'],['price-desc','Price: high to low'],['name','Name: A–Z']] as const;
const many=(p:URLSearchParams,key:string,allowed:readonly string[])=>Array.from(new Set((p.get(key)||'').split(',').filter(v=>allowed.includes(v))));
const amount=(value:string|null)=>value!==null&&value.trim()!==''&&Number.isFinite(Number(value))&&Number(value)>=0?Math.min(10000000,Math.round(Number(value)*100)):null;
export function parseFilters(p:URLSearchParams):Filters {
  const rawPage=Number(p.get('page'));const min=amount(p.get('min'));const max=amount(p.get('max'));
  return {q:(p.get('q')||'').trim().slice(0,150),category:many(p,'category',categories.map(x=>x.slug)),collection:many(p,'collection',collections.map(x=>x.slug)),size:many(p,'size',sizes),color:many(p,'color',colors.map(x=>x.slug)),min,max,available:p.get('available')==='1',sort:sorts.some(([key])=>key===p.get('sort'))?p.get('sort')!:'featured',page:Number.isInteger(rawPage)&&rawPage>0?Math.min(rawPage,100000):1};
}
export function filterProducts(items:Product[],filters:Filters,context:CatalogContext={},saved:string[]=[]):Product[]{
  const result=items.filter(p=>{
    if(context.category&&p.category!==context.category||context.collection&&p.collection!==context.collection)return false;
    if(context.preset==='new'&&!p.newArrival||context.preset==='best'&&!p.featured||context.preset==='ready'&&p.category==='accessories'||context.wishlist&&!saved.includes(p.id))return false;
    const cat=categories.find(c=>c.slug===p.category)?.name||'';const collection=collections.find(c=>c.slug===p.collection)?.name||'';
    if(filters.q&&!`${p.name} ${p.description} ${cat} ${collection} ${p.variants.map(v=>v.color).join(' ')}`.toLowerCase().includes(filters.q.toLowerCase()))return false;
    if(filters.category.length&&!filters.category.includes(p.category)||filters.collection.length&&!filters.collection.includes(p.collection))return false;
    if(filters.min!==null&&p.price<filters.min||filters.max!==null&&p.price>filters.max)return false;
    // Size, color, and availability must match the SAME variant.
    return p.variants.some(v=>(!filters.size.length||filters.size.includes(v.size))&&(!filters.color.length||filters.color.includes(v.color))&&(!filters.available||v.available));
  });
  return result.sort((a,b)=>filters.sort==='price-asc'?a.price-b.price||a.rank-b.rank:filters.sort==='price-desc'?b.price-a.price||a.rank-b.rank:filters.sort==='newest'?b.introduced-a.introduced:filters.sort==='name'?a.name.localeCompare(b.name):a.rank-b.rank);
}
export const PAGE_SIZE=6;
export function paginate(items:Product[],requested:number){const pages=Math.max(1,Math.ceil(items.length/PAGE_SIZE));const page=Math.min(Math.max(1,requested),pages);return {items:items.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE),pages,page};}
export function money(amount:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(amount/100);}
export interface CatalogProvider { list():Promise<Product[]>; }
// Swap only this adapter for the commerce service in Phase 7.
export const fixtureCatalog:CatalogProvider={async list(){return products;}};
