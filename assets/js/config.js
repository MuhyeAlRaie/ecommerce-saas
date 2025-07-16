class ConfigManager {
  constructor() {
    this.config = {
      clientId: 'default',
      storeName: 'متجر إلكتروني',
      sheetId: '',
      orderSubmitUrl: '',
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
  }

  async load(clientId) {
    try {
      const response = await fetch(`clients/${clientId}.json`);
      const clientConfig = await response.json();
      this.config = { ...this.config, ...clientConfig };
    } catch (error) {
      console.error('Error loading client config:', error);
    }
    return this.config;
  }

  apply() {
    // Apply colors
    document.documentElement.style.setProperty('--primary', this.config.primaryColor);
    document.documentElement.style.setProperty('--secondary', this.config.secondaryColor);
    
    // Apply content
    document.getElementById('page-title').textContent = this.config.storeName;
    document.getElementById('hero-title').textContent = `مرحباً بكم في ${this.config.storeName}`;
    document.getElementById('contact-email').textContent = this.config.contactEmail;
    document.getElementById('contact-phone').textContent = this.config.contactPhone;
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Apply logo
    document.querySelectorAll('.store-logo').forEach(img => {
      img.src = this.config.logoUrl;
      img.alt = this.config.storeName;
    });
    
    // Setup delivery areas
    const areaSelect = document.getElementById('delivery-area');
    areaSelect.innerHTML = '<option value="" disabled selected>اختر منطقة التوصيل</option>';
    Object.entries(this.config.deliveryAreas).forEach(([id, area]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = area.name;
      areaSelect.appendChild(option);
    });
    
    // Setup payment methods
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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('client') || 'default';
  
  const configManager = new ConfigManager();
  const config = await configManager.load(clientId);
  window.appConfig = config;
  configManager.apply();
  
  // Dispatch event when config is ready
  document.dispatchEvent(new Event('configReady'));
});