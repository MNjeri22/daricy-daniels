import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here),base='/daricy-daniels/';
export default defineConfig({root:here,base,publicDir:path.join(root,'public'),plugins:[{name:'pages-css-paths',enforce:'pre',transform(code,id){if(id.endsWith('.css'))return code.replaceAll("'/assets/",`'${base}assets/`).replaceAll('"/assets/',`"${base}assets/`);}},react()],resolve:{alias:[{find:'@',replacement:root},{find:'next/navigation',replacement:path.join(here,'navigation.ts')},{find:/^react\/jsx-runtime$/,replacement:path.join(here,'jsx-runtime.mjs')}]},build:{outDir:path.join(root,'pages-dist'),emptyOutDir:true}});
