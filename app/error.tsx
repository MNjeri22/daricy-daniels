'use client';
import {StoreHeader} from '@/components/storefront/store-header';
import {Footer} from '@/components/storefront/home-page';
export default function Error({reset}:{reset:()=>void}){return <><StoreHeader/><main id="main" className="editorial-page"><p className="eyebrow">A MOMENT TO PAUSE</p><h1>Let’s try<br/><em>that again.</em></h1><p className="lead" role="alert">We couldn’t load this edit. Please try again or return to our world.</p><button className="button" onClick={reset}>Try again</button><p style={{marginTop:24}}><a className="text-link" href="/">Return home</a></p></main><Footer/></>;}
