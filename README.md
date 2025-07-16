# E-commerce SaaS Solution

A white-label e-commerce solution powered by Google Sheets.

## Features

- Multi-client support
- Product management via Google Sheets
- Order tracking via Google Sheets
- Customizable branding
- Mobile responsive
- RTL support (Arabic)

## Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-saas.git
   ```

2. **Set up Google Sheets**
   - Create two sheets: "Products" and "Orders"
   - Use the templates provided in `SETUP.md`

3. **Deploy Google Apps Script**
   - Copy the scripts from `google-scripts/` to your Google Apps Script project
   - Deploy as web app

4. **Configure clients**
   - Create a JSON file for each client in `clients/` folder
   - Example configuration:
     ```json
     {
       "clientId": "client1",
       "storeName": "متجر العميل الأول",
       "sheetId": "YOUR_GOOGLE_SHEET_ID",
       "logoUrl": "assets/img/client1-logo.png",
       "primaryColor": "#2c3e50",
       "contactEmail": "client1@example.com",
       "contactPhone": "+962-7-0000-0001"
     }
     ```

5. **Deploy the storefront**
   - Host on GitHub Pages, Netlify, or any static hosting

## Access Stores

Access client stores using URL parameter:
```
https://yourdomain.com?client=client1
```

Or configure subdomains for each client.