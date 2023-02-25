var g_references;
var g_circuits;
var g_connections;
var g_editor;

const execution_error = "halt";
const auto_incomplete = "fail";
const auto_complete = "pass";

/**
 * 単体実行・デバッグ用関数
 */
function debug_auto_review()
{
  // HCD Data Review Tool のドキュメントID
  var toolDocId = '12Vn_rlLPOeYz-rKjRzMVVZwUxHO-UXUVSZztFC0kRDg';

  var ret = main(toolDocId);
  Logger.log(ret);
}

/**
 * Review End Line のチェック
 * （1以上の整数）
 */
function checkReviewEL(value)
{
  if (Number.isInteger(value)) {
    if (value > 0)
      return true;
  }
  return false;
}

/**
 * 実行エラーメッセージ
 */
function setExecutionErrMsg(msg)
{
  g_sheet_reportSummary.getRange("F48").setValue('Halt');

  g_sheet_reportSummary.getRange("C21").setValue(msg);
  Logger.log(msg);
}

/**
 * main関数
 * 
 * @param {string} toolDocId HCD Data Review Tool のドキュメントID
 * @return {string} 'pass', 'fail' or 'halt'
 */
function main(toolDocId)
{
  var setting = new Setting(toolDocId);

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
  g_sheet_reportSummary.getRange("C32").setValue(projectInfo[0][0]);
  g_sheet_reportSummary.getRange("C33").setValue(projectInfo[0][1]);
  g_sheet_reportSummary.getRange("C34").setValue(projectInfo[0][2]);
  g_sheet_reportSummary.getRange("C35").setValue(projectInfo[0][3]);
  g_sheet_reportSummary.getRange("C36").setValue(projectInfo[0][4]);

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
  var retCode = auto_complete;

  try {
    setting.showStatus("References を審査しています。");
    var references = new hcdReferences(referencesReviewEL);
    g_references = references;
    references.review();
    if (references.report(g_sheet_reportReferences, 3, 8, 14) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("Circuits を審査しています。");
    var circuits = new hcdCircuits(circuitsReviewEL);
    g_circuits = circuits;
    circuits.review();
    if (circuits.report(g_sheet_reportCircuits, 3, 8, 14) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("Connections を審査しています。");
    var connections = new hcdConnections(connectionsReviewEL);
    g_connections = connections;
    connections.review();
    if (connections.report(g_sheet_reportConnections, 3, 8, 14) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("HCDeditor(1) を審査しています。");
    var editor1 = new hcdEditor(1, hcdeditorReviewEL, setting.isEnableHCD(1));
    g_editor = editor1;
    editor1.review()
    if (editor1.report(g_sheet_reportHCDeditor, 4, 7, 11) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("HCDeditor(2) を審査しています。");
    var editor2 = new hcdEditor(2, hcdeditorReviewEL, setting.isEnableHCD(2));
    editor2.review()
    if (editor2.report(g_sheet_reportHCDeditor, 16, 19, 23) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("HCDeditor(3) を審査しています。");
    var editor3 = new hcdEditor(3, hcdeditorReviewEL, setting.isEnableHCD(3));
    editor3.review()
    if (editor3.report(g_sheet_reportHCDeditor, 28, 31, 35) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("審査を終了しました。");
  }
  catch (e) {
    setExecutionErrMsg(e.message);
    return execution_error;
  }

  // Overall result
  var overallResult = 'Pass';
  if (retCode == auto_incomplete)
    overallResult = 'Fail';

  g_sheet_reportSummary.getRange("F48").setValue(overallResult);

  return retCode;
}
