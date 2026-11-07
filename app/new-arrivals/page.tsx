import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export const metadata={title:'New arrivals',alternates:{canonical:'/new-arrivals'}};
export default function Page({searchParams}:{searchParams:SearchParams}){return <CatalogPage searchParams={searchParams} context={{preset:'new'}} title="New expressions." description="A fresh perspective. Discover the newest sample silhouettes in our edit."/>;}
