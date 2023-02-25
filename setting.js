/*
var g_sheet_reportBIF;
var g_sheet_reportHCD;
*/
var g_sheet_reportSummary;
var g_sheet_reportReferences;
var g_sheet_reportCircuits;
var g_sheet_reportConnections;
var g_sheet_reportHCDeditor;

var hcdSpreadsheet

var listItems;

var today;

class Setting
{
  constructor(toolDocId)
  {
    this.spreadsheet = SpreadsheetApp.openById(toolDocId);

    /*
    g_sheet_reportBIF = this.spreadsheet.getSheetByName('BIF_autheniticity');
    g_sheet_reportHCD = this.spreadsheet.getSheetByName('HCD');
    */
    g_sheet_reportSummary = this.spreadsheet.getSheetByName('Summary');
    g_sheet_reportReferences = this.spreadsheet.getSheetByName('References');
    g_sheet_reportCircuits = this.spreadsheet.getSheetByName('Circuits');
    g_sheet_reportConnections = this.spreadsheet.getSheetByName('Connections');
    g_sheet_reportHCDeditor = this.spreadsheet.getSheetByName('HCDeditor');

    today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd HH:mm:ss");

    // Date and time of reviewed
    g_sheet_reportSummary.getRange("B28").setValue(today);
  }

  openHcdSpreadSheet()
  {
    var hcd_id = g_sheet_reportSummary.getRange('C9').getValue();
    Logger.log(hcd_id);
    if (hcd_id.trim() == "")
      throw new Error("Document ID を入力してください。");

    this.showStatus("HCDファイルを開いています。（この処理には、時間がかかる場合があります）")
    hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);
    this.showStatus("HCDファイルを開きました。")

    var sheetHCDs = hcdSpreadsheet.getSheetByName('HCDs');
    this.hcdNames = {};
    this.hcdNames[1] = sheetHCDs.getRange("B2").getValue().trim();
    this.hcdNames[2] = sheetHCDs.getRange("B3").getValue().trim();
    this.hcdNames[3] = sheetHCDs.getRange("B4").getValue().trim();
    Logger.log(this.hcdNames);

    listItems = new ListItems();
    Logger.log(listItems);
  }

  isEnableHCD(hcdNumber)
  {
    if (this.hcdNames[hcdNumber] == "")
      return false;
    else
      return true;
  }

  showStatus(status)
  {
    try {
      this.spreadsheet.toast(status, "自動審査")
    } catch (e) {
      Logger.log(e.message);
    }
    Logger.log(status);
  }
}
