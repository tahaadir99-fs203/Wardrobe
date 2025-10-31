const PRODUCTS = [
  { id: "p1", title: "Veste en jean", price: 79, category: "Homme", img: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Veste coupe classique, 100% coton." },
  { id: "p2", title: "Robe d'été", price: 59, category: "Femme", img: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764", desc: "Robe légère et fluide." },
  { id: "p3", title: "T-shirt basique", price: 19, category: "Homme", img: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "T-shirt en coton bio." },
  { id: "p4", title: "Blouse chic", price: 45, category: "Femme", img: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Blouse élégante pour toutes occasions." },
  { id: "p5", title: "Pantalon chino", price: 65, category: "Homme", img: "https://images.unsplash.com/photo-1599012307530-d163bd04ecab?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", desc: "Pantalon confortable, coupe moderne." },
  { id: "p6", title: "Jupe plissée", price: 49, category: "Femme", img: "https://burst.shopifycdn.com/photos/woman-shopping-for-clothes.jpg?width=800&format=pjpg&v=1587568863", desc: "Jupe mi-longue, plissée." }
];

const CART_KEY = "portfolio_shop_cart";
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}");

function saveCart() { 
  localStorage.setItem(CART_KEY, JSON.stringify(cart)); 
  renderCartCount(); 
}

function addToCart(id, qty=1){ 
  if(!cart[id]) cart[id]=0; 
  cart[id]+=qty; 
  saveCart(); 
  renderCartPanel(); 
}

function removeFromCart(id){ 
  delete cart[id]; 
  saveCart(); 
  renderCartPanel(); 
}

function setCartItem(id, qty){ 
  if(qty<=0) removeFromCart(id); 
  else cart[id]=qty; 
  saveCart(); 
  renderCartPanel(); 
}

function getCartItems(){ 
  return Object.keys(cart).map(id=>({ product: PRODUCTS.find(p=>p.id===id), qty: cart[id] })); 
}

function getCartTotal(){ 
  return getCartItems().reduce((s,it)=> s + it.product.price*it.qty, 0); 
}

const grid = document.getElementById('productsGrid');
const resultsInfo = document.getElementById('resultsInfo');

function createProductCard(p){
  const el = document.createElement('article');
  el.className='product-card';
  el.innerHTML = `
    <img src="${p.img}" alt="${p.title}">
    <h4>${p.title}</h4>
    <p>${p.desc}</p>
    <div class="card-actions">
      <div><strong>${p.price}€</strong></div>
      <div style="margin-left:auto">
        <button class="btn" data-action="view" data-id="${p.id}">Voir</button>
        <button class="btn primary" data-action="add" data-id="${p.id}">Ajouter</button>
      </div>
    </div>`;
  return el;
}

function renderProducts(list){
  if(!grid) return;
  grid.innerHTML = '';
  if(list.length===0){ 
    resultsInfo.textContent='Aucun produit.'; 
    return; 
  }
  resultsInfo.textContent = `${list.length} produit(s)`;
  list.forEach(p=> grid.appendChild(createProductCard(p)));
}

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  let out = PRODUCTS.slice();
  if(cat !== 'all') out = out.filter(p => p.category === cat);
  if(q) out = out.filter(p => (p.title + ' ' + p.desc).toLowerCase().includes(q));
  renderProducts(out);
}

searchInput?.addEventListener('input', applyFilters);
categoryFilter?.addEventListener('change', applyFilters);

document.addEventListener('click', (e)=>{
  const view = e.target.closest('[data-action="view"]');
  if(view){ 
    const id = view.dataset.id;
    location.href = `product.html?id=${encodeURIComponent(id)}`;
    return; 
  }
  const add = e.target.closest('[data-action="add"]');
  if(add){ addToCart(add.dataset.id,1); return; }
});

const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartList = document.getElementById('cartList');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCart');
const checkoutForm = document.getElementById('checkoutForm');
const orderForm = document.getElementById('orderForm');
const orderMsg = document.getElementById('orderMsg');

function renderCartCount(){
  const count = getCartItems().reduce((s,i)=> s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = getCartTotal() + "€";
}

function renderCartPanel(){
  if(!cartList) return;
  cartList.innerHTML = '';
  const items = getCartItems();
  if(items.length===0){ 
    cartList.innerHTML = '<p>Panier vide.</p>'; 
    document.getElementById('cartTotal').textContent = '0€'; 
    return; 
  }
  items.forEach(it => {
    const div = document.createElement('div');
    div.className='cart-item';
    div.innerHTML = `
      <img src="${it.product.img}" alt="${it.product.title}">
      <div style="flex:1">
        <div>${it.product.title}</div>
        <div style="color:#6b7280">${it.product.price}€ x <input type="number" min="0" value="${it.qty}" data-id="${it.product.id}" style="width:60px"></div>
      </div>
      <div><button class="btn" data-remove="${it.product.id}">Suppr</button></div>`;
    cartList.appendChild(div);
  });

  cartList.querySelectorAll('input[type="number"]').forEach(inp=>{
    inp.addEventListener('change', e=>{
      setCartItem(e.target.dataset.id, Number(e.target.value||0));
    });
  });
  cartList.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', e=> removeFromCart(e.target.dataset.remove));
  });

  document.getElementById('cartTotal').textContent = getCartTotal() + "€";
}

cartBtn?.addEventListener('click', ()=>{
  const hidden = cartPanel.getAttribute('aria-hidden') === 'true';
  cartPanel.setAttribute('aria-hidden', String(!hidden));
  renderCartPanel();
});

clearCartBtn?.addEventListener('click', ()=>{
  cart = {}; saveCart(); renderCartPanel();
});

checkoutBtn?.addEventListener('click', ()=>{
  checkoutForm.classList.toggle('hidden');
  checkoutForm.setAttribute('aria-hidden', String(checkoutForm.classList.contains('hidden')));
});

orderForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = new FormData(orderForm);
  if(!data.get('fullname')||!data.get('email')||!data.get('address')){
    orderMsg.textContent='Complète tous les champs.';
    orderMsg.style.color='tomato';
    return;
  }
  const items = getCartItems().map(it => ({ id: it.product.id, title: it.product.title, qty: it.qty, price: it.product.price }));
  data.append('cart', JSON.stringify(items));

  try {
    const resp = await fetch('backend/process_order.php', { method:'POST', body:data });
    const json = await resp.json();
    if(resp.ok && json.success){
      orderMsg.textContent = `Commande enregistrée ✅ (ID ${json.order_id})`;
      orderMsg.style.color='green';
      cart = {}; saveCart(); renderCartPanel(); orderForm.reset();
    } else {
      orderMsg.textContent = 'Erreur serveur: ' + (json.error||resp.statusText);
      orderMsg.style.color='tomato';
    }
  } catch(err){
    orderMsg.textContent = 'Erreur réseau: ' + err.message;
    orderMsg.style.color='tomato';
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(PRODUCTS);
  renderCartCount();
  applyFilters();
  document.getElementById('year').textContent = new Date().getFullYear();
});

fetch('backend/products.php')
  .then(res => res.json())
  .then(data => {
    PRODUCTS.length = 0;       // vider le tableau existant
    data.forEach(p => PRODUCTS.push(p)); // ajouter les produits du backend
    renderProducts(PRODUCTS);
    applyFilters();
});

fetch('backend/process_order.php', { method:'POST', body: formData })
  .then(res => res.json())
  .then(json => {
    if(json.success){
      alert(`Commande confirmée ✅ (ID ${json.order_id})`);
      cart = {}; saveCart(); renderCartPanel();
    }
});