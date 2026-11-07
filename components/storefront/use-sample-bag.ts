'use client';
import {useEffect,useState} from 'react';
import {products,type Product} from '@/lib/commerce/catalog';
import {SAMPLE_BAG_KEY,readBag,addSampleLine,type BagLine} from '@/lib/commerce/product';
import {lineKey,updateBagLine} from '@/lib/commerce/checkout';
export function useSampleBag(){
 const [lines,setLines]=useState<BagLine[]>([]),[ready,setReady]=useState(false),[warning,setWarning]=useState('');
 useEffect(()=>{function load(){try{const raw=JSON.parse(localStorage.getItem(SAMPLE_BAG_KEY)||'[]'),safe=readBag(raw,products);setLines(safe);setWarning(Array.isArray(raw)&&JSON.stringify(raw)!==JSON.stringify(safe)?'Some saved selections were unavailable or invalid and have been removed. Please review your bag.':'');}catch{setLines([]);setWarning('Your saved bag could not be read. You can start a new selection.');}setReady(true);}load();window.addEventListener('storage',load);window.addEventListener('dd-bag',load);return()=>{window.removeEventListener('storage',load);window.removeEventListener('dd-bag',load);};},[]);
 function mutate(change:(current:BagLine[])=>BagLine[]){let current:BagLine[];try{current=readBag(JSON.parse(localStorage.getItem(SAMPLE_BAG_KEY)||'[]'),products);}catch{current=lines;}const next=change(current);try{localStorage.setItem(SAMPLE_BAG_KEY,JSON.stringify(next));}catch{throw new Error('Your browser could not save the bag. Allow site storage and try again.');}setLines(next);setWarning('');window.dispatchEvent(new Event('dd-bag'));}
 function add(product:Product,color:string,size:string,quantity:number){mutate(current=>addSampleLine(current,product,color,size,quantity));}
 function update(key:string,patch:Partial<Pick<BagLine,'color'|'size'|'quantity'>>){mutate(current=>updateBagLine(current,key,patch,products));}
 function remove(key:string){mutate(current=>current.filter(l=>lineKey(l)!==key));}
 return {lines,ready,warning,add,update,remove,count:lines.reduce((sum,l)=>sum+l.quantity,0)};
}
