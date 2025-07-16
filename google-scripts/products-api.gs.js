function doGet(e) {
  const sheetId = e.parameter.sheetId || PropertiesService.getScriptProperties().getProperty('DEFAULT_SHEET_ID');
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Products');
  
  try {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).filter(row => row[headers.indexOf('active')] !== 'FALSE');
    
    const products = rows.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify(products))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: true,
      message: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}