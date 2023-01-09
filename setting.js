var g_sheet_reportBIF;
var g_sheet_reportHCD;

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

    today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd");

    // Confirmed date
    g_sheet_reportBIF.getRange("C12").setValue(today);
  }

  openHcdSpreadSheet()
  {
    var hcd_id = g_sheet_reportBIF.getRange('C7').getValue();
    Logger.log(hcd_id);
    if (hcd_id.trim() == "")
      throw new Error("Document ID を入力してください。");

    hcd_confirmor = g_sheet_reportBIF.getRange('C9').getValue();
    Logger.log(hcd_confirmor);
    if (hcd_confirmor.trim() == "")
      throw new Error("Confirmor を入力してください。");

    this.showStatus("HCDファイルを開いています。（この処理には、時間がかかる場合があります）")
    hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);
    this.showStatus("HCDファイルを開きました。")

    listItems = new ListItems();
    Logger.log(listItems);
  }

  showStatus(status)
  {
    this.spreadsheet.toast(status, "自動審査")
    Logger.log(status);
  }
}
