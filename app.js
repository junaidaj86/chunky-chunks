/**
 * Chunky Chunks — mobile-first UI, WhatsApp router, Drive-hosted assets.
 * This build enforces Minimum Order Quantities (MOQ) per item (and per-size for cheesecakes).
 */

/* ===== Minimum order quantities ===== */
const MIN_ORDER = {
  Tiramisu: 1,
  Cookies: 5,
  'Brownie': 4,
  'Muffins': 4,
  'Loaf Cake': 1,
  'Cheesecakes': { Mini: 5, Regular: 2, Full: 1 } // cheesecake by size
};

/* ===== WhatsApp routing ===== */
const WHATSAPP_NUMBER = '919901644319';
const WNUM = String(WHATSAPP_NUMBER || '').replace(/\D/g, '');
function isMobileLike(){
  const ua = navigator.userAgent || '';
  return /Android|Mobi|iPhone|iPad|iPod|Windows Phone/i.test(ua)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function whatsappBaseUrl(){ return isMobileLike() ? `https://wa.me/${WNUM}` : `https://web.whatsapp.com/send?phone=${WNUM}`; }
window.openWhatsApp = function(encodedMsg){
  if(!WNUM){ alert('WhatsApp number is not configured.'); return false; }
  const base = whatsappBaseUrl();
  const url = encodedMsg
    ? (base.includes('web.whatsapp.com') ? `${base}&text=${encodedMsg}` : `${base}?text=${encodedMsg}`)
    : base;
  window.open(url,'_blank','noopener'); return false;
};

/* ===== Mobile nav toggle (a11y + UX) ===== */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
const navClose  = document.getElementById('navClose');

function openNav(){
  if(!primaryNav) return;
  primaryNav.classList.add('open');
  navToggle && navToggle.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeNav(){
  if(!primaryNav) return;
  primaryNav.classList.remove('open');
  navToggle && navToggle.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}
if(navToggle && primaryNav){
  navToggle.addEventListener('click', () => {
    primaryNav.classList.contains('open') ? closeNav() : openNav();
  });
}
navClose && navClose.addEventListener('click', closeNav);
primaryNav && primaryNav.addEventListener('click', (e) => { if(e.target.closest('a')) closeNav(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && primaryNav && primaryNav.classList.contains('open')) closeNav(); });

/* ===== Drive assets ===== */
const DRIVE_ASSETS = {
  logo:'1hUBagr0wfEC0-kY_a58Q7C69_2b28Elt',
  tiramisu:'1djX1RpV651iw35dr1_Ky9yTCYlPw6r56',
  cookies:'1bwOV_h8JBjxgnc9zvOqI2Ppr_Sfhofzi',
  cheesecake:'1vG60IWKZafSiKC9GK-8mDROnpY76wz0b',
  loaf:'1v1yNMJRJfyANYsFJLkLUEfanEszes0_t',
  brownie:'1sWr5j7ZzBdf4Be1bBEz6p8Q3fPwoe-tl',
  muffins:'17JmI6A0dLVsd70LnH60UBabjaKmup4PG'
};
const driveUrl   = id => `https://drive.usercontent.google.com/download?id=${id}&export=view`;
const driveThumb = id => `https://drive.usercontent.google.com/download?id=${id}&export=view`;

/* ===== Catalog ===== */
const ITEMS = [
  { category:'Tiramisu',    name:'Tiramisu',    price:129, image:DRIVE_ASSETS.tiramisu,    remoteId:DRIVE_ASSETS.tiramisu,   variants:['Classic','Biscoff'] },
  { category:'Cookies',     name:'Cookies',     price:30,  image:DRIVE_ASSETS.cookies,     remoteId:DRIVE_ASSETS.cookies,    variants:['Chocolate Chip','Double Chocolate','Red Velvet'] },
  { category:'Cheesecakes', name:'Cheesecake',  price:25,  image:DRIVE_ASSETS.cheesecake,  remoteId:DRIVE_ASSETS.cheesecake,
    variants:['Blueberry','Strawberry','Biscoff','Lemon','Plain'],
    options:{ size:['Mini','Regular','Full'] },
    optionPrice:{ size:{ 'Mini':25, 'Regular':75, 'Full':250 } }
  },
  { category:'Loaf Cake',   name:'Loaf Cake',   price:120, image:DRIVE_ASSETS.loaf,        remoteId:DRIVE_ASSETS.loaf,       variants:['Orange','Zebra','Vanilla','Chocolate'] },
  { category:'Brownie',     name:'Brownie',     price:30,  image:DRIVE_ASSETS.brownie,     remoteId:DRIVE_ASSETS.brownie,    variants:['Classic Fudgy','Walnuts','Double Chocolate','Biscoff','Oreo','Salted Caramel','Peanut Butter','Nutella'] },
  { category:'Muffins',     name:'Muffins',     price:25,  image:DRIVE_ASSETS.muffins,     remoteId:DRIVE_ASSETS.muffins,    variants:['Vanilla','Double Chocolate','Blueberry','Banana'] }
];

/* ===== Placeholder (local fallback) ===== */
const PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF7F3"/><stop offset="100%" stop-color="#F3E3DC"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><g fill="#6B3A2E" opacity="0.5"><circle cx="540" cy="-20" r="180"/></g><text x="32" y="56" font-family="Georgia, serif" font-size="32" fill="#6B3A2E">Chunky Chunks</text><text x="32" y="96" font-family="Inter, system-ui" font-size="18" fill="#2F2320">Delicious bakery placeholder</text></svg>`);

/* ===== State ===== */
const state = {
  filter:'All',
  cart: JSON.parse(localStorage.getItem('cc_cart')||'[]'),
  notes: localStorage.getItem('cc_notes')||'',
  name: localStorage.getItem('cc_name')||'',
  date: localStorage.getItem('cc_date')||'',
  time: localStorage.getItem('cc_time')||''
};

/* ===== DOM ===== */
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

/* ===== Rendering ===== */
function imageTagFor(prod){
  const driveUrlX   = id => `https://drive.google.com/uc?export=view&id=${id}`;
  const driveThumbX = id => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
  const localWebp = `images/${(prod.image||'').replace('.png','.webp')}`;
  const localPng  = `images/${(prod.image||'').replace('.webp','.png')}`;

  if (prod.remoteId) {
    const primary = driveUrlX(prod.remoteId);
    const fb1 = driveThumbX(prod.remoteId);
    return `
      <img
        src="${primary}"
        alt="${prod.name}"
        width="480" height="360"
        loading="lazy" decoding="async"
        referrerpolicy="no-referrer"
        onerror="
          this.onerror=null;
          this.src='${fb1}';
          this.onerror=function(){
            this.onerror=null;
            this.src='${localWebp}';
            this.onerror=function(){
              this.onerror=null;
              this.src='${localPng}';
              this.onerror=function(){ this.src='${PLACEHOLDER}'; };
            };
          };
        "
      />`;
  }

  if (prod.image) {
    return `
      <picture>
        <source srcset="${localWebp}" type="image/webp"/>
        <img
          src="${localPng}"
          alt="${prod.name}"
          width="480" height="360"
          loading="lazy" decoding="async"
          onerror="this.onerror=null; this.src='${PLACEHOLDER}'"
        />
      </picture>`;
  }
  return `<img src="${PLACEHOLDER}" alt="${prod?.name||'Item'}" width="480" height="360" loading="lazy" decoding="async"/>`;
}

function descFor(p){
  if(p.category==='Tiramisu')return'Hand-layered mascarpone cream with espresso-soaked sponge; also in Biscoff.';
  if(p.category==='Cookies')return'Thick, gooey center with premium quality chocolate.';
  if(p.category==='Cheesecakes')return'Silky baked cheesecake in Mini or Regular; multiple flavors.';
  if(p.category==='Loaf Cake')return'Soft orange loaf with citrus glaze.';
  if(p.category==='Brownie')return'Classic fudgy brownie; optional add-ons.';
  if(p.category==='Muffins')return'Moist muffins with multiple flavors.';
  return'Freshly baked goodness.';
}

function variantSelect(p){
  if(!p.variants)return''; const opts=p.variants.map(v=>`<option value="${v}">${v}</option>`).join('');
  const id=`var-${p.category.replace(/\s+/g,'')}`;
  return `<label class="visually-hidden" for="${id}">Variant</label><select id="${id}" class="select variant" aria-label="Choose variant">${opts}</select>`;
}
function optionBlock(p){
  if(!p.options)return'';
  if(p.options.size){
    const id=`opt-size-${p.category.replace(/\s+/g,'')}`;
    return `<label class="visually-hidden" for="${id}">Size</label><select id="${id}" class="select size" aria-label="Choose size">${p.options.size.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>`;
  }
  return'';
}

/* Compute min qty for a product, optionally using a size */
function minQtyFor(prod, sizeIfAny){
  if(prod.category === 'Cheesecakes'){
    const size = sizeIfAny || (prod.options?.size?.[0] || 'Mini');
    return (MIN_ORDER['Cheesecakes'][size] || 1);
  }
  if(prod.category === 'Cheesecakes'){
    const size = sizeIfAny || (prod.options?.size?.[0] || 'Regular');
    return (MIN_ORDER['Cheesecakes'][size] || 1);
  }
  if(prod.category === 'Cheesecakes'){
    const size = sizeIfAny || (prod.options?.size?.[0] || 'Full');
    return (MIN_ORDER['Cheesecakes'][size] || 1);
  }
  return (MIN_ORDER[prod.category] || 1);
}

function addOnBlock(p){
  if(!p.addOns)return'';
  return `<fieldset class="addons">
    <legend class="visually-hidden">Add-ons</legend>
    ${p.addOns.map(a=>`<label class="small"><input type="checkbox" value="${a.label}" data-price="${a.price}"> ${a.label} (+${a.price} kr)</label>`).join('<br>')}
  </fieldset>`;
}

function renderMenu(){
  grid.innerHTML='';
  const data=ITEMS.filter(i=>state.filter==='All'||i.category===state.filter);
  data.forEach((prod,idx)=>{
    const initialSize = (prod.category === 'Cheesecakes') ? (prod.options?.size?.[0] || 'Mini') : '';
    const minQty = minQtyFor(prod, initialSize);

    // NEW: compute initial unit price based on selected/default size
    const initialPrice = calcPrice(prod, { size: initialSize, addOns: [] });

    const card=document.createElement('article'); card.className='card';
    card.innerHTML=`
      <div class="media">${imageTagFor(prod)}</div>
      <div class="body">
        <h3>${prod.name}</h3>
        <p class="small">${descFor(prod)}</p>

        <!-- CHANGED: live price target with data-price -->
        <div class="small price" data-price>${initialPrice} kr</div>

        ${variantSelect(prod)}${optionBlock(prod)}${addOnBlock(prod)}
        <div class="small" data-min-hint><em>Minimum order: ${minQty}</em></div>
        <div class="controls">
          <div class="qty">
            <label class="visually-hidden" for="qty-${idx}">Quantity</label>
            <input id="qty-${idx}" class="qty-input" type="number" inputmode="numeric"
              min="${minQty}" step="1" value="${minQty}" aria-label="Quantity" />
          </div>
          <button class="add" data-idx="${idx}">Add to Order</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  bindPopMove();
}


/* ===== Filters ===== */
filters.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filters.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
    btn.classList.add('active');btn.setAttribute('aria-pressed','true');
    state.filter=btn.dataset.filter; renderMenu();
  });
});

/* ===== Price calc ===== */
function calcPrice(p,{size,addOns}){
  let base=p.price;
  if(p.optionPrice && size){ base = p.optionPrice.size[size] || base; }
  const extras=(addOns||[]).reduce((s,a)=>s+(a.price||0),0);
  return base+extras;
}

/* ===== Cart ops ===== */
function addToCartFromCard(card, relIdx){
  const visible = ITEMS.filter(i=>state.filter==='All'||i.category===state.filter);
  const prod = visible[relIdx];

  // Selected fields
  const qtyInput = card.querySelector('.qty-input');
  let qty = Math.max(1, parseInt(qtyInput?.value||'1', 10));
  const variant = card.querySelector('.variant')?.value || prod.variants?.[0] || '';
  const size = card.querySelector('.size')?.value || (prod.category==='Cheesecakes' ? (prod.options?.size?.[0] || 'Mini') : '');
  const addOns = [...card.querySelectorAll('.addons input:checked')].map(c=>({label:c.value,price:+c.dataset.price}));

  // Enforce MOQ
  const enforcedMin = minQtyFor(prod, size);
  if (qty < enforcedMin) {
    qty = enforcedMin;
    if (qtyInput) {
      qtyInput.min = String(enforcedMin);
      qtyInput.value = String(enforcedMin);
    }
  }

  const unitPrice = calcPrice(prod, {size,addOns});
  const item = {product:prod.name,category:prod.category,variant,size,addOns,qty,unitPrice};

  const key=JSON.stringify({p:item.product,v:item.variant,s:item.size,a:item.addOns.map(a=>a.label).sort()});
  const existing=state.cart.find(ci=>JSON.stringify({p:ci.product,v:ci.variant,s:ci.size,a:ci.addOns.map(a=>a.label).sort()})===key);
  if(existing){existing.qty+=qty;}else{state.cart.push(item);}

  persist(); renderCart(); bumpCartCount();
  //announce.textContent=`${qty} × ${item.product}${item.variant?` (${item.variant})`:''}${item.size?` [${item.size}]`:''} added to cart.`;
  announceAdded(item);
}

/* ===== Cheesecake size → dynamic MOQ binding =====
   When user changes size, update the card's quantity min/value and the "Minimum order" hint. */
grid.addEventListener('change', (e) => {
  const sizeSel = e.target.closest('.size');
  if(!sizeSel) {
    // OPTIONAL: if you later add paid add-ons for other products, keep price in sync
    const addOnChanged = e.target.closest('.addons');
    if(addOnChanged){
      const card = e.target.closest('.card');
      const title = card?.querySelector('h3')?.textContent?.trim();
      const prod = ITEMS.find(p => p.name === title) || null;
      if(prod){ updateCardPrice(card, prod); }
    }
    return;
  }

  const card = sizeSel.closest('.card');
  if(!card) return;
  const title = card.querySelector('h3')?.textContent?.trim();
  const prod = ITEMS.find(p => p.name === title) || null;
  if(!prod) return;

  // MOQ refresh (existing behavior)
  const newSize = sizeSel.value;
  const newMin = minQtyFor(prod, newSize);
  const qtyInput = card.querySelector('.qty-input');
  if(qtyInput){
    qtyInput.min = String(newMin);
    qtyInput.value = String(newMin);
  }
  const hint = card.querySelector('[data-min-hint]');
  if(hint){ hint.innerHTML = `<em>Minimum order: ${newMin}</em>`; }

  // NEW: price refresh
  updateCardPrice(card, prod);
});


/* ===== Cart render / persistence ===== */
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
    li.querySelector('.dec').addEventListener('click',()=>{
  // Find min for this product (with size if cheesecake)
  let min = 1;
  if (ci.category === 'Cheesecakes') {
    min = (MIN_ORDER['Cheesecakes'][ci.size] || 1);
  } else {
    min = (MIN_ORDER[ci.category] || 1);
  }
  ci.qty = Math.max(min, ci.qty - 1);
  persist(); renderCart(); bumpCartCount();
});

    li.querySelector('.inc').addEventListener('click',()=>{ci.qty+=1;persist();renderCart();bumpCartCount();});
    li.querySelector('.del').addEventListener('click',()=>{state.cart.splice(i,1);persist();renderCart();bumpCartCount();showAnnounce('Item removed.','warn');});    subtotal+=ci.qty*ci.unitPrice; cartItemsEl.appendChild(li);
  });
  subtotalEl.textContent=`${subtotal} kr`; updateCheckoutState();
}
function bumpCartCount(){cartCountEl.textContent=state.cart.reduce((s,i)=>s+i.qty,0);}
function persist(){localStorage.setItem('cc_cart',JSON.stringify(state.cart));}

/* ===== Drawer (cart) + a11y ===== */
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

/* ===== Input persistence ===== */
notesEl.value=state.notes; nameEl.value=state.name; dateEl.value=state.date; timeEl.value=state.time;
notesEl.addEventListener('input',()=>localStorage.setItem('cc_notes',notesEl.value));
nameEl.addEventListener('input',()=>{localStorage.setItem('cc_name',nameEl.value);updateCheckoutState();});
dateEl.addEventListener('change',()=>{localStorage.setItem('cc_date',dateEl.value);updateCheckoutState();});
timeEl.addEventListener('change',()=>{localStorage.setItem('cc_time',timeEl.value);updateCheckoutState();});
function updateCheckoutState(){checkoutBtn.disabled=!(state.cart.length && nameEl.value.trim() && dateEl.value && timeEl.value);}

/* ===== Clear cart ===== */
clearBtn.addEventListener('click',()=>{state.cart=[];persist();renderCart();bumpCartCount();showAnnounce('Cart cleared.','warn');});
/* ===== Delegated add ===== */
grid.addEventListener('click',e=>{
  const add=e.target.closest('.add'); if(!add) return;
  const card=add.closest('.card'); const relIdx=parseInt(add.dataset.idx,10);
  addToCartFromCard(card,relIdx);
});

/* ===== Checkout ===== */
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

/* ===== Announce / Toast utilities ===== */
function showAnnounce(message, variant = 'info', ttlMs = 1800){
  if(!announce) return;
  // ARIA: ensure screen readers pick it up
  announce.setAttribute('role','status'); // polite live region already in HTML
  announce.classList.remove('success','info','warn'); // reset variants
  if(variant) announce.classList.add(variant);

  announce.textContent = message;
  announce.classList.add('show');

  clearTimeout(showAnnounce._t);
  showAnnounce._t = setTimeout(() => {
    announce.classList.remove('show');
    // Delay content clear to avoid cutting off SR announcement too fast
    setTimeout(() => { announce.textContent = ''; }, 250);
  }, ttlMs);
}

function announceAdded(item){
  const { qty, product, variant, size } = item;
  const v = variant ? ` (${variant})` : '';
  const s = size ? ` [${size}]` : '';
  showAnnounce(`${qty} × ${product}${v}${s} added to cart.`, 'success');
}

/* === Pop & Move binder === */
function bindPopMove(){
  const MAX_SHIFT = 14; // px of translation at edges
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll('.card .media');

  nodes.forEach((el) => {
    if (el._popBound) return;  // idempotent
    el._popBound = true;

    const img = el.querySelector('img');
    if (!img) return;

    // Pointer enter: enable scale
    const onEnter = () => el.classList.add('is-tilting');

    // Pointer move: translate image toward pointer
    const onMove = (e) => {
      if (reduceMotion) return; // keep it simple if reduced motion
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5..0.5
      const y = (e.clientY - r.top)  / r.height - 0.5; // -0.5..0.5
      img.style.setProperty('--tx', `${(x * MAX_SHIFT).toFixed(1)}px`);
      img.style.setProperty('--ty', `${(y * MAX_SHIFT).toFixed(1)}px`);
    };

    // Pointer leave: reset transform
    const onLeave = () => {
      el.classList.remove('is-tilting');
      img.style.removeProperty('--tx');
      img.style.removeProperty('--ty');
      img.style.removeProperty('--sc');
    };

    // Touch friendly: tap = quick pop without move
    const onTouchStart = () => { el.classList.add('is-tilting'); };
    const onTouchEnd   = onLeave;

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove',  onMove);
    el.addEventListener('pointerleave', onLeave);

    // Mobile fallbacks
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    el.addEventListener('touchcancel',onTouchEnd,   { passive: true });
  });
}

function updateCardPrice(card, prod){
  const size = card.querySelector('.size')?.value || (prod.category==='Cheesecakes' ? (prod.options?.size?.[0] || 'Mini') : '');
  const addOns = [...card.querySelectorAll('.addons input:checked')].map(c=>({label:c.value, price:+c.dataset.price}));
  const unit = calcPrice(prod, { size, addOns });
  const target = card.querySelector('[data-price]');
  if(target){ target.textContent = `${unit} kr`; }
}

/* ===== Init ===== */
renderMenu(); renderCart(); bumpCartCount(); updateCheckoutState();
