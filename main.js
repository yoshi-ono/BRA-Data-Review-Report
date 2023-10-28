var g_references;
var g_circuits;
var g_connections;
var g_editor;

var g_spreadsheet_template;
const g_BRAver = "Template-v1-6.bra";
const g_publicFolderId = "1U97WQIPzSHMkaC9bMEV90gU0tWpwYUqx";

const execution_error = "halt";
const auto_incomplete = "fail";
const auto_complete = "pass";

/**
 * 単体実行・デバッグ用関数
 */
function debug_auto_review()
{
  // HCD Data Review Tool のドキュメントID
  var toolDocId = '1ADLTlVnQdL5GkBLLBRFJo_1sAWOiYx_HOmn3FfC56D0';

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
  g_sheet_reportSummary.getRange("H48").setValue('Halt');

  g_sheet_reportSummary.getRange("C21").setValue(msg);
  Logger.log("Execution errors: " + msg);
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

  // クリア
  setExecutionErrMsg("");
  g_sheet_reportSummary.getRange("E25").setValue("");

  try {
    setting.openBraSpreadSheet();
  } catch(e) {
    setExecutionErrMsg(e.message);
    return execution_error;
  }

  //--------------------------------------------------------------------------------
  // Project 情報の参照
  //--------------------------------------------------------------------------------
  var projectSheet = g_braSpreadsheet.getSheetByName("Project");
  if (projectSheet === null) {
    setExecutionErrMsg("Project シートが存在しません。");
    return execution_error;
  }

  var projectInfo = projectSheet.getRange("A2:E2").getValues();
  g_sheet_reportSummary.getRange("C32").setValue(projectInfo[0][0]);
  g_sheet_reportSummary.getRange("C33").setValue(projectInfo[0][1]);
  g_sheet_reportSummary.getRange("C34").setValue(projectInfo[0][2]);
  g_sheet_reportSummary.getRange("C35").setValue(projectInfo[0][3]);
  g_sheet_reportSummary.getRange("C36").setValue(projectInfo[0][4]);

  var bra_ver = projectSheet.getRange("F2").getValue();
  if (bra_ver.trim() != g_BRAver) {
    setExecutionErrMsg("BRA version が「" + g_BRAver + "」ではありません。");
    return execution_error;
  }

  var publicFolder = DriveApp.getFolderById(g_publicFolderId);
  var files = publicFolder.getFilesByName(g_BRAver);
  var templateURL = "";
  while (files.hasNext())
  {
    if (templateURL != "") {
      setExecutionErrMsg("Template file が複数存在します。");
      return execution_error;
    }
    var templateFile = files.next();
    templateURL = templateFile.getUrl();
    Logger.log(g_BRAver + ": " + templateURL);
  }

  try {
    g_spreadsheet_template = SpreadsheetApp.openByUrl(templateURL);
  } catch (e) {
    setExecutionErrMsg("Template file が開けません。");
    return execution_error;
  }

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

  var formulasError = "";

  try {
    // References
    setting.showStatus("References を審査しています。");
    var references = new braReferences(referencesReviewEL);
    g_references = references;
    references.review();
    if (references.report(g_sheet_reportReferences, 3, 8, 19) == 'Fail')
      retCode = auto_incomplete;
    
    var refTemplate = new Template('References');
    refTemplate.checkFormulas(references.allFormulas, referencesReviewEL);
    Logger.log(refTemplate.not_match)
    formulasError += refTemplate.getReportString();

    // Circuits
    setting.showStatus("Circuits を審査しています。");
    var circuits = new braCircuits(circuitsReviewEL);
    g_circuits = circuits;
    circuits.review();
    if (circuits.report(g_sheet_reportCircuits, 3, 8, 19) == 'Fail')
      retCode = auto_incomplete;
    
    var cirTemplate = new Template('Circuits');
    cirTemplate.checkFormulas(circuits.allFormulas, circuitsReviewEL);
    Logger.log(cirTemplate.not_match)
    formulasError += cirTemplate.getReportString();

    // Connections
    setting.showStatus("Connections を審査しています。");
    var connections = new braConnections(connectionsReviewEL);
    g_connections = connections;
    connections.review();
    if (connections.report(g_sheet_reportConnections, 3, 8, 19) == 'Fail')
      retCode = auto_incomplete;
    
    var conTemplate = new Template('Connections');
    conTemplate.checkFormulas(connections.allFormulas, connectionsReviewEL);
    Logger.log(conTemplate.not_match)
    formulasError += conTemplate.getReportString();

    // HCDeditor
    setting.showStatus("HCDeditor(1) を審査しています。");
    var editor1 = new braHcdEditor(1, hcdeditorReviewEL, setting.isEnableHCD(1));
    g_editor = editor1;
    editor1.review()
    if (editor1.report(g_sheet_reportHCDeditor, 4, 8, 16) == 'Fail')
      retCode = auto_incomplete;
    
    var hcdTemplate = new Template('HCDeditor');
    hcdTemplate.checkFormulas(editor1.allFormulas, hcdeditorReviewEL);
    Logger.log(hcdTemplate.not_match)
    formulasError += hcdTemplate.getReportString();

    setting.showStatus("HCDeditor(2) を審査しています。");
    var editor2 = new braHcdEditor(2, hcdeditorReviewEL, setting.isEnableHCD(2));
    editor2.review()
    if (editor2.report(g_sheet_reportHCDeditor, 25, 29, 37) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("HCDeditor(3) を審査しています。");
    var editor3 = new braHcdEditor(3, hcdeditorReviewEL, setting.isEnableHCD(3));
    editor3.review()
    if (editor3.report(g_sheet_reportHCDeditor, 46, 50, 58) == 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("審査を終了しました。");
  }
  catch (e) {
    setExecutionErrMsg(e.message);
    return execution_error;
  }

  if (formulasError != "") {
    g_sheet_reportSummary.getRange("E25").setValue(formulasError);
  }

  // Overall result
  var overallResult = 'Pass';
  if (retCode == auto_incomplete)
    overallResult = 'Fail';

  g_sheet_reportSummary.getRange("H48").setValue(overallResult);

  return retCode;
}
