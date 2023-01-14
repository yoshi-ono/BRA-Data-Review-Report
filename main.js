var g_editor;

const execution_error = "not done";
const auto_incomplete = "reject";
const auto_complete = "pass";


function start_auto_review()
{
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("自動審査", "審査を開始します。", ui.ButtonSet.OK_CANCEL);
  if (response === ui.Button.CANCEL) {
    return;
  }

  var ret = main();

  if (ret == execution_error)
    ui.alert("自動審査", "実行エラーです。実行メッセージを確認してください。\n return status: " + ret, ui.ButtonSet.OK);
  else if (ret == auto_incomplete)
    ui.alert("自動審査", "NG があります。\n return status: " + ret, ui.ButtonSet.OK);
  else
    ui.alert("自動審査", "すべて Good です！\n return status: " + ret, ui.ButtonSet.OK);
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

  setExecutionErrMsg("");

  try {
    setting.openHcdSpreadSheet();
  } catch(e) {
    setExecutionErrMsg(e.message);
    return execution_error;
  }

  //--------------------------------------------------------------------------------
  // Project 情報の参照
  //--------------------------------------------------------------------------------
  var projectSheet = hcdSpreadsheet.getSheetByName("Project");
  if (projectSheet ===　null) {
    setExecutionErrMsg("Project シートが存在しません。");
    return execution_error;
  }

  var projectInfo = projectSheet.getRange("A2:E2").getValues();
  g_sheet_reportBIF.getRange("C1").setValue(projectInfo[0][0]);
  g_sheet_reportBIF.getRange("C2").setValue(projectInfo[0][1]);
  g_sheet_reportBIF.getRange("C3").setValue(projectInfo[0][2]);
  g_sheet_reportBIF.getRange("C4").setValue(projectInfo[0][3]);
  g_sheet_reportBIF.getRange("C5").setValue(projectInfo[0][4]);

  //--------------------------------------------------------------------------------
  // Review End Line の取得
  //--------------------------------------------------------------------------------
  var referencesReviewEL = projectSheet.getRange("B5").getValue();
  Logger.log("References Review End Line: " + referencesReviewEL);
  if (!checkReviewEL(referencesReviewEL)) {
    setExecutionErrMsg("Project シートの Review End Line には、1以上の整数を入力してください。（References）");
    return execution_error;
  }

  var circuitsReviewEL = projectSheet.getRange("B6").getValue();
  Logger.log("Circuits Review End Line: " + circuitsReviewEL);
  if (!checkReviewEL(circuitsReviewEL)) {
    setExecutionErrMsg("Project シートの Review End Line には、1以上の整数を入力してください。（Circuits）");
    return execution_error;
  }

  var connectionsReviewEL = projectSheet.getRange("B7").getValue();
  Logger.log("Connections Review End Line: " + connectionsReviewEL);
  if (!checkReviewEL(connectionsReviewEL)) {
    setExecutionErrMsg("Project シートの Review End Line には、1以上の整数を入力してください。（Connections）");
    return execution_error;
  }

  var hcdeditorReviewEL = projectSheet.getRange("B8").getValue();
  Logger.log("HCDeditor Review End Line: " + hcdeditorReviewEL);
  if (!checkReviewEL(hcdeditorReviewEL)) {
    setExecutionErrMsg("Project シートの Review End Line には、1以上の整数を入力してください。（HCDeditor）");
    return execution_error;
  }

  //--------------------------------------------------------------------------------
  // 自動審査
  //--------------------------------------------------------------------------------
  var result = auto_complete;

  setting.showStatus("References を審査しています。");
  var references = new hcdReferences(referencesReviewEL);
  references.review();
  if (references.report(g_sheet_reportBIF, 14, 17) == 'NG')
    result = auto_incomplete;

  setting.showStatus("Circuits を審査しています。");
  var circuits = new hcdCircuits(circuitsReviewEL);
  circuits.review();
  if (circuits.report(g_sheet_reportBIF, 20, 23) == 'NG')
    result = auto_incomplete;

  setting.showStatus("Connections を審査しています。");
  var connections = new hcdConnections(connectionsReviewEL);
  connections.review();
  if (connections.report(g_sheet_reportBIF, 26, 29) == 'NG')
    result = auto_incomplete;

  setting.showStatus("HCDeditor(1) を審査しています。");
  var editor1 = new hcdEditor(1, hcdeditorReviewEL, setting.isEnableHCD(1));
  g_editor = editor1;
  editor1.review()
  if (editor1.report(g_sheet_reportHCD, 3, 6) == 'NG')
    result = auto_incomplete;

  setting.showStatus("HCDeditor(2) を審査しています。");
  var editor2 = new hcdEditor(2, hcdeditorReviewEL, setting.isEnableHCD(2));
  editor2.review()
  if (editor2.report(g_sheet_reportHCD, 9, 12) == 'NG')
    result = auto_incomplete;

  setting.showStatus("HCDeditor(3) を審査しています。");
  var editor3 = new hcdEditor(3, hcdeditorReviewEL, setting.isEnableHCD(3));
  editor3.review()
  if (editor3.report(g_sheet_reportHCD, 15, 18) == 'NG')
    result = auto_incomplete;

  setting.showStatus("審査を終了しました。");

  return result;
}
