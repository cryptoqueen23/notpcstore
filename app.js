
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const products=window.PRODUCTS||[];
const money=v=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v);
const productGrid=$("#productGrid");
let activeFilter="all", activeProduct=null;
const cart=new Map();

function visual(p, large=false){
  if(p.type==="shirt") return `<div class="shirt" style="background:${p.fg==="000000"?"#000":p.fg};color:${p.bg==="#0a0a0a"?"#fff":"#000"}"><span>${p.art}</span></div>`;
  if(p.type==="cap") return `<div class="cap" style="background:#fff;color:#000;position:relative;left:auto;top:auto"><span>${p.art}</span></div>`;
  if(p.type==="mug") return `<div class="mug ${large?"large":""}" style="position:relative;left:auto;top:auto"><span>${p.art}</span></div>`;
  return `<div style="width:62%;aspect-ratio:1;border-radius:28px;background:${p.fg};color:${p.bg};display:grid;place-items:center;font-family:'Archivo Black';font-size:${large?"54px":"34px"};line-height:.85;text-align:center;transform:rotate(-6deg)">${p.art}</div>`;
}

function renderProducts(){
  const q=$("#shopSearch").value.trim().toLowerCase();
  productGrid.innerHTML="";
  products.filter(p=>(activeFilter==="all"||p.category===activeFilter)&&(`${p.name} ${p.desc}`.toLowerCase().includes(q))).forEach(p=>{
    const article=document.createElement("article");
    article.className="product-card";
    article.innerHTML=`
      <div class="product-visual" style="background:${p.bg}">
        <span class="product-badge">${p.badge}</span>
        ${visual(p)}
        <button class="product-quick" type="button">QUICK VIEW ↗</button>
      </div>
      <div class="product-info">
        <div><h3>${p.name}</h3><p>${p.desc}</p></div><strong>${money(p.price)}</strong>
      </div>`;
    article.querySelector(".product-visual").onclick=()=>openQuick(p);
    productGrid.appendChild(article);
  });
}
$("#shopSearch").addEventListener("input",renderProducts);
$$(".filters button").forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;$$(".filters button").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});

