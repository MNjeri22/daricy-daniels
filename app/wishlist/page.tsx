import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export const metadata={title:'Saved pieces',robots:{index:false,follow:false}};
export default function Page({searchParams}:{searchParams:SearchParams}){return <CatalogPage searchParams={searchParams} context={{wishlist:true}} title="Your personal edit." description="A little room for what catches your eye. Your saved sample pieces stay in this browser."/>;}
