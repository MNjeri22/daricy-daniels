import {chatGPTSignInPath} from '@/app/chatgpt-auth';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {StoreHeader} from '@/components/storefront/store-header';
import {Footer,Icon} from '@/components/storefront/home-page';
import {Account} from '@/components/storefront/account';
import {backendConfig} from '@/lib/server/runtime';
export const dynamic='force-dynamic';
export const metadata={title:'Your account',alternates:{canonical:'/account'}};
export default async function Page(){const user=await getChatGPTUser();return <><StoreHeader/>{user?<Account displayName={user.displayName} owner={user.email.toLowerCase()===backendConfig().STORE_OWNER_EMAIL?.toLowerCase()}/>:<main id="main" className="account-main"><p className="eyebrow">YOUR DARICY DANIELS WORLD</p><h1>A more personal<br/><em>experience.</em></h1><div className="account-options"><section><h2>Your private edit.</h2><p>Sign in with ChatGPT to save your sample bag and wishlist securely with this store account.</p><a className="button" href={chatGPTSignInPath('/account')} target="_top">Sign in with ChatGPT <Icon name="arrow"/></a></section><section><h2>Here as a guest?</h2><p>Continue exploring the checkout preview. Purchasing is not yet enabled.</p><a className="text-link" href="/checkout">Continue to checkout <Icon name="arrow"/></a></section></div></main>}<Footer/></>;}
