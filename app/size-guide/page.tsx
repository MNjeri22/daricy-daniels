import {StoreHeader} from '@/components/storefront/store-header';
import {Footer} from '@/components/storefront/home-page';
import {SizeGuide} from '@/components/storefront/size-guide';
import '@/components/storefront/product.css';
export const metadata={title:'Size guide',alternates:{canonical:'/size-guide'}};
export default function Page(){return <><StoreHeader/><main id="main" className="editorial-page"><SizeGuide/></main><Footer/></>;}
