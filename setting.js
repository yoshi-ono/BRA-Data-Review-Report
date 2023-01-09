var g_sheet_reportBIF;
var g_sheet_reportHCD;

var hcd_id;
var hcd_confirmor;

var hcdSpreadsheet

var listItems;

var today;

class Setting
{
  constructor()
  {
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    g_sheet_reportBIF = this.spreadsheet.getSheetByName('BIF_autheniticity');
    g_sheet_reportHCD = this.spreadsheet.getSheetByName('HCD');

    hcd_id = g_sheet_reportBIF.getRange('C7').getValue();
    hcd_confirmor = g_sheet_reportBIF.getRange('C9').getValue();
    Logger.log(hcd_id);
    Logger.log(hcd_confirmor);

    this.showStatus("HCDファイルを開いています。（この処理には、時間がかかる場合があります）")
    hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);
    this.showStatus("HCDファイルを開きました。")

    listItems = new ListItems();
    Logger.log(listItems);

    today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd");

    // Report
    g_sheet_reportBIF.getRange("C12").setValue(today);
  }

  showStatus(status)
  {
    this.spreadsheet.toast(status, "自動審査")
    Logger.log(status);
  }
}
