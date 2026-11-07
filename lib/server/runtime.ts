import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {BackendError,assertUser,assertOwner,type BackendConfig} from './core';
import type {Database} from './state';
export function backendConfig():BackendConfig{return {MEDUSA_BACKEND_URL:env.MEDUSA_BACKEND_URL,MEDUSA_PUBLISHABLE_KEY:env.MEDUSA_PUBLISHABLE_KEY,STORE_OWNER_EMAIL:env.STORE_OWNER_EMAIL,STRIPE_WEBHOOK_SECRET:env.STRIPE_WEBHOOK_SECRET,SANITY_PROJECT_ID:env.SANITY_PROJECT_ID,TRANSACTIONAL_EMAIL_PROVIDER:env.TRANSACTIONAL_EMAIL_PROVIDER};}
export function database():Database{if(!env.DB)throw new BackendError(503,'STORAGE_UNAVAILABLE','Saved account storage is temporarily unavailable. Try again later.');return env.DB as unknown as Database;}
export async function identity(){const user=await getChatGPTUser();return assertUser(user?.userId);}

export async function requireOwner(){const user=await getChatGPTUser();assertOwner(assertUser(user?.userId),backendConfig(),user?.email);}
