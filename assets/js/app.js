class EcommerceApp {
  constructor() {
    // تهيئة المتغيرات
    this.products = [];
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.currentFilter = 'all';
    this.currentProduct = null;
    this.discountPercent = 0;
    this.appliedCoupon = null;
    this.deliveryFee = 0;
    
    // ربط الدوال بـ this
    this.initElements = this.initElements.bind(this);
    this.initEventListeners = this.initEventListeners.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
    this.displayProducts = this.displayProducts.bind(this);
    this.updateCart = this.updateCart.bind(this);
    
    // استدعاء الدوال الأولية
    this.initElements();
    this.initEventListeners();
    this.loadProducts();
    this.updateCart();
  }
  
  initElements() {
    this.elements = {
      productsContainer: document.getElementById('products'),
      cartCount: document.getElementById('cart-count'),
      cartItems: document.getElementById('cart-items'),
      cartTotal: document.getElementById('cart-total'),
      cartPopup: document.getElementById('cart-popup'),
      searchInput: document.getElementById('searchInput'),
      filterButtons: document.querySelectorAll('.filter-btn'),
      productPopup: document.getElementById('product-popup'),
      checkoutPopup: document.getElementById('checkout-popup'),
      // إضافة جميع العناصر الأخرى هنا
    };
  }
  
  initEventListeners() {
    // زر السلة
    document.getElementById('cart-button').addEventListener('click', () => this.toggleCartPopup());
    
    // زر إتمام الشراء
    document.getElementById('checkout-btn').addEventListener('click', () => this.showCheckoutPopup());
    
    // أزرار الفلترة
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        this.displayProducts();
      });
    });
    
    // حقل البحث
    this.elements.searchInput.addEventListener('input', () => this.displayProducts());
  }

  loadProducts() {
  if (!window.appConfig?.sheetId) {
    console.error('لا يوجد معرف لجوجل شيت - استخدام بيانات تجريبية');
    this.products = this.getSampleProducts();
    this.displayProducts();
    return;
  }
  
  // استخدم JSONP بدلاً من fetch لتجنب مشاكل CORS
  const script = document.createElement('script');
  script.src = `https://script.google.com/macros/s/${window.appConfig.sheetId}/exec?callback=handleProducts`;
  document.body.appendChild(script);
  
  // تعريف دالة الاستجابة
  window.handleProducts = (data) => {
    try {
      this.products = data.map(item => ({
        id: Number(item.id || 0),
        name: item.name || 'منتج بدون اسم',
        category: item.category || 'other',
        price: Number(item.price || 0),
        oldPrice: Number(item.oldPrice || 0),
        shortDesc: item.shortDesc || '',
        description: item.description || '',
        images: (item.images || '').split(',').map(s => s.trim()).filter(s => s),
        colors: (item.colors || '').split(',').map(c => c.trim()).filter(c => c),
        active: item.active !== 'FALSE'
      })).filter(p => p.active);
      
      this.displayProducts();
    } catch (error) {
      console.error('خطأ في معالجة البيانات:', error);
      this.products = this.getSampleProducts();
      this.displayProducts();
    } finally {
      document.body.removeChild(script);
      delete window.handleProducts;
    }
  };
  
  // إعداد مهلة للاستجابة
  setTimeout(() => {
    if (!this.products.length) {
      console.warn('تجاوزت المهلة - استخدام بيانات تجريبية');
      this.products = this.getSampleProducts();
      this.displayProducts();
    }
  }, 5000);
}

  getSampleProducts() {
    return [
      {
        id: 1,
        name: "منتج تجريبي 1",
        category: "electronics",
        price: 100,
        oldPrice: 120,
        shortDesc: "وصف قصير للمنتج الأول",
        description: "وصف كامل للمنتج التجريبي الأول",
        images: ["assets/img/logo.png"],
        colors: ["أحمر", "أزرق"],
        active: true
      },
      {
        id: 2,
        name: "منتج تجريبي 2",
        category: "fashion",
        price: 150,
        oldPrice: 180,
        shortDesc: "وصف قصير للمنتج الثاني",
        description: "وصف كامل للمنتج التجريبي الثاني",
        images: ["assets/img/logo.png"],
        colors: ["أخضر", "أصفر"],
        active: true
      }
    ];
  }

  displayProducts() {
    this.elements.productsContainer.innerHTML = '';
    const searchTerm = this.elements.searchInput.value.toLowerCase();
    
    const filtered = this.products.filter(p => 
      (this.currentFilter === 'all' || p.category === this.currentFilter) && 
      p.name.toLowerCase().includes(searchTerm)
    );
    
    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'col-6 col-md-3';
      
      card.innerHTML = `
        <div class="card product-card">
          <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.shortDesc}</p>
            <p class="card-text text-danger fw-bold">
              ${product.price} ${window.appConfig.currency}
              ${product.oldPrice ? `<span class="text-muted text-decoration-line-through">${product.oldPrice} ${window.appConfig.currency}</span>` : ''}
            </p>
            <button class="btn btn-sm btn-outline-primary" data-id="${product.id}">أضف إلى السلة</button>
            <button class="btn btn-sm btn-link" data-id="${product.id}" data-action="details">عرض التفاصيل</button>
          </div>
        </div>`;
      
      card.querySelector('[data-action="details"]').addEventListener('click', () => this.showProductPopup(product.id));
      card.querySelector('.btn-outline-primary').addEventListener('click', () => this.addToCart(product.id));
      
      this.elements.productsContainer.appendChild(card);
    });
  }

  updateCart() {
    this.elements.cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const list = this.elements.cartItems;
    list.innerHTML = '';
    
    this.cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center justify-content-between';
      li.innerHTML = `
        <img src="${item.images[0]}" style="width: 40px; height: 40px; object-fit: cover; margin-left: 10px;">
        <span class="flex-grow-1">(${item.id}) ${item.name}${item.color ? ' - ' + item.color : ''}<br> × ${item.quantity} </span>
        <span class="me-2">${item.price * item.quantity} ${window.appConfig.currency}</span>
        <button class="btn btn-sm btn-danger" data-index="${index}">×</button>`;
      list.appendChild(li);
    });

    let totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (this.discountPercent > 0) {
      const discount = totalPrice * (this.discountPercent / 100);
      const finalTotal = totalPrice - discount;
      
      this.elements.cartTotal.innerHTML = `
        <div><s>${totalPrice.toFixed(2)} ${window.appConfig.currency}</s></div>
        <div class="text-success">${finalTotal.toFixed(2)} ${window.appConfig.currency} بعد الخصم</div>`;
    } else {
      this.elements.cartTotal.textContent = `${totalPrice.toFixed(2)} ${window.appConfig.currency}`;
    }
    
    // حفظ السلة في localStorage
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // باقي الدوال...
  toggleCartPopup() {
    this.elements.cartPopup.style.display = this.elements.cartPopup.style.display === 'block' ? 'none' : 'block';
  }

  showCheckoutPopup() {
    this.toggleCartPopup();
    this.elements.checkoutPopup.style.display = 'block';
    this.updateOrderSummary();
  }

  // إضافة المزيد من الدوال حسب الحاجة
}

// تهيئة التطبيق عندما يكون الإعداد جاهزاً
document.addEventListener('configReady', () => {
  try {
    window.ecommerceApp = new EcommerceApp();
  } catch (error) {
    console.error('فشل في تهيئة متجر إلكتروني:', error);
    document.getElementById('products').innerHTML = `
      <div class="col-12 text-center py-5">
        <h4 class="text-danger">حدث خطأ في تحميل المتجر</h4>
        <p>يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني</p>
        <button class="btn btn-primary" onclick="window.location.reload()">إعادة تحميل الصفحة</button>
      </div>`;
  }
});