var g_editor;

function start_auto_review()
{
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("自動審査", "審査を開始します。", ui.ButtonSet.OK_CANCEL);
  if (response === ui.Button.CANCEL) {
    return;
  }

  main();

  ui.alert("自動審査", "審査を終了しました。", ui.ButtonSet.OK);
}

function main()
{
  var setting = new Setting();

  // Review End Line の取得
  var projectSheet = hcdSpreadsheet.getSheetByName("Project");
  var referencesReviewEL = projectSheet.getRange("B5").getValue();
  var circuitsReviewEL = projectSheet.getRange("B6").getValue();
  var connectionsReviewEL = projectSheet.getRange("B7").getValue();
  Logger.log("References Review End Line: " + referencesReviewEL);
  Logger.log("Circuits Review End Line: " + circuitsReviewEL);
  Logger.log("Connections Review End Line: " + connectionsReviewEL);

  setting.showStatus("References を審査しています。");
  var references = new hcdReferences(referencesReviewEL);
  references.review();
  references.report(g_sheet_reportBIF, 11);

  setting.showStatus("Circuits を審査しています。");
  var circuits = new hcdCircuits(circuitsReviewEL);
  circuits.review();
  circuits.report(g_sheet_reportBIF, 17);

  setting.showStatus("Connections を審査しています。");
  var connections = new hcdConnections(connectionsReviewEL);
  connections.review();
  connections.report(g_sheet_reportBIF, 23);

  setting.showStatus("HCDeditor(1) を審査しています。");
  var editor1 = new hcdEditor(1);
  g_editor = editor1;
  editor1.review()
  editor1.report(g_sheet_reportHCD, 4);

  setting.showStatus("HCDeditor(2) を審査しています。");
  var editor2 = new hcdEditor(2);
  editor2.review()
  editor2.report(g_sheet_reportHCD, 9);

  setting.showStatus("HCDeditor(3) を審査しています。");
  var editor3 = new hcdEditor(3);
  editor3.review()
  editor3.report(g_sheet_reportHCD, 14);

  setting.showStatus("審査を終了しました。");
}
