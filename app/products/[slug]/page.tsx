import {notFound} from 'next/navigation';
import {storeCatalog} from '@/lib/server/store-catalog';
import {ProductPage} from '@/components/storefront/product-page';
type Params={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Params){const {slug}=await params;const product=(await storeCatalog()).items.find(p=>p.slug===slug);return {title:product?.name||'Piece not found',description:product?.description,alternates:{canonical:`/products/${slug}`}};}
export default async function Page({params}:Params){const {slug}=await params;const items=(await storeCatalog()).items;const product=items.find(p=>p.slug===slug);if(!product)notFound();return <ProductPage key={product.id} product={product} items={items}/>;}
