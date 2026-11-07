import {CommerceClient,commerceLive} from '@/lib/server/commerce';
import {commerceConfig} from '@/lib/server/store-catalog';
import {sessionCustomer} from '@/lib/server/customer';
import {guestCookie} from '@/lib/server/commerce-http';
import {env} from 'cloudflare:workers';
import {database} from '@/lib/server/runtime';
import {BackendError} from '@/lib/server/core';
import {customerAction,resetMailer} from '@/lib/server/customer';
export const dynamic='force-dynamic';
async function handle(request:Request,{params}:{params:Promise<{action:string}>}){try{const config={origin:env.CUSTOMER_APP_ORIGIN,emailKey:env.RESEND_API_KEY,emailFrom:env.CUSTOMER_EMAIL_FROM};const action=(await params).action,commerce=commerceConfig();if(action==='orders'&&request.method==='GET'&&commerceLive(commerce)){const customer=await sessionCustomer(database(),request,config);if(!customer)throw new BackendError(401,'SIGN_IN_REQUIRED','Sign in to see your orders.');return Response.json({orders:await new CommerceClient(commerce).orders('user:'+customer.id)},{headers:{'Cache-Control':'no-store, private','Vary':'Cookie'}});}const response=await customerAction(database(),request,action,config,resetMailer(config));if(action==='logout')response.headers.append('Set-Cookie',guestCookie(config,'',true));return response;}catch(error){if(!(error instanceof BackendError))console.error('Customer account request failed.');return Response.json({error:error instanceof BackendError?error.message:'Your account could not be reached. Please try again.',code:error instanceof BackendError?error.code:'ACCOUNT_UNAVAILABLE'},{status:error instanceof BackendError?error.status:503,headers:{'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});}}
export {handle as GET,handle as POST};
