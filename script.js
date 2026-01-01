// Vanilla JS version of the app (replaces React)
// Add global error handlers and an on-page error overlay so failures are visible
function _showErrorOverlay(message){
  try{
    const root = document.getElementById('root') || document.body;
    const o = document.createElement('div');
    o.style.position = 'fixed';
    o.style.left = '10px';
    o.style.right = '10px';
    o.style.bottom = '10px';
    o.style.zIndex = 99999;
    o.style.background = 'rgba(255,255,255,0.95)';
    o.style.border = '1px solid #ef4444';
    o.style.padding = '12px';
    o.style.borderRadius = '8px';
    o.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    o.style.maxHeight = '40vh';
    o.style.overflow = 'auto';
    const title = document.createElement('div');
    title.style.fontWeight = '700';
    title.style.color = '#ef4444';
    title.style.marginBottom = '8px';
    title.textContent = 'Application error — check details below';
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.margin = 0;
    pre.textContent = message;
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.marginTop = '8px';
    close.addEventListener('click', ()=> o.remove());
    o.appendChild(title); o.appendChild(pre); o.appendChild(close);
    document.body.appendChild(o);
    console.error('App overlay error:', message);
  }catch(e){ console.error(e); }
}

window.addEventListener('error', function(ev){
  _showErrorOverlay((ev && ev.message) ? ev.message : String(ev));
});
window.addEventListener('unhandledrejection', function(ev){
  _showErrorOverlay((ev && ev.reason) ? String(ev.reason) : 'Unhandled rejection');
});

// Add a tiny visual indicator when this script runs
function _addLoadBadge(){
  try{
    const b = document.createElement('div');
    b.textContent = 'script loaded';
    b.style.position = 'fixed';
    b.style.right = '12px';
    b.style.top = '12px';
    b.style.background = '#3b82f6';
    b.style.color = '#ffffff';
    b.style.padding = '6px 10px';
    b.style.borderRadius = '8px';
    b.style.zIndex = 99998;
    b.style.fontSize = '12px';
    b.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    document.body.appendChild(b);
    setTimeout(()=> b.remove(), 5000);
  }catch(e){/*ignore*/}
}

