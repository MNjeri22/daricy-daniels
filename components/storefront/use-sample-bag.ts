'use client';
import {useEffect,useState} from 'react';
import {products,type Product} from '@/lib/commerce/catalog';
import {SAMPLE_BAG_KEY,readBag,addSampleLine,type BagLine} from '@/lib/commerce/product';
export function useSampleBag(){
 const [lines,setLines]=useState<BagLine[]>([]),[ready,setReady]=useState(false);
 useEffect(()=>{function load(){try{setLines(readBag(JSON.parse(localStorage.getItem(SAMPLE_BAG_KEY)||'[]'),products));}catch{setLines([]);}setReady(true);}load();window.addEventListener('storage',load);window.addEventListener('dd-bag',load);return()=>{window.removeEventListener('storage',load);window.removeEventListener('dd-bag',load);};},[]);
 function add(product:Product,color:string,size:string,quantity:number){let current:BagLine[];try{current=readBag(JSON.parse(localStorage.getItem(SAMPLE_BAG_KEY)||'[]'),products);}catch{current=lines;}const next=addSampleLine(current,product,color,size,quantity);try{localStorage.setItem(SAMPLE_BAG_KEY,JSON.stringify(next));}catch{throw new Error('Your browser could not save the sample bag. Allow site storage and try again.');}setLines(next);window.dispatchEvent(new Event('dd-bag'));}
 return {lines,ready,add,count:lines.reduce((sum,l)=>sum+l.quantity,0)};
}
