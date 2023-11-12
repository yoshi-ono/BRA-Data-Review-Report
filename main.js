const execution_error = "halt";
const auto_incomplete = "fail";
const auto_complete = "pass";

var g_spreadsheet_template;
const g_BRAver = "Template-v1-7.bra";
const g_publicFolderId = "1U97WQIPzSHMkaC9bMEV90gU0tWpwYUqx";

/**
 * 単体実行・デバッグ用関数
 */
function debug_auto_review()
{
  // BRA Data Review Tool のドキュメントID
  var toolDocId = '1-2_cZSlQu_rDhhJ_8MtrkJb_6Hd4j7pQZHtW8KNqm7c';

  var ret = main(toolDocId);
  Logger.log(ret);
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

  // BRA Data
  var bra_id = g_sheet_reportSummary.getRange('C9').getValue();
  Logger.log(bra_id);
  if (bra_id.trim() == "") {
    setExecutionErrMsg("Step.1 Please enter the file ID.");
    return execution_error;
  }

  g_bra_data = new braData(bra_id);

  setting.showStatus("Opening BRA Data file. (This process may take some time)")

  try {
    g_bra_data.openBraSpreadSheet();
  } catch(e) {
    setExecutionErrMsg(e.message);
    return execution_error;
  }

  setting.showStatus("Opened the BRA Data file.")

  //--------------------------------------------------------------------------------
  // Project 情報の参照
  //--------------------------------------------------------------------------------
  g_sheet_reportSummary.getRange("C32").setValue(g_bra_data.Contributor);
  g_sheet_reportSummary.getRange("C33").setValue(g_bra_data.ProjectID);
  g_sheet_reportSummary.getRange("C34").setValue(g_bra_data.NumberOfHCDs);
  g_sheet_reportSummary.getRange("C35").setValue(g_bra_data.ListOfContributors);
  g_sheet_reportSummary.getRange("C36").setValue(g_bra_data.Description);

  var bra_ver = g_bra_data.BRAVersion;
  g_sheet_reportSummary.getRange("C37").setValue(bra_ver);

  if (bra_ver.trim() !== g_BRAver) {
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

  var hyperlink = Utilities.formatString('=HYPERLINK("%s", "%s")', templateURL, g_BRAver);
  g_sheet_reportSummary.getRange("H37").setFormula(hyperlink)

  try {
    g_spreadsheet_template = SpreadsheetApp.openByUrl(templateURL);
  } catch (e) {
    setExecutionErrMsg("Template file が開けません。");
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
    if (g_bra_data.reviewReferences() === 'Fail')
      retCode = auto_incomplete;
    
    var refTemplate = new Template('References');
    refTemplate.checkFormulas(g_bra_data.references.allFormulas, g_bra_data.referencesReviewEL);
    Logger.log(refTemplate.not_match)
    formulasError += refTemplate.getReportString();

    // Circuits
    setting.showStatus("Circuits を審査しています。");
    if (g_bra_data.reviewCircuits() === 'Fail')
      retCode = auto_incomplete;

    var cirTemplate = new Template('Circuits');
    cirTemplate.checkFormulas(g_bra_data.circuits.allFormulas, g_bra_data.circuitsReviewEL);
    Logger.log(cirTemplate.not_match)
    formulasError += cirTemplate.getReportString();

    // Connections
    setting.showStatus("Connections を審査しています。");
    if (g_bra_data.reviewConnections() === 'Fail')
      retCode = auto_incomplete;

    var conTemplate = new Template('Connections');
    conTemplate.checkFormulas(g_bra_data.connections.allFormulas, g_bra_data.connectionsReviewEL);
    Logger.log(conTemplate.not_match)
    formulasError += conTemplate.getReportString();

    // HCDeditor
    setting.showStatus("HCDeditor(1) を審査しています。");
    if (g_bra_data.reviewHcdEditor(1) === 'Fail')
      retCode = auto_incomplete;

    var hcdTemplate = new Template('HCDeditor');
    hcdTemplate.checkFormulas(g_bra_data.hcd_editor_anyone.allFormulas, g_bra_data.hcdeditorReviewEL);
    Logger.log(hcdTemplate.not_match)
    formulasError += hcdTemplate.getReportString();

    setting.showStatus("HCDeditor(2) を審査しています。");
    if (g_bra_data.reviewHcdEditor(2) === 'Fail')
      retCode = auto_incomplete;

    setting.showStatus("HCDeditor(3) を審査しています。");
    if (g_bra_data.reviewHcdEditor(3) === 'Fail')
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
