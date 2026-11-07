'use client';
import {createContext,useContext} from 'react';
import {products,type Product} from '@/lib/commerce/catalog';
type StoreCatalog={items:Product[];mode:'preview'|'live'};
const Context=createContext<StoreCatalog>({items:products,mode:'preview'});
export function StoreCatalogProvider({items,mode,children}:StoreCatalog&{children:React.ReactNode}){return <Context.Provider value={{items,mode}}>{children}</Context.Provider>;}
export const useStoreCatalog=()=>useContext(Context);