(function(){
  _addLoadBadge();
  
  // Cart data
  let cart = [];
  
  // Data
  const slides = [
    { image: 'pics/badminton1.webp', sport: 'Badminton' },
    { image: 'pics/basketball1.jpg', sport: 'Basketball' },
    { image: 'pics/cricket1.webp', sport: 'Cricket' }
  ];

  const venues = [
    { name: 'Kanteerava Badminton Academy', price: 400, images: ['pics/badminton1.webp','pics/badminton2.webp'] },
    { name: 'Bangalore Basketball Club', price: 750, images: ['pics/basketball1.jpg','pics/basketball2.jpg'] },
    { name: 'Adarsh Cricket Ground', price: 1000, images: ['pics/cricket1.webp','pics/cricket2.webp'] }
  ];

  const ADMIN_EMAIL = 'admin@sports.com';
  const ADMIN_PASSWORD = 'admin123';

  // Helpers
  function el(tag, attrs = {}, children = []){
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (typeof c === 'number') node.appendChild(document.createTextNode(String(c)));
      else if (c && c.nodeType) node.appendChild(c);
    });
    return node;
  }

  function showLoading(){
    const root = document.getElementById('root');
    root.innerHTML = '<div style="background:linear-gradient(135deg,#3b82f6,#2563eb);min-height:100vh;display:flex;align-items:center;justify-content:center;"><div style="background:#ffffff;padding:40px;border-radius:15px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.2);"><p>Loading...</p></div></div>';
  }

  function renderLogin(){
    const root = document.getElementById('root');
    root.innerHTML = '';

    const container = el('div', { className: 'login-page' },
      el('div', { className: 'login-container' })
    );

    const box = container.querySelector('.login-container');
    box.appendChild(el('h1', {}, 'Sports Venue Booking'));

    const buttonsWrap = el('div', { className: 'login-buttons' });
    const userBtn = el('button', { className: 'active' }, 'User Login');
    const adminBtn = el('button', {}, 'Admin Login');
    const signupBtn = el('button', {}, 'Sign Up');
    buttonsWrap.appendChild(userBtn);
    buttonsWrap.appendChild(adminBtn);
    buttonsWrap.appendChild(signupBtn);
    box.appendChild(buttonsWrap);

    const formWrap = el('div', {});
    box.appendChild(formWrap);

    const state = { mode: 'user' };

    function renderForm(){
      formWrap.innerHTML = '';
      if (state.mode === 'signup'){
        const nameInput = el('input',{ placeholder: 'Full Name' });
        const emailInput = el('input',{ placeholder: 'Email Address', type: 'email' });
        const passInput = el('input',{ placeholder: 'Password', type: 'password' });
        const confirmInput = el('input',{ placeholder: 'Confirm Password', type: 'password' });
        const err = el('p', { style: 'color:#ef4444;margin-top:10px;display:none' });
        const success = el('p', { style: 'color:#10b981;margin-top:10px;display:none' });
        const createBtn = el('button', { className: 'submit-btn' }, 'Create Account');

        createBtn.addEventListener('click', () => {
          err.style.display = 'none'; success.style.display = 'none';
          const name = nameInput.value.trim();
          const email = emailInput.value.trim();
          const pass = passInput.value;
          const conf = confirmInput.value;
          if (!name || !email || !pass || !conf){ err.textContent = 'Please fill in all fields'; err.style.display='block'; return; }
          if (pass !== conf){ err.textContent = 'Passwords do not match'; err.style.display='block'; return; }
          if (pass.length < 6){ err.textContent = 'Password must be at least 6 characters'; err.style.display='block'; return; }
          
          // Send signup to server
          fetch('/api/signup', { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify({ email, fullName: name, password: pass }) 
          })
            .then(r=> r.json())
            .then(res=> {
              if (res.message.includes('successfully')) {
                success.textContent = 'Account created! Logging in...'; success.style.display='block';
                setTimeout(()=>{ onLogin({ email, fullName: name, userType: 'user' }); }, 800);
              } else {
                err.textContent = res.message; err.style.display='block';
              }
            })
            .catch(()=> { err.textContent = 'Signup failed'; err.style.display='block'; });
        });

        formWrap.appendChild(nameInput);
        formWrap.appendChild(emailInput);
        formWrap.appendChild(passInput);
        formWrap.appendChild(confirmInput);
        formWrap.appendChild(err);
        formWrap.appendChild(success);
        formWrap.appendChild(createBtn);
      } else {
        const emailInput = el('input',{ placeholder: 'Email Address', type: 'email' });
        const passInput = el('input',{ placeholder: 'Password', type: 'password' });
        const err = el('p', { style: 'color:#ef4444;margin-top:10px;display:none' });
        const loginBtn = el('button', { className: 'submit-btn' }, state.mode === 'admin' ? 'Admin Login' : 'User Login');
        const demo = el('p', { style: 'font-size:12px;color:#64748b;margin-top:15px;text-align:center;display:none' }, 'Demo Admin: Email: admin@sports.com Password: admin123');

        if (state.mode === 'admin') demo.style.display = 'block';

        loginBtn.addEventListener('click', ()=>{
          err.style.display='none';
          const email = emailInput.value.trim();
          const pass = passInput.value;
          if (!email || !pass){ err.textContent = 'Please fill in all fields'; err.style.display='block'; return; }
          
          // Check if admin login
          if (state.mode === 'admin'){
            if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD){ 
              onLogin({ email, fullName: 'Admin', userType: 'admin' }); 
            } else { 
              err.textContent = 'Invalid admin credentials'; err.style.display='block'; 
            }
          } else {
            // User login - validate against server
            fetch('/api/login', { 
              method: 'POST', 
              headers: {'Content-Type':'application/json'}, 
              body: JSON.stringify({ email, password: pass }) 
            })
              .then(r=> r.json())
              .then(res=> {
                if (res.fullName) {
                  onLogin({ email, fullName: res.fullName, userType: 'user' });
                } else {
                  err.textContent = res.message; err.style.display='block';
                }
              })
              .catch(()=> { err.textContent = 'Login failed'; err.style.display='block'; });
          }
        });

        formWrap.appendChild(emailInput);
        formWrap.appendChild(passInput);
        formWrap.appendChild(err);
        formWrap.appendChild(loginBtn);
        formWrap.appendChild(demo);
      }
    }

    function setMode(m){ state.mode = m; userBtn.className = m==='user' ? 'active' : ''; adminBtn.className = m==='admin' ? 'active' : ''; signupBtn.className = m==='signup' ? 'active' : ''; renderForm(); }

    userBtn.addEventListener('click', ()=> setMode('user'));
    adminBtn.addEventListener('click', ()=> setMode('admin'));
    signupBtn.addEventListener('click', ()=> setMode('signup'));

    function onLogin(user){
      if(user.userType === 'admin'){
        renderAdminDashboard(user);
      } else {
        renderMainWithCart(user);
      }
    }

    setMode('user');
    root.appendChild(container);
  }

  function renderAdminDashboard(user){
    const root = document.getElementById('root');
    root.innerHTML = '';

    // header
    const header = el('div', { style: "background:#0f172a;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;color:#ffffff;" });
    header.appendChild(el('h2', { style: 'margin:0' }, `Admin Dashboard - ${user.email}`));
    const logout = el('button', { style: 'padding:10px 20px;background:#ffffff;color:#0f172a;border:none;border-radius:6px;cursor:pointer;font-weight:bold;transition:all 0.3s' }, 'Logout');
    logout.addEventListener('click', ()=> renderLogin());
    header.appendChild(logout);
    root.appendChild(header);

    // container
    const container = el('div', { style: 'max-width:1400px;margin:30px auto;padding:24px' });
    const title = el('h3', { style: 'color:#ffffff;margin:0 0 24px 0;font-size:24px;font-weight:600' }, 'All Bookings');
    container.appendChild(title);

    const table = el('table', { className: 'admin-table' });
    const thead = el('thead');
    const headerRow = el('tr');
    headerRow.appendChild(el('th', {}, 'Name'));
    headerRow.appendChild(el('th', {}, 'Phone'));
    headerRow.appendChild(el('th', {}, 'Venue'));
    headerRow.appendChild(el('th', {}, 'Date'));
    headerRow.appendChild(el('th', {}, 'Time'));
    headerRow.appendChild(el('th', { style: 'text-align:right' }, 'Price'));
    headerRow.appendChild(el('th', { style: 'text-align:center' }, 'Action'));
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = el('tbody');
    table.appendChild(tbody);
    container.appendChild(table);

    const status = el('div', { className: 'empty-state' });
    status.appendChild(el('div', { className: 'empty-state-icon' }, '📋'));
    status.appendChild(el('p', { className: 'empty-state-text' }, 'Loading bookings...'));
    container.appendChild(status);

    root.appendChild(container);

    // fetch bookings
    console.log('Admin dashboard: About to fetch bookings...');
    fetch('/api/bookings')
      .then(r=> {
        console.log('Bookings response status:', r.status);
        return r.json();
      })
      .then(bookings=> {
        console.log('Bookings data:', bookings);
        tbody.innerHTML = '';
        if(bookings.length === 0){
          status.innerHTML = '';
          status.appendChild(el('div', { className: 'empty-state-icon' }, '📭'));
          status.appendChild(el('p', { className: 'empty-state-text' }, 'No bookings yet'));
          return;
        }
        status.remove();
        bookings.forEach(booking => {
          const row = el('tr');
          
          row.appendChild(el('td', {}, booking.name || 'N/A'));
          row.appendChild(el('td', {}, booking.phone || 'N/A'));
          row.appendChild(el('td', {}, booking.venue || 'N/A'));
          row.appendChild(el('td', {}, booking.date || 'N/A'));
          row.appendChild(el('td', {}, booking.time || 'N/A'));
          row.appendChild(el('td', { style: 'text-align:right;font-weight:600;color:#3b82f6' }, booking.price ? '₹' + booking.price : 'N/A'));
          
          const deleteBtn = el('button', { style: 'padding:8px 16px;background:#ef4444;color:#ffffff;border:none;border-radius:6px;cursor:pointer;font-weight:600;transition:all 0.2s;font-size:13px' }, 'Delete');
          deleteBtn.addEventListener('mouseenter', ()=> deleteBtn.style.background = '#dc2626');
          deleteBtn.addEventListener('mouseleave', ()=> deleteBtn.style.background = '#ef4444');
          deleteBtn.addEventListener('click', (e)=> {
            e.stopPropagation();
            if(confirm('Delete this booking?')){
              fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' })
                .then(r=> r.json())
                .then(()=> renderAdminDashboard(user))
                .catch(()=> alert('Error deleting booking'));
            }
          });
          const td = el('td', { className: 'action-cell' }, deleteBtn);
          row.appendChild(td);
          tbody.appendChild(row);
        });
      })
      .catch(e=> {
        console.error('Fetch error:', e);
        status.innerHTML = '';
        status.appendChild(el('div', { className: 'empty-state-icon', style: 'color:#ef4444' }, '⚠️'));
        status.appendChild(el('p', { className: 'empty-state-text', style: 'color:#ef4444' }, 'Error loading bookings: ' + e.message));
      });
  }

  function renderMain(user){

    const root = document.getElementById('root');
    root.innerHTML = '';

    // header
    const header = el('div', { style: "background:#0f172a;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;color:#ffffff;" });
    const title = el('h2', { style: 'margin:0' }, `Welcome, ${user.email} (${user.userType})`);
    
    const rightNav = el('div', { style: 'display:flex;gap:15px;align-items:center' });
    const cartBtn = el('button', { style: 'padding:10px 15px;background:#1e293b;color:#ffffff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;position:relative;transition:all 0.3s' }, '🛒 Cart');
    const cartCount = el('span', { style: 'position:absolute;top:-5px;right:-5px;background:#ef4444;color:#ffffff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold' }, '0');
    cartBtn.style.position = 'relative';
    cartBtn.appendChild(cartCount);
    
    cartBtn.addEventListener('click', ()=> renderCart());
    
    const logout = el('button', { style: 'padding:10px 20px;background:#ffffff;color:#0f172a;border:none;border-radius:6px;cursor:pointer;font-weight:bold;transition:all 0.3s' }, 'Logout');
    logout.addEventListener('click', ()=> renderLogin());
    
    rightNav.appendChild(cartBtn);
    rightNav.appendChild(logout);
    header.appendChild(title);
    header.appendChild(rightNav);

    root.appendChild(header);

    // carousel
    const carousel = el('div', { className: 'carousel' });
    const img = el('img', { src: slides[0].image, alt: slides[0].sport });
    const hero = el('div', { className: 'hero' });
    hero.appendChild(el('h1', {}, 'Book Sports Venues Instantly'));
    hero.appendChild(el('p', {}, 'Find and book nearby sports venues in seconds.'));
    const bookNow = el('button', {}, 'Book Now');
    bookNow.addEventListener('click', ()=>{ const cards = document.querySelector('.cards'); if(cards) cards.scrollIntoView({behavior:'smooth'}); });
    hero.appendChild(bookNow);
    carousel.appendChild(img); carousel.appendChild(hero);
    root.appendChild(carousel);

    let slideIndex = 0;
    setInterval(()=>{ slideIndex = (slideIndex+1) % slides.length; img.src = slides[slideIndex].image; }, 3000);

    // section cards
    const section = el('div', { className: 'section', style: 'background:#1e293b' });
    section.appendChild(el('h2', { style: 'color:#ffffff' }, 'Popular Venues'));
    const cards = el('div', { className: 'cards' });
    venues.forEach(v => {
      const card = el('div', { className: 'card' });
      const cimg = el('img', { src: v.images[0] });
      const name = el('p', {}, v.name);
      const price = el('p', { className: 'price' }, `₹${v.price}/hour`);
      card.appendChild(cimg); card.appendChild(name); card.appendChild(price);
      card.addEventListener('click', ()=> openModal(v));
      cards.appendChild(card);
    });
    section.appendChild(cards);
    root.appendChild(section);

    // modal
    const modal = el('div', { className: 'modal', id: 'booking-modal' });
    const modalContent = el('div', { className: 'modal-content' });
    modalContent.appendChild(el('span', { className: 'modal-close', style: 'float:right;font-size:28px;cursor:pointer;color:#64748b' }, '×'));
    const modalTitle = el('h2', {});
    const modalPrice = el('p', { style: 'color:#3b82f6;font-size:18px;font-weight:bold' });

    const nameInput = el('input', { placeholder: 'Your Name', value: user.fullName || user.email });
    const phoneInput = el('input', { placeholder: 'Phone Number', maxLength: 10 });
    const dateInput = el('input', { type: 'date' });
    const timeSelect = el('select'); timeSelect.appendChild(el('option', { value: '' }, 'Select Time'));
    ['06:00 - 08:00','08:00 - 10:00','10:00 - 12:00','12:00 - 14:00','14:00 - 16:00','16:00 - 18:00','18:00 - 20:00','20:00 - 22:00'].forEach(t=> timeSelect.appendChild(el('option', {}, t)));
    const addCartBtn = el('button', { style: 'margin-top:20px;background:#10b981;color:#ffffff;border:none;padding:12px;border-radius:8px;cursor:pointer;font-weight:bold;transition:all 0.3s' }, 'Add to Cart');
    const confirmBtn = el('button', { style: 'margin-top:10px;background:#3b82f6;color:#ffffff;border:none;padding:12px;border-radius:8px;cursor:pointer;font-weight:bold;transition:all 0.3s' }, 'Book Now');
    const msg = el('div', { id: 'msg' });

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalPrice);
    modalContent.appendChild(nameInput);
    modalContent.appendChild(phoneInput);
    modalContent.appendChild(dateInput);
    modalContent.appendChild(timeSelect);
    modalContent.appendChild(addCartBtn);
    modalContent.appendChild(confirmBtn);
    modalContent.appendChild(msg);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', ()=> modal.classList.remove('active'));

    function openModal(venue){
      modalTitle.textContent = 'Book ' + venue.name;
      modalPrice.textContent = 'Price: ₹' + venue.price + '/hour';
      nameInput.value = user.fullName || user.email;
      phoneInput.value = '';
      dateInput.value = '';
      timeSelect.value = '';
      msg.textContent = '';
      modal.classList.add('active');
    }

    addCartBtn.addEventListener('click', ()=>{
      const phone = phoneInput.value.trim();
      if (!/^\d{10}$/.test(phone)){ msg.textContent = 'Phone number must be exactly 10 digits'; msg.style.color='#ef4444'; return; }
      const item = {
        name: nameInput.value.trim(),
        phone: phone,
        sport: 'General',
        venue: modalTitle.textContent.replace('Book ',''),
        date: dateInput.value,
        time: timeSelect.value,
        price: parseInt(modalPrice.textContent.match(/\d+/)[0])
      };
      if(!item.date || !item.time){ msg.textContent = 'Please select date and time'; msg.style.color='#ef4444'; return; }
      cart.push(item);
      msg.textContent = 'Added to cart! ✓';
      msg.style.color = '#10b981';
      cartCount.textContent = cart.length;
      setTimeout(()=> modal.classList.remove('active'), 800);
    });

    confirmBtn.addEventListener('click', ()=>{
      const phone = phoneInput.value.trim();
      if (!/^\d{10}$/.test(phone)){ msg.textContent = 'Phone number must be exactly 10 digits'; msg.style.color='#ef4444'; return; }
      const data = {
        name: nameInput.value.trim(),
        phone: phone,
        sport: 'General',
        venue: modalTitle.textContent.replace('Book ','') ,
        date: dateInput.value,
        time: timeSelect.value
      };
      fetch('/api/book', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
        .then(r=>r.json()).then(res=>{ msg.textContent = res.message || 'Booked'; modal.classList.remove('active'); })
        .catch(()=> msg.textContent = 'Error saving booking');
    });
  }

  function renderCart(){
    const root = document.getElementById('root');
    root.innerHTML = '';

    const backHeader = el('div', { style: "background:#0f172a;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;color:#ffffff;" });
    const backBtn = el('button', { style: 'padding:10px 20px;background:#ffffff;color:#0f172a;border:none;border-radius:6px;cursor:pointer;font-weight:bold;transition:all 0.3s' }, '← Back');
    backBtn.addEventListener('click', ()=> renderMain(currentUser));
    backHeader.appendChild(el('h2', { style: 'margin:0' }, '🛒 Your Cart'));
    backHeader.appendChild(backBtn);
    root.appendChild(backHeader);

    const container = el('div', { style: 'max-width:1000px;margin:30px auto;padding:24px' });

    if(cart.length === 0){
      const emptyState = el('div', { className: 'empty-state' });
      emptyState.appendChild(el('div', { className: 'empty-state-icon' }, '🛒'));
      emptyState.appendChild(el('p', { className: 'empty-state-text' }, 'Your cart is empty'));
      container.appendChild(emptyState);
      root.appendChild(container);
      return;
    }

    const table = el('table', { className: 'cart-table' });
    const thead = el('thead');
    const headerRow = el('tr');
    headerRow.appendChild(el('th', {}, 'Venue'));
    headerRow.appendChild(el('th', {}, 'Date'));
    headerRow.appendChild(el('th', {}, 'Time'));
    headerRow.appendChild(el('th', { style: 'text-align:right' }, 'Price'));
    headerRow.appendChild(el('th', { style: 'text-align:center' }, 'Action'));
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = el('tbody');
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price;
      const row = el('tr');
      row.appendChild(el('td', { style: 'font-weight:500' }, item.venue));
      row.appendChild(el('td', {}, item.date));
      row.appendChild(el('td', {}, item.time));
      row.appendChild(el('td', { style: 'text-align:right;font-weight:600;color:#3b82f6' }, '₹' + item.price));
      const removeBtn = el('button', { style: 'padding:8px 16px;background:#ef4444;color:#ffffff;border:none;border-radius:6px;cursor:pointer;font-weight:600;transition:all 0.2s;font-size:13px' }, 'Remove');
      removeBtn.addEventListener('mouseenter', ()=> removeBtn.style.background = '#dc2626');
      removeBtn.addEventListener('mouseleave', ()=> removeBtn.style.background = '#ef4444');
      removeBtn.addEventListener('click', ()=> { cart.splice(idx, 1); renderCart(); });
      const td = el('td', { className: 'action-cell' }, removeBtn);
      row.appendChild(td);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);

    const totalRow = el('div', { className: 'cart-total' });
    totalRow.appendChild(el('span', { className: 'cart-total-label' }, 'Total'));
    totalRow.appendChild(el('span', { className: 'cart-total-amount' }, `₹${total}`));
    container.appendChild(totalRow);

    const checkoutBtn = el('button', { className: 'checkout-button' }, 'Checkout All');
    checkoutBtn.addEventListener('click', ()=> {
      if(cart.length === 0) return;
      checkoutBtn.textContent = 'Processing...';
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.7';
      const promises = cart.map(item => 
        fetch('/api/book', { 
          method: 'POST', 
          headers: {'Content-Type':'application/json'}, 
          body: JSON.stringify(item) 
        }).then(r=> r.json())
      );
      Promise.all(promises).then(()=> { 
        cart = []; 
        alert('All bookings confirmed!'); 
        renderMain(currentUser); 
      }).catch(()=> {
        alert('Error processing bookings');
        checkoutBtn.textContent = 'Checkout All';
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
      });
    });
    container.appendChild(checkoutBtn);
    root.appendChild(container);
  }

  let currentUser = null;

  function renderMainWithCart(user){
    currentUser = user;
    renderMain(user);
  }

  // Initialize
  showLoading();
  console.log('App init: showing loading...');
  // small delay to mimic load
  setTimeout(()=> {
    console.log('App init: calling renderLogin...');
    try {
      renderLogin();

      console.log('App init: renderLogin completed');
    } catch(e) {
      console.error('renderLogin error:', e);
      _showErrorOverlay('renderLogin error: ' + e.message);
    }
  }, 300);
  
  // Safety: ensure login renders after 1s
  setTimeout(()=> {
    if (!document.querySelector('.login-page')) {
      console.warn('Login page not found, forcing render...');
      renderLogin();
    }
  }, 1000);

})();
