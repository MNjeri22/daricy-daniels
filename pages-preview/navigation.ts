import {useSyncExternalStore} from 'react';
const subscribe=(listener:()=>void)=>{window.addEventListener('popstate',listener);return()=>window.removeEventListener('popstate',listener);};
const snapshot=()=>window.location.href;
export function useSearchParams(){useSyncExternalStore(subscribe,snapshot,snapshot);return new URLSearchParams(window.location.search);}
export function useRouter(){return {push(value:string){history.pushState(null,'',value);window.dispatchEvent(new PopStateEvent('popstate'));},replace(value:string){history.replaceState(null,'',value);window.dispatchEvent(new PopStateEvent('popstate'));},back(){history.back();}};}
