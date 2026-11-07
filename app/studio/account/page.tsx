import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {StoreHeader} from '@/components/storefront/store-header';
import {Footer} from '@/components/storefront/home-page';
import {Account} from '@/components/storefront/account';
import {backendConfig} from '@/lib/server/runtime';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();return <><StoreHeader/>{user?<Account displayName={user.displayName} owner={user.email.toLowerCase()===backendConfig().STORE_OWNER_EMAIL?.toLowerCase()}/>:<main id="main" className="account-main"><h1>Your private studio edit.</h1><a className="button" href={chatGPTSignInPath('/studio/account')}>Sign in to the studio</a></main>}<Footer/></>;}
