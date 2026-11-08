import {CatalogPage,type SearchParams} from '@/lib/commerce/catalog-page';
export const metadata={title:'Exclusively bags',alternates:{canonical:'/bags'}};
export default function Page({searchParams}:{searchParams:SearchParams}){return <CatalogPage searchParams={searchParams} context={{category:'bags'}} title="Exclusively bags." description="Sculptural silhouettes in burgundy and denim blue. Explore the Daricy Daniels bags edit."/>;}
