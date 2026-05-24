import { useState, useEffect } from "react";

const WA_NUMBER = "8617815651586"; // no + sign for wa.me links

const BASE_PRODUCTS = [
  { id:1,  name:"Crocs Classic Clog",       category:"Crocs",    basePrice:35,  tag:"Popular",   condition:null,         desc:"Iconic comfort clogs, multiple sizes & colours available." },
  { id:2,  name:"Crocs Slide Sandal",        category:"Crocs",    basePrice:22,  tag:null,        condition:null,         desc:"Lightweight slides perfect for everyday wear." },
  { id:3,  name:"iPhone 15 Pro Max",         category:"iPhones",  basePrice:980, tag:"New",       condition:"Brand New",  desc:"Latest Apple flagship. Sealed box, full warranty." },
  { id:4,  name:"iPhone 14",                 category:"iPhones",  basePrice:520, tag:null,        condition:"Brand New",  desc:"A15 Bionic chip. Brand new, sealed." },
  { id:5,  name:"iPhone 13 Pro",             category:"iPhones",  basePrice:380, tag:"Deal",      condition:"Pre-Owned",  desc:"Grade A condition. Fully tested, 90-day warranty." },
  { id:6,  name:"iPhone 12",                 category:"iPhones",  basePrice:260, tag:null,        condition:"Pre-Owned",  desc:"Grade B. Minor signs of use, works perfectly." },
  { id:7,  name:"Samsung Galaxy S24 Ultra",  category:"Android",  basePrice:850, tag:"New",       condition:"Brand New",  desc:"Flagship Android. S-Pen included." },
  { id:8,  name:"Xiaomi 14 Pro",             category:"Android",  basePrice:480, tag:null,        condition:"Brand New",  desc:"Leica cameras. Top-tier performance." },
  { id:9,  name:"Baby Romper Set (3-pack)",  category:"Baby",     basePrice:18,  tag:"Bestseller",condition:null,         desc:"Soft cotton rompers. Ages 0–24 months." },
  { id:10, name:"Baby Winter Jacket",        category:"Baby",     basePrice:24,  tag:null,        condition:null,         desc:"Plush-lined jacket. Sizes 6m–3yr." },
  { id:11, name:"Baby Sneakers",             category:"Baby",     basePrice:14,  tag:null,        condition:null,         desc:"Anti-slip sole, soft leather look." },
  { id:12, name:"Coach Tabby Handbag",       category:"Handbags", basePrice:180, tag:"Trending",  condition:null,         desc:"Signature Coach leather. Classic quilted design." },
  { id:13, name:"Chanel Classic Flap",       category:"Handbags", basePrice:95,  tag:null,        condition:null,         desc:"Premium quality. Chain strap, gold hardware." },
  { id:14, name:"Coach Crossbody Mini",      category:"Handbags", basePrice:120, tag:null,        condition:null,         desc:"Compact crossbody, genuine leather finish." },
];

const CATEGORIES = ["All","Crocs","iPhones","Android","Baby","Handbags"];
const catIcons = { All:"✦", Crocs:"👟", iPhones:"📱", Android:"📲", Baby:"🍼", Handbags:"👜" };

const CURRENCIES = {
  USD:{ symbol:"$", label:"USD", name:"US Dollar" },
  ZAR:{ symbol:"R", label:"ZAR", name:"South African Rand" },
  ZMW:{ symbol:"K", label:"ZMW", name:"Zambian Kwacha" },
  BWP:{ symbol:"P", label:"BWP", name:"Botswana Pula" },
};
const DEFAULT_RATES = { USD:1, ZAR:18.5, ZMW:27.2, BWP:13.8 };

// ── Helpers ──────────────────────────────────────────────────────────
const waLink = (product, priceStr) => {
  const msg = encodeURIComponent(
    `Hi Mageba Imports! 👋\n\nI'd like to order:\n\n🛍️ *${product.name}*\n💰 Price: ${priceStr}\n${product.condition ? `📦 Condition: ${product.condition}\n` : ""}\nPlease let me know availability and delivery details. Thank you!`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
};

const waCartLink = (cart, fmt) => {
  const lines = cart.map(i => `• ${i.name} x${i.qty} — ${fmt(i.basePrice * i.qty)}`).join("\n");
  const total = cart.reduce((s,i) => s + i.basePrice * i.qty, 0);
  const msg = encodeURIComponent(
    `Hi Mageba Imports! 👋\n\nI'd like to order the following:\n\n${lines}\n\n💰 *Total: ${fmt(total)}*\n\nPlease confirm availability and delivery. Thank you!`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
};

// ── Product Visual ───────────────────────────────────────────────────
const ProductVisual = ({ category }) => {
  const palettes = {
    Crocs:    { bg:"#2A3520", acc:"#7A9A5A" },
    iPhones:  { bg:"#1E2030", acc:"#6A7AAA" },
    Android:  { bg:"#201E30", acc:"#8A6AAA" },
    Baby:     { bg:"#302020", acc:"#AA7A6A" },
    Handbags: { bg:"#2C2015", acc:"#AA8A5A" },
  };
  const p = palettes[category] || { bg:"#252020", acc:"#8A7A6A" };
  const icon = catIcons[category] || "✦";
  return (
    <svg width="100%" height="100%" viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="300" fill={p.bg}/>
      <rect x="30" y="30" width="220" height="240" rx="2" fill="none" stroke={p.acc} strokeWidth="0.8" opacity="0.3"/>
      <circle cx="140" cy="148" r="60" fill={p.acc} opacity="0.07"/>
      <circle cx="140" cy="148" r="40" fill="none" stroke={p.acc} strokeWidth="0.6" opacity="0.3"/>
      <text x="140" y="162" textAnchor="middle" fontSize="36" opacity="0.65">{icon}</text>
      <tex
