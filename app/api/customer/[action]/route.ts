import {env} from 'cloudflare:workers';
import {database} from '@/lib/server/runtime';
import {BackendError} from '@/lib/server/core';
import {customerAction,resetMailer} from '@/lib/server/customer';
export const dynamic='force-dynamic';
async function handle(request:Request,{params}:{params:Promise<{action:string}>}){try{const config={origin:env.CUSTOMER_APP_ORIGIN,emailKey:env.RESEND_API_KEY,emailFrom:env.CUSTOMER_EMAIL_FROM};return await customerAction(database(),request,(await params).action,config,resetMailer(config));}catch(error){if(!(error instanceof BackendError))console.error('Customer account request failed.');return Response.json({error:error instanceof BackendError?error.message:'Your account could not be reached. Please try again.',code:error instanceof BackendError?error.code:'ACCOUNT_UNAVAILABLE'},{status:error instanceof BackendError?error.status:503,headers:{'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});}}
export {handle as GET,handle as POST};
