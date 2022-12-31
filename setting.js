var g_sheet_reportBIF;
var g_sheet_reportHCD;

var hcd_id;
var hcd_confirmor;

var hcdSpreadsheet

var listItems;

var today;

function setting()
{
  let toolSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  g_sheet_reportBIF = toolSpreadsheet.getSheetByName('BIF_autheniticity');
  g_sheet_reportHCD = toolSpreadsheet.getSheetByName('HCD');

  hcd_id = g_sheet_reportBIF.getRange('C1').getValue();
  hcd_confirmor = g_sheet_reportBIF.getRange('C3').getValue();
  Logger.log(hcd_id);
  Logger.log(hcd_confirmor);

  hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);

  listItems = new ListItems();
  Logger.log(listItems);

  today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd");

  // Report
  g_sheet_reportBIF.getRange("C6").setValue(today);
}
