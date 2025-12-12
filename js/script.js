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

  // Modal functionality
  // Modal JS
  (function(){
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal.querySelector('.close-modal');
    let lastTrigger = null;

    function openFrom(selector, trigger){
      const src = document.querySelector(selector);
      if (!src) { console.warn('Missing modal content:', selector); return; }
      modalBody.innerHTML = src.innerHTML;
      modal.style.display = 'block';
      lastTrigger = trigger || null;
    }

    function closeModal(){
      modal.style.display = 'none';
      modalBody.innerHTML = '';
    }

    document.addEventListener('click', (e)=>{
      const trigger = e.target.closest('[data-modal-target]');
      if (trigger){
        e.preventDefault();
        openFrom(trigger.getAttribute('data-modal-target'), trigger);
        return;
      }
      if (e.target === closeBtn) closeModal();
    });
  })();




