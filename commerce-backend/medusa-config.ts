import {loadEnv,defineConfig} from '@medusajs/framework/utils';
import {randomBytes} from 'node:crypto';
loadEnv(process.env.NODE_ENV||'development',process.cwd());
const production=process.env.NODE_ENV==='production';
function secret(name:string){const value=process.env[name];if(value&&value.length>=32)return value;if(production)throw new Error(`${name} must be configured with at least 32 random characters.`);return randomBytes(32).toString('hex');}
for(const name of ['DATABASE_URL','STORE_CORS','ADMIN_CORS','AUTH_CORS','COMMERCE_BRIDGE_SECRET'])if(production&&!process.env[name])throw new Error(`${name} is required for production.`);
if(production&&!process.env.REDIS_URL)throw new Error('REDIS_URL is required for production locking and durable workflows.');
if(production&&(process.env.COMMERCE_BRIDGE_SECRET||'').length<32)throw new Error('COMMERCE_BRIDGE_SECRET must contain at least 32 random characters.');
const redis=process.env.REDIS_URL;
module.exports=defineConfig({projectConfig:{databaseUrl:process.env.DATABASE_URL,workerMode:(process.env.MEDUSA_WORKER_MODE||'shared') as 'shared'|'server'|'worker',http:{storeCors:process.env.STORE_CORS||'http://localhost:5173',adminCors:process.env.ADMIN_CORS||'http://localhost:9000',authCors:process.env.AUTH_CORS||'http://localhost:9000,http://localhost:5173',jwtSecret:secret('JWT_SECRET'),cookieSecret:secret('COOKIE_SECRET')}},admin:{disable:process.env.MEDUSA_WORKER_MODE==='worker'||process.env.MEDUSA_DISABLE_ADMIN==='true'},modules:[{resolve:'./src/modules/daricy'},...(redis?[{resolve:'@medusajs/medusa/event-bus-redis',options:{redisUrl:redis}},{resolve:'@medusajs/medusa/workflow-engine-redis',options:{redis:{redisUrl:redis}}},{resolve:'@medusajs/medusa/locking',options:{providers:[{resolve:'@medusajs/medusa/locking-redis',id:'locking-redis',is_default:true,options:{redisUrl:process.env.LOCKING_REDIS_URL||redis}}]}}]:[])]});
