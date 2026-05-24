import { useState, useEffect } from "react";

const WA_NUMBER = "8617815651586";

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
const DEFAULT_RATES = { USD:1, ZAR:18.5, ZMW:27.2, BWP:13.8 };const waLink = (product, priceStr) => {
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
      <text x="140" y="260" textAnchor="middle" fill={p.acc} fontSize="8" fontFamily="sans-serif" letterSpacing="3" opacity="0.5">{category.toUpperCase()}</text>
    </svg>
  );
};

const AdminPanel = ({ rates, onUpdateRates, onClose }) => {
  const [draft, setDraft] = useState({ ...rates });
  const [saved, setSaved] = useState(false);
  const handle = (cur, val) => { setDraft(d => ({ ...d, [cur]: parseFloat(val)||0 })); setSaved(false); };
  const save = () => { onUpdateRates(draft); setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
      <div style={{ background:"#1A1610",border:"1px solid #3A2E20",padding:"clamp(24px,5vw,48px)",width:"100%",maxWidth:"460px",fontFamily:"'Cormorant Garamond',serif" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"28px" }}>
          <div>
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"9px",letterSpacing:"4px",color:"#7A5C3E",textTransform:"uppercase",marginBottom:"8px" }}>Admin Panel</p>
            <h2 style={{ fontSize:"26px",fontWeight:300,color:"#F5F2EE" }}>Currency Rates</h2>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#6B6058",fontSize:"20px",cursor:"pointer" }}>✕</button>
        </div>
        <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"11px",color:"#6B6058",lineHeight:1.7,marginBottom:"28px" }}>Set how much 1 USD equals in each currency. Prices update instantly across the store.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:"18px" }}>
          {Object.entries(CURRENCIES).filter(([k])=>k!=="USD").map(([key,cur])=>(
            <div key={key} style={{ display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap" }}>
              <div style={{ width:"110px" }}>
                <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"10px",letterSpacing:"2px",color:"#C9B89A",textTransform:"uppercase" }}>{cur.label}</p>
                <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"10px",color:"#6B6058" }}>{cur.name}</p>
              </div>
              <span style={{ fontFamily:"'Jost',sans-serif",fontSize:"11px",color:"#7A5C3E" }}>$1 =</span>
              <input type="number" value={draft[key]} onChange={e=>handle(key,e.target.value)}
                style={{ background:"#2C2420",border:"1px solid #3A2E20",color:"#F5F2EE",fontFamily:"'Jost',sans-serif",fontSize:"14px",padding:"8px 12px",width:"90px",outline:"none" }}/>
              <span style={{ fontFamily:"'Jost',sans-serif",fontSize:"11px",color:"#6B6058" }}>{cur.symbol}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:"36px",display:"flex",gap:"12px" }}>
          <button onClick={save} style={{ flex:1,fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",background:saved?"#4A7A3A":"#7A5C3E",color:"#F5F2EE",border:"none",padding:"14px",cursor:"pointer",transition:"background .3s" }}>
            {saved?"✓ Saved!":"Save Rates"}
          </bexport default function MagebaImports() {
  const [activeCat, setActiveCat]     = useState("All");
  const [currency, setCurrency]       = useState("USD");
  const [rates, setRates]             = useState(DEFAULT_RATES);
  const [cart, setCart]               = useState([]);
  const [showAdmin, setShowAdmin]     = useState(false);
  const [showCart, setShowCart]       = useState(false);
  const [adminPrompt, setAdminPrompt] = useState(false);
  const [adminKey, setAdminKey]       = useState("");
  const [visible, setVisible]         = useState(false);
  const [mobileMenu, setMobileMenu]   = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const ADMIN_PASSWORD = "mageba2024";

  useEffect(() => { setTimeout(()=>setVisible(true),120); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fmt = (usdPrice) => {
    const v = usdPrice * rates[currency];
    const sym = CURRENCIES[currency].symbol;
    return `${sym}${v.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}`;
  };

  const filtered = activeCat==="All" ? BASE_PRODUCTS : BASE_PRODUCTS.filter(p=>p.category===activeCat);
  const cartQty  = cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal= cart.reduce((s,i)=>s+i.basePrice*i.qty,0);

  const addToCart = (e, product) => {
    e.stopPropagation();
    setCart(c => {
      const ex = c.find(i=>i.id===product.id);
      if (ex) return c.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i);
      return [...c,{...product,qty:1}];
    });
  };
  const removeFromCart = (id) => setCart(c=>c.filter(i=>i.id!==id));
  const tryAdmin = () => {
    if (adminKey===ADMIN_PASSWORD){setShowAdmin(true);setAdminPrompt(false);setAdminKey("");}
    else alert("Incorrect password");
  };

  return (
    <div style={{ fontFamily:"'Cormorant Garamond','Georgia',serif",background:"#F5F2EE",minHeight:"100vh",color:"#1A1610",overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@200;300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .hero-h{font-size:clamp(42px,8vw,108px);font-weight:300;line-height:.92;letter-spacing:-1px;opacity:0;transform:translateY(40px);transition:opacity .9s,transform .9s}
        .hero-h.vis{opacity:1;transform:none}
        .hero-sub{font-family:'Jost',sans-serif;font-weight:200;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#7A5C3E;opacity:0;transition:opacity 1.2s .4s}
        .hero-sub.vis{opacity:1}
        .pcard{cursor:pointer;transition:transform .4s}
        .pcard:hover{transform:translateY(-5px)}
        .pimg{overflow:hidden;background:#EAE5DF;position:relative;aspect-ratio:4/5}
        .pimg svg{width:100%;height:100%;display:block;transition:transform .6s}
        .pcard:hover .pimg svg{transform:scale(1.04)}
        .action-overlay{position:absolute;bottom:0;left:0;right:0;display:flex;flex-direction:column;gap:1px;opacity:0;transition:opacity .3s}
        .pcard:hover .action-overlay{opacity:1}
        @media(max-width:767px){.action-overlay{opacity:1 !important;position:relative;flex-direction:row}}
        .atc{font-family:'Jost',sans-serif;font-weight:300;font-size:10px;letter-spacing:2px;text-transform:uppercase;background:#1A1610;color:#F5F2EE;border:none;padding:11px 8px;cursor:pointer;flex:1;transition:background .3s}
        .atc:hover{background:#3A3020}
        .wa-btn{font-family:'Jost',sans-serif;font-weight:300;font-size:10px;letter-spacing:2px;text-transform:uppercase;background:#25D366;color:#fff;border:none;padding:11px 8px;cursor:pointer;flex:1;transition:background .3s;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:5px}
        .wa-btn:hover{background:#1EB85A}
        .cat-btn{font-family:'Jost',sans-serif;font-weight:300;font-size:10px;letter-spacing:2px;text-transform:uppercase;background:none;border:none;cursor:pointer;padding:8px 12px;color:#6B6058;border-bottom:2px solid transparent;transition:all .3s;white-space:nowrap}
        .cat-btn:hover{color:#1A1610}
        .cat-btn.on{color:#1A1610;border-bottom-color:#7A5C3E}
        .cur-btn{font-family:'Jost',sans-serif;font-weight:300;font-size:10px;letter-spacing:2px;background:none;border:1px solid #DDD5C8;cursor:pointer;padding:6px 10px;color:#6B6058;transition:all .3s}
        .cur-btn:hover,.cur-btn.on{background:#1A1610;color:#F5F2EE;border-color:#1A1610}
        .tag{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;background:#7A5C3E;color:#F5F2EE;padding:3px 7px;position:absolute;top:10px;left:10px;z-index:1}
        .cond{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:1px;text-transform:uppercase;background:#2C2420;color:#C9B89A;padding:3px 7px;posi{adminPrompt && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"#1A1610",border:"1px solid #3A2E20",padding:"40px",width:"100%",maxWidth:"320px" }}>
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#7A5C3E",marginBottom:"20px" }}>Admin Access</p>
            <input type="password" placeholder="Enter password" value={adminKey}
              onChange={e=>setAdminKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryAdmin()}
              style={{ width:"100%",background:"#2C2420",border:"1px solid #3A2E20",color:"#F5F2EE",fontFamily:"'Jost',sans-serif",fontSize:"13px",padding:"10px 14px",marginBottom:"16px" }}
            />
            <div style={{ display:"flex",gap:"12px" }}>
              <button onClick={tryAdmin} style={{ flex:1,fontFamily:"'Jost',sans-serif",fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",background:"#7A5C3E",color:"#F5F2EE",border:"none",padding:"12px",cursor:"pointer" }}>Enter</button>
              <button onClick={()=>{setAdminPrompt(false);setAdminKey("");}} style={{ fontFamily:"'Jost',sans-serif",fontSize:"10px",background:"none",border:"1px solid #3A2E20",color:"#6B6058",padding:"12px 14px",cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showAdmin && <AdminPanel rates={rates} onUpdateRates={r=>{setRates(r);setShowAdmin(false);}} onClose={()=>setShowAdmin(false)}/>}
      <div className={`mob-menu ${mobileMenu?"open":""}`}>
        <button onClick={()=>setMobileMenu(false)} style={{ position:"absolute",top:"24px",right:"24px",background:"none",border:"none",color:"#C9B89A",fontSize:"24px",cursor:"pointer" }}>✕</button>
        {["Shop","About","Track Order"].map(l=>(
          <span key={l} className="mob-nav-lnk" onClick={()=>setMobileMenu(false)}>{l}</span>
        ))}
        <span className="mob-nav-lnk" style={{ color:"#7A5C3E" }} onClick={()=>{setAdminPrompt(true);setMobileMenu(false);}}>Admin</span>
      </div>
      <div className={`cart-panel ${showCart?"open":""}`}>
        <div style={{ padding:"22px 24px",borderBottom:"1px solid #DDD5C8",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"9px",letterSpacing:"4px",color:"#7A5C3E",textTransform:"uppercase",marginBottom:"4px" }}>Your</p>
            <h3 style={{ fontSize:"22px",fontWeight:300 }}>Cart ({cartQty})</h3>
          </div>
          <button onClick={()=>setShowCart(false)} style={{ background:"none",border:"none",fontSize:"20px",cursor:"pointer",color:"#6B6058" }}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"18px 24px" }}>
          {cart.length===0 ? (
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"12px",color:"#9A8878",marginTop:"40px",textAlign:"center",letterSpacing:"1px" }}>Your cart is empty</p>
          ) : cart.map(item=>(
            <div key={item.id} style={{ display:"flex",gap:"14px",marginBottom:"20px",paddingBottom:"20px",borderBottom:"1px solid #EAE5DF" }}>
              <div style={{ width:"64px",height:"72px",background:"#EAE5DF",flexShrink:0,overflow:"hidden" }}>
                <ProductVisual category={item.category}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"#9A8878",marginBottom:"3px" }}>{item.category}</p>
                <p style={{ fontSize:"15px",fontWeight:400,marginBottom:"5px" }}>{item.name}</p>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <p style={{ fontFamily:"'Jost',sans-serif",fontSize:"13px",fontWeight:300,color:"#7A5C3E" }}>{fmt(item.basePrice)} × {item.qty}</p>
                  <button onClick={()=>removeFromCart(item.id)} style={{ background:"none",border:"none",color:"#9A8878",cursor:"pointer",fontSize:"11px",fontFamily:"'Jost',sans-serif",letterSpacing:"1px" }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0 && (
          <div style={{ padding:"20px 24px",borderTop:"1px solid #DDD5C8" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"16px" }}>
              <span style={{ fontFamily:"'Jost',sans-serif",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#3A2E22" }}>Total</span>
              <span style={{ fontSize:"20px",fontWeight:400 }}>{fmt(cartTotal)}</span>
            </div>
            <a href={waCartLink(cart,fmt)} target="_blank" rel="noopener noreferrer"
              style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",width:"100%",ba<section className="hero-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"82vh",overflow:"hidden" }}>
        <div className="hero-text" style={{ display:"flex",flexDirection:"column",justifyContent:"center",padding:"72px 64px",gap:"26px" }}>
          <p className={`hero-sub ${visible?"vis":""}`}>China → Southern Africa · Direct Imports</p>
          <h1 className={`hero-h ${visible?"vis":""}`}>
            Zulu<br/>
            <em style={{ fontStyle:"italic",color:"#7A5C3E" }}>makes</em><br/>
            it easy.
          </h1>
          <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:"13px",lineHeight:1.85,color:"#3A2E22",maxWidth:"340px",opacity:visible?1:0,transition:"opacity 1s ease .7s" }}>
            Premium imports — iPhones, Crocs, designer handbags, baby clothing & more — shipped straight from China to your door across Southern Africa.
          </p>
          <div style={{ display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap",opacity:visible?1:0,transition:"opacity 1s ease .9s" }}>
            <button onClick={()=>document.getElementById("products").scrollIntoView({behavior:"smooth"})}
              style={{ fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",background:"#1A1610",color:"#F5F2EE",border:"none",padding:"15px 32px",cursor:"pointer" }}>
              Shop Now
            </button>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Mageba Imports! I'd like to enquire about your products.")}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display:"flex",alignItems:"center",gap:"6px",fontFamily:"'Jost',sans-serif",fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#25D366",borderBottom:"1px solid #25D366",paddingBottom:"2px" }}>
              📲 Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="hero-dark" style={{ background:"#2C2420",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 600 680" style={{ position:"absolute",inset:0 }}>
            <rect width="600" height="680" fill="#2C2420"/>
            <rect x="60" y="60" width="480" height="560" fill="none" stroke="#8B6F5E" strokeWidth="1" opacity="0.2"/>
            <circle cx="300" cy="340" r="160" fill="none" stroke="#7A5C3E" strokeWidth="0.6" opacity="0.3"/>
            <circle cx="300" cy="340" r="110" fill="#3A2E28" opacity="0.4"/>
            {[0,60,120,180,240,300].map(a=>(
              <line key={a} x1={300+200*Math.cos(a*Math.PI/180)} y1={340+200*Math.sin(a*Math.PI/180)} x2={300-200*Math.cos(a*Math.PI/180)} y2={340-200*Math.sin(a*Math.PI/180)} stroke="#7A5C3E" strokeWidth="0.3" opacity="0.12"/>
            ))}
            <text x="300" y="322" textAnchor="middle" fill="#C9B89A" fontSize="52" fontFamily="'Cormorant Garamond',serif" fontWeight="300" opacity="0.9">M</text>
            <text x="300" y="372" textAnchor="middle" fill="#8B6F5E" fontSize="9" fontFamily="'Jost',sans-serif" fontWeight="200" letterSpacing="8" opacity="0.7">IMPORTS</text>
            <text x="300" y="412" textAnchor="middle" fill="#6B5040" fontSize="8" fontFamily="'Jost',sans-serif" letterSpacing="4" opacity="0.5">SINCE 2024</text>
          </svg>
          <div style={{ position:"absolute",bottom:"32px",left:"32px",fontFamily:"'Jost',sans-serif",fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",color:"#C9B89A" }}>🇨🇳 Sourced in China</div>
          <div style={{ position:"absolute",bottom:"32px",right:"32px",fontFamily:"'Jost',sans-serif",fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",color:"#C9B89A",textAlign:"right" }}>Delivered to<br/>Southern Africa</div>
        </div>
      </section>
      <div className="filter-bar" style={{ borderTop:"1px solid #DDD5C8",borderBottom:"1px solid #DDD5C8",background:"#FAF8F5",padding:"10px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px" }}>
        <div className="filter-scroll" style={{ display:"flex",gap:"4px" }}>
          {CATEGORIES.map(c=>(
            <button key={c} className={`cat-btn ${activeCat===c?"on":""}`} onClick={()=>setActiveCat(c)}>{catIcons[c]} {c}</button>
          ))}
        </div>
        <div className="cur-row" style={{ display:"flex",gap:"6px",alignItems:"center",flexShrink:0 }}>
          {!isMobile && <span style={{ fontFamily:"'Jost',sans-serif",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"#9A8878",marginRight:"4px" }}>Currency:</span>}
          {Object.entries(CURRENCIES).map(([key,cur])=>(
            <button key={key} className={`cur-btn ${currency===key?"on":""}`} onClick={()=>setCurrency(key)}>{cur.symbol}{isMobile?"":` ${cur.label}`}</button>
          ))}
        </div>
      </div>
      <section id="products" className="products-pad" style={{ padding:"64px 48px
