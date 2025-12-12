//Collections page SECTION REVEAL
function showSection(section) {
      const sections = document.querySelectorAll('.collection-section');
      sections.forEach(s => s.style.display = 'none');
      document.getElementById(section).style.display = 'block';
    }

    // Modal functionality
    (function(){
      const modal = document.getElementById('modal');
      const modalBody = document.getElementById('modal-body');
      const closeBtn = modal.querySelector('.close-modal');

      function openFrom(selector){
        const src = document.querySelector(selector);
        if (!src) { 
          console.warn('Missing modal content:', selector); 
          return; 
        }
        modalBody.innerHTML = src.innerHTML;
        modal.classList.add('active');
      }

      function closeModal(){
        modal.classList.remove('active');
        modalBody.innerHTML = '';
      }

      document.addEventListener('click', (e)=>{
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger){
          e.preventDefault();
          openFrom(trigger.getAttribute('data-modal-target'));
          return;
        }
        if (e.target === closeBtn || e.target === modal) {
          closeModal();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e)=>{
        if (e.key === 'Escape' && modal.classList.contains('active')){
          closeModal();
        }
      });
    })();



 //this key links the shop to the cart
  const CART_KEY = 'museumCartV1';

 // This function reads the Cart information and write it to JSON  
  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
/*This function is called by the addToCart button the first part reads the dataset contined in the buttons and asssigns the values to variables */
  function addToCart(btn) {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const unitPrice = Number(btn.dataset.price);
    const image = btn.dataset.image;

   /* This part puts all of the individual items and puts them into an object called cart and writes it to LocalStorage   */
    let cart = readCart();
    const idx = cart.findIndex(it => it.id === id);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id, name, unitPrice, qty: 1, image });
    }
    writeCart(cart);

  // Update the item card's qty badge
   const card = btn.closest('.souvenir-item');
    if (card) {
      const badge = card.querySelector('.qty-badge');
      if (badge) {
        const item = cart.find(it => it.id === id);
        badge.textContent = item ? `Qty: ${item.qty}` : '';
      }
    }
  }

  

 /* =================== CART FUNCTIONS =================== */
  const CART_KEY = 'museumCartV1';

  function readCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  
  function writeCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function money(n){
    const sign = n < 0 ? -1 : 1;
    const s = '$' + Math.abs(n).toFixed(2);
    return sign < 0 ? '('+s+')' : s;
  }

  const TAX_RATE = 0.102;
  const MEMBER_DISCOUNT_RATE = 0.15;
  const SHIPPING_RATE = 25.00;
  const VOLUME_TIERS = [
    [0.00, 49.99, 0.00],
    [50.00, 99.99, 0.05],
    [100.00, 199.99, 0.10],
    [200.00, Infinity, 0.15]
  ];

  function volumeRate(total){
    for (const [min,max,rate] of VOLUME_TIERS){
      if (total >= min && total <= max) return rate;
    }
    return 0;
  }

  function removeItem(id){
    const next = readCart().filter(it => it.id !== id);
    writeCart(next);
    render();
  }

  function clearCart(){
    writeCart([]);
    document.getElementById('memberToggle').checked = false;
    render();
  }

  /* ====================== RENDER FUNCTION ================================= */
  function render(){
    const itemsDiv   = document.getElementById('items');
    const summaryPre = document.getElementById('summary');
    const emptyMsg   = document.getElementById('emptyMsg');
    const isMember   = document.getElementById('memberToggle').checked;

    let cart = readCart().filter(it => it.qty > 0 && it.unitPrice > 0);

    // If cart is empty
    if (cart.length === 0) {
      emptyMsg.hidden = false;
      itemsDiv.hidden = true;
      summaryPre.hidden = true;
      return;
    }

    // Show cart items
    emptyMsg.hidden = true;
    itemsDiv.hidden = false;
    summaryPre.hidden = false;

    // Build items list
    let itemsHTML = '';
    let itemTotal = 0;

    cart.forEach(item => {
      const lineTotal = item.unitPrice * item.qty;
      itemTotal += lineTotal;
      
      itemsHTML += `
        <div class="cart-item">
          ${item.qty} × ${item.name} - ${money(lineTotal)}
          <button class="remove-btn" onclick="removeItem('${item.id}')">Remove</button>
        </div>
      `;
    });

    itemsDiv.innerHTML = itemsHTML;

    // Calculate discounts
    let memberDiscount = 0;
    let volumeDiscount = 0;
    const volRate = volumeRate(itemTotal);

    // Single discount rule
    if (isMember && volRate > 0) {
      const choice = prompt("Only one discount may be applied. Type 'M' for Member or 'V' for Volume:");
      if (choice && choice.toUpperCase() === 'M') {
        memberDiscount = itemTotal * MEMBER_DISCOUNT_RATE;
      } else if (choice && choice.toUpperCase() === 'V') {
        volumeDiscount = itemTotal * volRate;
      }
    } else if (isMember) {
      memberDiscount = itemTotal * MEMBER_DISCOUNT_RATE;
    } else if (volRate > 0) {
      volumeDiscount = itemTotal * volRate;
    }

    // Calculate totals
    const subtaxable = itemTotal - memberDiscount - volumeDiscount + SHIPPING_RATE;
    const taxAmount = subtaxable * TAX_RATE;
    const invoiceTotal = subtaxable + taxAmount;

    // Build summary
    summaryPre.textContent = 
`Subtotal of Items:        ${money(itemTotal)}
Volume Discount:          ${money(-volumeDiscount)}
Member Discount:          ${money(-memberDiscount)}
Shipping:                 ${money(SHIPPING_RATE)}
Subtotal (Taxable):       ${money(subtaxable)}
Tax Rate:                 ${(TAX_RATE * 100).toFixed(1)}%
Tax Amount:               ${money(taxAmount)}
Invoice Total:            ${money(invoiceTotal)}`;
  }

  // Events
  document.getElementById('memberToggle').addEventListener('change', render);
  document.getElementById('clearBtn').addEventListener('click', clearCart);


 render();
})();




