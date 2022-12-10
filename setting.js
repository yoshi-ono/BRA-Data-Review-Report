var hcd_id;
var hcd_confirmor;
var sheet_BIF_autheniticity;

function setting()
{
  let toolSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet_BIF_autheniticity = toolSpreadsheet.getSheetByName('BIF_autheniticity');
  hcd_id = sheet_BIF_autheniticity.getRange('C1').getValue();
  hcd_confirmor = sheet_BIF_autheniticity.getRange('C3').getValue();
  Logger.log(hcd_id);
  Logger.log(hcd_confirmor);
}
