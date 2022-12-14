var sheet_BIF_autheniticity;
var hcd_id;
var hcd_confirmor;

var hcdSpreadsheet

var listItems;

var today;

function setting()
{
  let toolSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet_BIF_autheniticity = toolSpreadsheet.getSheetByName('BIF_autheniticity');
  hcd_id = sheet_BIF_autheniticity.getRange('C1').getValue();
  hcd_confirmor = sheet_BIF_autheniticity.getRange('C3').getValue();
  Logger.log(hcd_id);
  Logger.log(hcd_confirmor);

  hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);

  listItems = new ListItems();
  Logger.log(listItems);

  today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd");

  // Report
  sheet_BIF_autheniticity.getRange("C6").setValue(today);
}
