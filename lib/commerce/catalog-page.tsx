import {Shop} from '@/components/storefront/shop';
import {fixtureCatalog,type CatalogContext} from './catalog';
export type SearchParams=Promise<Record<string,string|string[]|undefined>>;
export async function CatalogPage({searchParams,context={},title,description}:{searchParams:SearchParams;context?:CatalogContext;title?:string;description?:string}){const values=await searchParams;const params=new URLSearchParams();for(const [key,value] of Object.entries(values)){if(typeof value==='string')params.set(key,value);else if(Array.isArray(value))params.set(key,value.join(','));}return <Shop items={await fixtureCatalog.list()} initialQuery={params.toString()} context={context} title={title} description={description}/>;}
