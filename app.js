/**
 * Chunky Chunks — mobile-first UI, WhatsApp router, Drive-hosted assets.
 */

/* WhatsApp routing */
const WHATSAPP_NUMBER = '46767427167';
const WNUM = String(WHATSAPP_NUMBER || '').replace(/\D/g, '');
function isMobileLike(){const ua=navigator.userAgent||'';return /Android|Mobi|iPhone|iPad|iPod|Windows Phone/i.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);}
function whatsappBaseUrl(){return isMobileLike()?`https://wa.me/${WNUM}`:`https://web.whatsapp.com/send?phone=${WNUM}`;}
window.openWhatsApp = function(encodedMsg){
  if(!WNUM){alert('WhatsApp number is not configured.');return false;}
  const base = whatsappBaseUrl();
  const url = encodedMsg ? (base.includes('web.whatsapp.com')?`${base}&text=${encodedMsg}`:`${base}?text=${encodedMsg}`) : base;
  window.open(url,'_blank','noopener'); return false;
};

/* Mobile nav toggle (a11y) */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if(navToggle && primaryNav){
  navToggle.addEventListener('click', ()=>{
    const open = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* Drive assets */
const DRIVE_ASSETS = {
  logo:'1hUBagr0wfEC0-kY_a58Q7C69_2b28Elt',
  tiramisu:'1lo6vtFa6QREzQKT1ohnt6aes5fAMDH-4',
  cookies:'1bwOV_h8JBjxgnc9zvOqI2Ppr_Sfhofzi', // new
  cheesecake:'1vG60IWKZafSiKC9GK-8mDROnpY76wz0b', // new
  loaf:'1f5J-yf29bSNWfs8PZFAMOVWwWGA9y0fQ',
  brownie:'1-LBYsgWt4Q6hV0F_bxE9UdNUMtl3th1U',
  muffins:'1Urq0AnkDzj5QZVQPPYT0RenPnmbyJqOq'
};

const driveUrl   = id => `https://drive.usercontent.google.com/download?id=${id}&export=view`;
const driveThumb = id => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;

/* Catalog */
const ITEMS = [
  { category:'Tiramisu',    name:'Tiramisu',    price:120, image:'tiramisu.webp',    remoteId:DRIVE_ASSETS.tiramisu,   variants:['Classic','Biscoff'] },
  { category:'Cookies',     name:'Cookies',     price:25,  image:'cookies.webp',     remoteId:DRIVE_ASSETS.cookies,    variants:['Chocolate Chip','Double Chocolate','Red Velvet'] },
  { category:'Cheesecakes', name:'Cheesecake',  price:60,  image:'cheesecake.webp',  remoteId:DRIVE_ASSETS.cheesecake, variants:['Blueberry','Strawberry','Biscoff','Lemon','Plain','Zebra'], options:{ size:['Mini','Regular'] }, optionPrice:{ size:{ 'Mini':60, 'Regular':220 } } },
  { category:'Loaf Cake',   name:'Loaf Cake',   price:90,  image:'loaf.webp',        remoteId:DRIVE_ASSETS.loaf,       variants:['Orange'] },
  { category:'Brownie',     name:'Brownie',     price:40,  image:'brownie.webp',     remoteId:DRIVE_ASSETS.brownie,    variants:['Classic Fudgy'], addOns:[{label:'Walnuts',price:10},{label:'Extra Chocolate',price:10},{label:'Biscoff Crumble',price:10}] },
  { category:'Muffins',     name:'Muffins',     price:30,  image:'muffins.webp',     remoteId:DRIVE_ASSETS.muffins,    variants:['Walnut','Plain','Double Chocolate','Nutella','Peanut Butter','Biscoff','Salted Caramel','Oreo','Lemon','Chocolate','Blueberry','Banana'] }
];

/* Placeholder */
const PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF7F3"/><stop offset="100%" stop-color="#F3E3DC"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><g fill="#6B3A2E" opacity="0.5"><circle cx="540" cy="-20" r="180"/></g><text x="32" y="56" font-family="Georgia, serif" font-size="32" fill="#6B3A2E">Chunky Chunks</text><text x="32" y="96" font-family="Inter, system-ui" font-size="18" fill="#2F2320">Delicious bakery placeholder</text></svg>`);

/* State */
const state = {
  filter:'All',
  cart: JSON.parse(localStorage.getItem('cc_cart')||'[]'),
  notes: localStorage.getItem('cc_notes')||'',
  name: localStorage.getItem('cc_name')||'',
  date: localStorage.getItem('cc_date')||'',
  time: localStorage.getItem('cc_time')||''
};

/* DOM */
const grid=document.getElementById('menuGrid');
const filters=document.querySelectorAll('.filter');
const cartBtn=document.getElementById('openCart');
const cartDrawer=document.getElementById('cartDrawer');
const cartItemsEl=document.getElementById('cartItems');
const subtotalEl=document.getElementById('subtotal');
const cartCountEl=document.getElementById('cartCount');
const clearBtn=document.getElementById('clearCart');
const closeCartBtn=document.getElementById('closeCart');
const checkoutBtn=document.getElementById('checkout');
const notesEl=document.getElementById('orderNotes');
const nameEl=document.getElementById('custName');
const dateEl=document.getElementById('pickupDate');
const timeEl=document.getElementById('pickupTime');
const announce=document.getElementById('announce');
let lastFocusedTrigger=null;

/* Rendering */
function imageTagFor(prod){
  if (prod.remoteId) {
    const driveImageUrl = `https://drive.usercontent.google.com/download?id=${prod.remoteId}&export=view`;
    const driveThumbnailUrl = `https://drive.google.com/thumbnail?id=${prod.remoteId}&sz=w1200`;
    return `<img src="${driveImageUrl}" alt="${prod.name}" width="480" height="360" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${driveThumbnailUrl}';this.onerror=null;this.src='${PLACEHOLDER}';" />`;
  }else if (prod.image) {
    const webp = `images/${prod.image.replace('.png','.webp')}`;
    const png = `images/${prod.image.replace('.webp','.png')}`;
    return `<picture><source srcset="${webp}" type="image/webp"/><img src="${png}" alt="${prod.name}" width="480" height="360" loading="lazy" decoding="async" onerror="this.src='${PLACEHOLDER}'"/></picture>`;
  }
}
function renderMenu(){
  grid.innerHTML='';
  const data=ITEMS.filter(i=>state.filter==='All'||i.category===state.filter);
  data.forEach((prod,idx)=>{
    const card=document.createElement('article'); card.className='card';
    card.innerHTML=`
      <div class="media">${imageTagFor(prod)}</div>
      <div class="body">
        <h3>${prod.name} <span class="small">(${prod.category})</span></h3>
        <p class="small">${descFor(prod)}</p>
        <div class="small price">from ${prod.price} kr</div>
        ${variantSelect(prod)}${optionBlock(prod)}${addOnBlock(prod)}
        <div class="controls">
          <div class="qty">
            <label class="visually-hidden" for="qty-${idx}">Quantity</label>
            <input id="qty-${idx}" class="qty-input" type="number" inputmode="numeric" min="1" step="1" value="1" aria-label="Quantity" />
          </div>
          <button class="add" data-idx="${idx}">Add to Order</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
function descFor(p){
  if(p.category==='Tiramisu')return'Hand-layered mascarpone cream with espresso-soaked sponge; also in Biscoff.';
  if(p.category==='Cookies')return'Thick, gooey center with premium chocolate.';
  if(p.category==='Cheesecakes')return'Silky baked cheesecake in Mini or Regular; multiple flavors.';
  if(p.category==='Loaf Cake')return'Soft orange loaf with citrus glaze.';
  if(p.category==='Brownie')return'Classic fudgy brownie; optional add-ons.';
  if(p.category==='Muffins')return'Moist bakery-style muffins with multiple flavors.';
  return'Freshly baked goodness.';
}
function variantSelect(p){
  if(!p.variants)return''; const opts=p.variants.map(v=>`<option value="${v}">${v}</option>`).join('');
  const id=`var-${p.category.replace(/\s+/g,'')}`;
  return `<label class="visually-hidden" for="${id}">Variant</label><select id="${id}" class="select variant" aria-label="Choose variant">${opts}</select>`;
}
function optionBlock(p){
  if(!p.options)return''; if(p.options.size){const id=`opt-size-${p.category.replace(/\s+/g,'')}`;
  return `<label class="visually-hidden" for="${id}">Size</label><select id="${id}" class="select size" aria-label="Choose size">${p.options.size.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>`;}
  return'';
}
function addOnBlock(p){
  if(!p.addOns)return''; return `<fieldset class="addons"><legend class="visually-hidden">Add-ons</legend>${p.addOns.map(a=>`<label class="small"><input type="checkbox" value="${a.label}" data-price="${a.price}"> ${a.label} (+${a.price} kr)</label>`).join('<br>')}</fieldset>`;
}

/* Filters */
filters.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filters.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
    btn.classList.add('active');btn.setAttribute('aria-pressed','true');
    state.filter=btn.dataset.filter; renderMenu();
  });
});

/* Cart ops */
function addToCartFromCard(card, idx){
  const prod=ITEMS.filter(i=>state.filter==='All'||i.category===state.filter)[idx];
  const qty=Math.max(1,parseInt(card.querySelector('.qty-input')?.value||'1',10));
  const variant=card.querySelector('.variant')?.value||prod.variants?.[0]||'';
  const size=card.querySelector('.size')?.value||'';
  const addOns=[...card.querySelectorAll('.addons input:checked')].map(c=>({label:c.value,price:+c.dataset.price}));
  const unitPrice=calcPrice(prod,{size,addOns});
  const item={product:prod.name,category:prod.category,variant,size,addOns,qty,unitPrice};
  const key=JSON.stringify({p:item.product,v:item.variant,s:item.size,a:item.addOns.map(a=>a.label).sort()});
  const existing=state.cart.find(ci=>JSON.stringify({p:ci.product,v:ci.variant,s:ci.size,a:ci.addOns.map(a=>a.label).sort()})===key);
  if(existing){existing.qty+=qty;}else{state.cart.push(item);}
  persist(); renderCart(); bumpCartCount(); announce.textContent=`${qty} × ${item.product}${item.variant?` (${item.variant})`:''} added to cart.`;
}
function calcPrice(p,{size,addOns}){let base=p.price; if(p.optionPrice&&size){base=p.optionPrice.size[size]||base;} const extras=(addOns||[]).reduce((s,a)=>s+(a.price||0),0); return base+extras;}
function renderCart(){
  cartItemsEl.innerHTML=''; let subtotal=0;
  state.cart.forEach((ci,i)=>{
    const li=document.createElement('li'); li.className='cart-item';
    const badge=ci.size?` — <span class="muted">${ci.size}</span>`:''; const addOnNote=ci.addOns?.length?` <span class="muted">[${ci.addOns.map(a=>a.label).join(', ')}]</span>`:'';
    li.innerHTML=`
      <div class="item-meta">
        <div><strong>${ci.product}</strong>${ci.variant?` <span class="muted">(${ci.variant})</span>`:''}${badge}${addOnNote}</div>
        <div class="muted">${ci.unitPrice} kr each</div>
      </div>
      <div class="item-controls">
        <button class="dec" aria-label="Decrease quantity">−</button>
        <span aria-live="polite">${ci.qty}</span>
        <button class="inc" aria-label="Increase quantity">＋</button>
        <button class="del" aria-label="Remove item">Remove</button>
      </div>`;
    li.querySelector('.dec').addEventListener('click',()=>{ci.qty=Math.max(1,ci.qty-1);persist();renderCart();bumpCartCount();});
    li.querySelector('.inc').addEventListener('click',()=>{ci.qty+=1;persist();renderCart();bumpCartCount();});
    li.querySelector('.del').addEventListener('click',()=>{state.cart.splice(i,1);persist();renderCart();bumpCartCount();announce.textContent='Item removed.';});
    subtotal+=ci.qty*ci.unitPrice; cartItemsEl.appendChild(li);
  });
  subtotalEl.textContent=`${subtotal} kr`; updateCheckoutState();
}
function bumpCartCount(){cartCountEl.textContent=state.cart.reduce((s,i)=>s+i.qty,0);}
function persist(){localStorage.setItem('cc_cart',JSON.stringify(state.cart));}

/* Drawer + a11y */
function openDrawer(){lastFocusedTrigger=document.activeElement; cartDrawer.hidden=false; document.body.style.overflow='hidden'; cartBtn.setAttribute('aria-expanded','true'); const f=cartDrawer.querySelector('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'); f&&f.focus&&f.focus();}
function closeDrawer(){cartDrawer.hidden=true; document.body.style.overflow=''; cartBtn.setAttribute('aria-expanded','false'); lastFocusedTrigger&&lastFocusedTrigger.focus&&lastFocusedTrigger.focus();}
cartBtn.addEventListener('click',openDrawer);
closeCartBtn.addEventListener('click',closeDrawer);
cartDrawer.addEventListener('click',e=>{if(e.target.classList.contains('drawer-backdrop'))closeDrawer();});
document.addEventListener('keydown',e=>{
  if(!cartDrawer.hidden && e.key==='Escape') closeDrawer();
  if(!cartDrawer.hidden && e.key==='Tab'){
    const f=cartDrawer.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if(!f.length) return; const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){last.focus();e.preventDefault();}
    else if(!e.shiftKey && document.activeElement===last){first.focus();e.preventDefault();}
  }
});

/* Input persistence */
notesEl.value=state.notes; nameEl.value=state.name; dateEl.value=state.date; timeEl.value=state.time;
notesEl.addEventListener('input',()=>localStorage.setItem('cc_notes',notesEl.value));
nameEl.addEventListener('input',()=>{localStorage.setItem('cc_name',nameEl.value);updateCheckoutState();});
dateEl.addEventListener('change',()=>{localStorage.setItem('cc_date',dateEl.value);updateCheckoutState();});
timeEl.addEventListener('change',()=>{localStorage.setItem('cc_time',timeEl.value);updateCheckoutState();});
function updateCheckoutState(){checkoutBtn.disabled=!(state.cart.length && nameEl.value.trim() && dateEl.value && timeEl.value);}

/* Clear cart */
clearBtn.addEventListener('click',()=>{state.cart=[];persist();renderCart();bumpCartCount();announce.textContent='Cart cleared.';});

/* Delegated add */
grid.addEventListener('click',e=>{
  const add=e.target.closest('.add'); if(!add) return;
  const card=add.closest('.card'); const relIdx=parseInt(add.dataset.idx,10);
  addToCartFromCard(card,relIdx);
});

/* Checkout */
checkoutBtn.addEventListener('click', ()=>{
  if(checkoutBtn.disabled) return;
  const notes=encodeURIComponent(document.getElementById('orderNotes').value||'');
  const name=encodeURIComponent(nameEl.value.trim());
  const date=dateEl.value; const time=timeEl.value;
  const lines=state.cart.map(i=>{
    const v=i.variant?` (${i.variant})`:''; const s=i.size?` [${i.size}]`:''; const a=i.addOns?.length?` {${i.addOns.map(x=>x.label).join(', ')}}`:'';
    return `- ${i.qty} x ${i.product}${v}${s}${a}`;
  }).join('%0A');
  const msg=`Hi Chunky Chunks! I'd like to order:%0A${lines}%0ANotes: ${notes}%0AName: ${name}%0APreferred pickup: ${date} ${time}`;
  return openWhatsApp(msg);
});

/* Init */
renderMenu(); renderCart(); bumpCartCount(); updateCheckoutState();
