function doPost(e) {
  const orderData = JSON.parse(e.postData.contents);
  const sheetId = orderData.sheetId || PropertiesService.getScriptProperties().getProperty('DEFAULT_SHEET_ID');
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Orders');
  
  try {
    const timestamp = new Date();
    const orderId = Utilities.getUuid();
    
    sheet.appendRow([
      timestamp,
      orderId,
      orderData.clientId || '',
      orderData.name || '',
      orderData.phone || '',
      orderData.address || '',
      orderData.area || '',
      orderData.payment || '',
      JSON.stringify(orderData.items || []),
      orderData.subtotal || 0,
      orderData.discount || 0,
      orderData.deliveryFee || 0,
      orderData.total || 0,
      orderData.coupon || '',
      "New"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orderId: orderId,
      timestamp: timestamp.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: true,
      message: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}