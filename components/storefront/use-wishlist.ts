'use client';
import {useEffect,useState} from 'react';
export const WISHLIST_KEY='dd-concept-wishlist';
export function useWishlist(){
  const [saved,setSaved]=useState<string[]>([]),[ready,setReady]=useState(false);
  useEffect(()=>{function load(){try{const value:unknown=JSON.parse(localStorage.getItem(WISHLIST_KEY)||'[]');setSaved(Array.isArray(value)?Array.from(new Set(value.filter((v):v is string=>typeof v==='string'&&/^[a-z0-9-]{1,80}$/.test(v)))):[]);}catch{setSaved([]);}setReady(true);}load();window.addEventListener('storage',load);window.addEventListener('dd-wishlist',load);return()=>{window.removeEventListener('storage',load);window.removeEventListener('dd-wishlist',load);};},[]);
  function toggle(id:string){setSaved(prev=>{const next=prev.includes(id)?prev.filter(v=>v!==id):[...prev,id];try{localStorage.setItem(WISHLIST_KEY,JSON.stringify(next));}catch{}return next;});}
  return {saved,ready,toggle};
}
