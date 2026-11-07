import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export const metadata={title:'Ready-to-wear',alternates:{canonical:'/ready-to-wear'}};
export default function Page({searchParams}:{searchParams:SearchParams}){return <CatalogPage searchParams={searchParams} context={{preset:'ready'}} title="Ready for your world." description="Dresses, separates, and outerwear. An expressive wardrobe, considered together."/>;}
