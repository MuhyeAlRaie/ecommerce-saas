class ConfigManager {
  constructor() {
    this.defaultConfig = {
      clientId: 'default',
      storeName: 'متجر إلكتروني',
      sheetId: '14ZS2Q5MmQNkdcHSIq0Mnd1aDTLO1OSaJ41LfbvnbGzc',
      orderSubmitUrl: 'https://script.google.com/macros/s/AKfycbz3Bx9BQ7R6XUn02s9TH-6IqSUUPngwSlXrGCefFhQAt-hZZywRStYmDJ__CBkj-eH_1g/exec',
      logoUrl: 'assets/img/logo.png',
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      contactEmail: 'info@example.com',
      contactPhone: '+962-7-1234-5678',
      whatsappNumber: '962781313782',
      currency: 'د.أ',
      deliveryAreas: {
        area1: { name: 'المنطقة 1', fee: 5 },
        area2: { name: 'المنطقة 2', fee: 10 },
        area3: { name: 'المنطقة 3', fee: 15 }
      },
      paymentMethods: [
        { id: 'cash', name: 'نقداً' },
        { id: 'CliQ', name: 'CliQ' }
      ],
      coupons: {
        "SAVE10": 10,
        "OFF20": 20,
        "VIP30": 30
      }
    };
    this.config = { ...this.defaultConfig };
  }

  async load(clientId) {
    try {
      const response = await fetch(`clients/${clientId}.json`);
      if (!response.ok) throw new Error('Config not found');
      const clientConfig = await response.json();
      this.config = { ...this.defaultConfig, ...clientConfig };
    } catch (error) {
      console.warn(`استخدام الإعدادات الافتراضية (${error.message})`);
      this.config = { ...this.defaultConfig, clientId };
    }
    return this.config;
  }

  apply() {
    // تطبيق التخصيصات على الصفحة
    document.documentElement.style.setProperty('--primary', this.config.primaryColor);
    document.documentElement.style.setProperty('--secondary', this.config.secondaryColor);
    
    document.getElementById('page-title').textContent = this.config.storeName;
    document.getElementById('hero-title').textContent = `مرحباً بكم في ${this.config.storeName}`;
    document.getElementById('contact-email').textContent = this.config.contactEmail;
    document.getElementById('contact-phone').textContent = this.config.contactPhone;
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // تطبيق الشعار
    const logoElements = document.querySelectorAll('.store-logo');
    logoElements.forEach(img => {
      img.src = this.config.logoUrl;
      img.alt = this.config.storeName;
    });
    
    // إعداد مناطق التوصيل
    const areaSelect = document.getElementById('delivery-area');
    areaSelect.innerHTML = '<option value="" disabled selected>اختر منطقة التوصيل</option>';
    Object.entries(this.config.deliveryAreas).forEach(([id, area]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${area.name} (رسوم ${area.fee} ${this.config.currency})`;
      areaSelect.appendChild(option);
    });
    
    // إعداد طرق الدفع
    const paymentSelect = document.getElementById('payment');
    paymentSelect.innerHTML = '';
    this.config.paymentMethods.forEach(method => {
      const option = document.createElement('option');
      option.value = method.id;
      option.textContent = method.name;
      paymentSelect.appendChild(option);
    });
  }
}

// تهيئة المدير عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('client') || 'default';
  
  window.configManager = new ConfigManager();
  window.appConfig = await window.configManager.load(clientId);
  window.configManager.apply();
  
  // إرسال حدث عندما تكون الإعدادات جاهزة
  document.dispatchEvent(new CustomEvent('configReady', { detail: window.appConfig }));
});