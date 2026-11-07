import {notFound} from 'next/navigation';
import {fixtureCatalog} from '@/lib/commerce/catalog';
import {ProductPage} from '@/components/storefront/product-page';
type Params={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Params){const {slug}=await params;const product=(await fixtureCatalog.list()).find(p=>p.slug===slug);return {title:product?.name||'Piece not found',description:product?.description,alternates:{canonical:`/products/${slug}`}};}
export default async function Page({params}:Params){const {slug}=await params;const items=await fixtureCatalog.list();const product=items.find(p=>p.slug===slug);if(!product)notFound();return <ProductPage key={product.id} product={product} items={items}/>;}
