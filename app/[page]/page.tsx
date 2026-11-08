import { notFound } from 'next/navigation';
import {NewsletterPage} from '@/components/storefront/newsletter';
import {StoreHeader} from '@/components/storefront/store-header';
import { SimpleHeader, Footer } from '@/components/storefront/home-page';
import { carePages } from '@/lib/storefront-content';
export async function generateMetadata({params}:{params:Promise<{page:string}>}){const {page}=await params;return {title:page==='newsletter'?'The inner circle':carePages[page]?.title||'Page not found'};}
export default async function Care({params}:{params:Promise<{page:string}>}){const {page}=await params;if(page==='newsletter')return <><StoreHeader/><NewsletterPage/><Footer/></>;const data=carePages[page];if(!data)notFound();return <><SimpleHeader/><main className="editorial-page"><p className="eyebrow">DARICY DANIELS / CLIENT SERVICES</p><h1>{data.title}</h1><p className="lead">{data.intro}</p><div className="care-items">{data.items.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}</div><a href="/" className="text-link">Return to our world</a></main><Footer/></>;}