const scrim=$("#scrim"), drawer=$("#cartDrawer"), quick=$("#quickview");
function openScrim(){scrim.hidden=false}
function closeScrim(){if(!drawer.classList.contains("open")&&!quick.classList.contains("open"))scrim.hidden=true}
function openBag(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");openScrim()}
function closeBag(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");closeScrim()}
$("#bagOpen").onclick=openBag; $("#bagClose").onclick=closeBag;

function addToCart(p){
  cart.set(p.id,(cart.get(p.id)||0)+1);
  updateCart();
  closeQuick();
  openBag();
  pulseBag();
}
function pulseBag(){
  const b=$("#bagOpen");
  b.animate([{transform:"scale(1)"},{transform:"scale(1.1)"},{transform:"scale(1)"}],{duration:280});
}
function updateCart(){
  const box=$("#cartItems"); box.innerHTML="";
  let total=0,count=0;
  cart.forEach((qty,id)=>{
    const p=products.find(x=>x.id===id); if(!p)return;
    total+=p.price*qty; count+=qty;
    const row=document.createElement("div"); row.className="cart-item";
    row.innerHTML=`<div class="cart-thumb" style="background:${p.bg}"></div><div><h4>${p.name}</h4><p>${qty} × ${money(p.price)}</p></div><button aria-label="Remove ${p.name}">×</button>`;
    row.querySelector("button").onclick=()=>{cart.delete(id);updateCart()};
    box.appendChild(row);
  });
  if(!count) box.innerHTML=`<div class="cart-empty">YOUR BAG<br>IS VERY<br>QUIET.</div>`;
  $("#bagCount").textContent=count; $("#cartHeaderCount").textContent=`${count} ${count===1?"ITEM":"ITEMS"}`;
  $("#cartTotal").textContent=money(total);
  $("#shipProgressText").textContent=`${money(total)} / $75`;
  $("#shipBar").style.width=`${Math.min(100,total/75*100)}%`;
  $("#shipText").textContent=total>=75?"FREE U.S. SHIPPING UNLOCKED":"FREE U.S. SHIPPING AT $75";
}

function openQuick(p){
  activeProduct=p;
  $("#quickBadge").textContent=p.badge;
  $("#quickName").textContent=p.name;
  $("#quickDesc").textContent=p.desc;
  $("#quickPrice").textContent=money(p.price);
  $("#quickArt").style.background=p.bg;
  $("#quickArt").innerHTML=visual(p,true);
  quick.classList.add("open");quick.setAttribute("aria-hidden","false");openScrim();
}
function closeQuick(){quick.classList.remove("open");quick.setAttribute("aria-hidden","true");closeScrim()}
$("#quickClose").onclick=closeQuick;
$("#quickAdd").onclick=()=>activeProduct&&addToCart(activeProduct);
$$(".sizes button").forEach(b=>b.onclick=()=>{$$(".sizes button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
scrim.onclick=()=>{closeBag();closeQuick()};

$$("[data-product]").forEach(el=>el.onclick=()=>openQuick(products.find(p=>p.id===el.dataset.product)));
$$("[data-add]").forEach(b=>b.onclick=()=>addToCart(products.find(p=>p.id===b.dataset.add)));

const modal=$("#searchModal"), g=$("#globalSearch"), results=$("#globalResults");
$("#searchOpen").onclick=()=>{modal.showModal();setTimeout(()=>g.focus(),50);renderGlobal()};
$("#searchClose").onclick=()=>modal.close();
g.oninput=renderGlobal;
function renderGlobal(){
  const q=g.value.toLowerCase();
  results.innerHTML=products.filter(p=>`${p.name} ${p.desc}`.toLowerCase().includes(q)).slice(0,6).map(p=>`<button data-g="${p.id}"><span>${p.name}</span><strong>${money(p.price)}</strong></button>`).join("");
  $$("[data-g]").forEach(b=>b.onclick=()=>{modal.close();openQuick(products.find(p=>p.id===b.dataset.g))});
}

const menu=$("#menuBtn"), mobile=$("#mobileNav");
menu.onclick=()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));mobile.hidden=open};
$$(".mobile-nav a").forEach(a=>a.onclick=()=>{mobile.hidden=true;menu.setAttribute("aria-expanded","false")});

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

if(matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches){
  const hero=$("#top"), cards=$$(".float-card");
  hero.addEventListener("mousemove",e=>{
    const x=(e.clientX-innerWidth/2)/innerWidth, y=(e.clientY-innerHeight/2)/innerHeight;
    cards.forEach(c=>{const d=Number(c.dataset.depth||1);c.style.translate=`${x*34*d}px ${y*24*d}px`});
  });
  $$(".magnetic").forEach(btn=>{
    btn.addEventListener("mousemove",e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`});
    btn.addEventListener("mouseleave",()=>btn.style.transform="");
  });
  $$(".tilt").forEach(el=>{
    el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg)`});
    el.addEventListener("mouseleave",()=>el.style.transform="");
  });
}

window.addEventListener("scroll",()=>{
  const y=window.scrollY;
  const words=$$(".hero-word");
  if(words.length && !matchMedia("(prefers-reduced-motion:reduce)").matches){
    words[0].style.transform=`translateX(${y*.08}px)`;
    words[1].style.transform=`translateX(${-y*.055}px)`;
    words[2].style.transform=`translateX(${y*.035}px)`;
  }
},{passive:true});

$("#newsletterForm").onsubmit=e=>{e.preventDefault();$("#newsletterStatus").textContent="YOU'RE IN. CONNECT YOUR EMAIL PROVIDER BEFORE LAUNCH.";e.target.reset()};
$("#checkoutBtn").onclick=()=>alert("Demo checkout. Connect this button to Printify/Stripe before launch.");

renderProducts();updateCart();
