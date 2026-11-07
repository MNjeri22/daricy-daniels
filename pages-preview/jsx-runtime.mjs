import * as runtime from '../node_modules/react/jsx-runtime.js';
import {pagesProps} from './paths.mjs';
export const Fragment=runtime.Fragment;
export function jsx(type,props,key){return runtime.jsx(type,pagesProps(type,props,import.meta.env.BASE_URL),key);}
export function jsxs(type,props,key){return runtime.jsxs(type,pagesProps(type,props,import.meta.env.BASE_URL),key);}
