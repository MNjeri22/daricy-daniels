import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export const metadata={title:'Signature favorites',alternates:{canonical:'/best-sellers'}};
export default function Page({searchParams}:{searchParams:SearchParams}){return <CatalogPage searchParams={searchParams} context={{preset:'best'}} title="Signature favorites." description="A considered selection from our concept collection. No sales ranking is implied by this preview."/>;}
