var g_editor;

const execution_error = "not done";


function start_auto_review()
{
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("自動審査", "審査を開始します。", ui.ButtonSet.OK_CANCEL);
  if (response === ui.Button.CANCEL) {
    return;
  }

  var ret = main();

  if (ret == execution_error)
    ui.alert("自動審査", "実行エラーです。実行メッセージを確認してください。", ui.ButtonSet.OK);
  else
    ui.alert("自動審査", "審査を終了しました。", ui.ButtonSet.OK);
}

function checkReviewEL(value)
{
  if (Number.isInteger(value)) {
    if (value > 0)
      return true;
  }
  return false;
}

function setExecutionErrMsg(msg)
{
  g_sheet_reportBIF.getRange("L7").setValue(msg);
  Logger.log(msg);
}

function main()
{
  var setting = new Setting();
  var msg = "";

  setExecutionErrMsg("");
  //--------------------------------------------------------------------------------
  // Review End Line の取得
  //--------------------------------------------------------------------------------
  var projectSheet = hcdSpreadsheet.getSheetByName("Project");
  if (projectSheet ===　null) {
    setExecutionErrMsg("Project シートが存在しません。");
    return execution_error;
  }

  var referencesReviewEL = projectSheet.getRange("B5").getValue();
  Logger.log("References Review End Line: " + referencesReviewEL);
  if (!checkReviewEL(referencesReviewEL)) {
    setExecutionErrMsg("Review End Line には、1以上の数字を入力してください。（References）");
    return execution_error;
  }

  var circuitsReviewEL = projectSheet.getRange("B6").getValue();
  Logger.log("Circuits Review End Line: " + circuitsReviewEL);
  if (!checkReviewEL(circuitsReviewEL)) {
    setExecutionErrMsg("Review End Line には、1以上の数字を入力してください。（Circuits）");
    return execution_error;
  }

  var connectionsReviewEL = projectSheet.getRange("B7").getValue();
  Logger.log("Connections Review End Line: " + connectionsReviewEL);
  if (!checkReviewEL(connectionsReviewEL)) {
    setExecutionErrMsg("Review End Line には、1以上の数字を入力してください。（Connections）");
    return execution_error;
  }

  var hcdeditorReviewEL = projectSheet.getRange("B8").getValue();
  Logger.log("HCDeditor Review End Line: " + hcdeditorReviewEL);
  if (!checkReviewEL(hcdeditorReviewEL)) {
    setExecutionErrMsg("Review End Line には、1以上の数字を入力してください。（HCDeditor）");
    return execution_error;
  }

  //--------------------------------------------------------------------------------
  // 自動審査
  //--------------------------------------------------------------------------------
  setting.showStatus("References を審査しています。");
  var references = new hcdReferences(referencesReviewEL);
  references.review();
  references.report(g_sheet_reportBIF, 17);

  setting.showStatus("Circuits を審査しています。");
  var circuits = new hcdCircuits(circuitsReviewEL);
  circuits.review();
  circuits.report(g_sheet_reportBIF, 23);

  setting.showStatus("Connections を審査しています。");
  var connections = new hcdConnections(connectionsReviewEL);
  connections.review();
  connections.report(g_sheet_reportBIF, 29);

  setting.showStatus("HCDeditor(1) を審査しています。");
  var editor1 = new hcdEditor(1);
  g_editor = editor1;
  editor1.review()
  editor1.report(g_sheet_reportHCD, 6);

  setting.showStatus("HCDeditor(2) を審査しています。");
  var editor2 = new hcdEditor(2);
  editor2.review()
  editor2.report(g_sheet_reportHCD, 12);

  setting.showStatus("HCDeditor(3) を審査しています。");
  var editor3 = new hcdEditor(3);
  editor3.review()
  editor3.report(g_sheet_reportHCD, 18);

  setting.showStatus("審査を終了しました。");
}
