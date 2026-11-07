import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export const metadata={title:'Shop',alternates:{canonical:'/shop'}};
export default function Page({searchParams}:{searchParams:SearchParams}){return <CatalogPage searchParams={searchParams}/>;}
