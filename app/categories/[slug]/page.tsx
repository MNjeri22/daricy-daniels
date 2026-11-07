import {notFound} from 'next/navigation';
import {categories} from '@/lib/commerce/catalog';
import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=categories.find(c=>c.slug===slug);return {title:c?.name||'Category not found',alternates:{canonical:`/categories/${slug}`}};}
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:SearchParams}){const {slug}=await params;const c=categories.find(c=>c.slug===slug);if(!c)notFound();return <CatalogPage searchParams={searchParams} context={{category:slug}} title={c.name+'.'} description={c.description}/>;}
