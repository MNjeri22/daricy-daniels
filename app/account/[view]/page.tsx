import {notFound} from 'next/navigation';
import {StoreHeader} from '@/components/storefront/store-header';
import {Footer} from '@/components/storefront/home-page';
import {CustomerAccount,type AccountView} from '@/components/storefront/customer-account';
export const dynamic='force-dynamic';
export const metadata={title:'Your customer account',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function Page({params}:{params:Promise<{view:string}>}){const {view}=await params;if(!['login','register','forgot-password','reset-password','orders','addresses'].includes(view))notFound();return <><StoreHeader/><CustomerAccount view={view as AccountView}/><Footer/></>;}
