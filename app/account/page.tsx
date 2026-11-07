import {StoreHeader} from '@/components/storefront/store-header';
import {Footer} from '@/components/storefront/home-page';
import {CustomerAccount} from '@/components/storefront/customer-account';
export const dynamic='force-dynamic';
export const metadata={title:'Your customer account',alternates:{canonical:'/account'},robots:{index:false,follow:false}};
export default function Page(){return <><StoreHeader/><CustomerAccount view="overview"/><Footer/></>;}
