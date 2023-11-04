var g_sheet_reportSummary;
var g_sheet_reportReferences;
var g_sheet_reportCircuits;
var g_sheet_reportConnections;
var g_sheet_reportHCDeditor;

var g_bra_data;

var today;

class Setting
{
  constructor(toolDocId)
  {
    this.spreadsheet = SpreadsheetApp.openById(toolDocId);

    g_sheet_reportSummary = this.spreadsheet.getSheetByName('Summary');
    g_sheet_reportReferences = this.spreadsheet.getSheetByName('References');
    g_sheet_reportCircuits = this.spreadsheet.getSheetByName('Circuits');
    g_sheet_reportConnections = this.spreadsheet.getSheetByName('Connections');
    g_sheet_reportHCDeditor = this.spreadsheet.getSheetByName('HCDeditor');

    today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd HH:mm:ss");

    // Date and time of reviewed
    g_sheet_reportSummary.getRange("B28").setValue(today);
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
