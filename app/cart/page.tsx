import {StoreHeader} from '@/components/storefront/store-header';
import {Footer} from '@/components/storefront/home-page';
import {BagContents} from '@/components/storefront/bag';
export const metadata={title:'Your bag',alternates:{canonical:'/cart'}};
export default function Page(){return <><StoreHeader/><main id="main" className="cart-main"><p className="eyebrow">DARICY DANIELS / YOUR BAG</p><h1>Your considered<br/><em>selection.</em></h1><BagContents/></main><Footer/></>;}
