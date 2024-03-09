class braData
{
  constructor(doc_id)
  {
    this.braDocId = doc_id;
  }

  get Contributor() { return this.sheetProject.getRange("A2").getValue(); }
  get ProjectID() { return this.sheetProject.getRange("B2").getValue(); }
  get NumberOfHCDs() { return this.sheetProject.getRange("C2").getValue(); }
  get ListOfContributors() { return this.sheetProject.getRange("D2").getValue(); }
  get Description() { return this.sheetProject.getRange("E2").getValue(); }
  get BRAVersion() { return this.sheetProject.getRange("F2").getValue(); }

  //get hcd_editor_anyone() { return this.hcd_editor[1]; }

  openBraSpreadSheet()
  {
    try {
      this.braSpreadsheet = SpreadsheetApp.openById(this.braDocId);
    } catch (e) {
      throw new Error("Step.1 Unable to open BRA Data with file ID.");
    }

    this.sheetProject = this.getSheet("Project");
    this.readReviewEndLine();
/*
    var sheetHCDs = this.getSheet('HCDs');
    this.hcdNames = {};
    this.hcdNames[1] = sheetHCDs.getRange("B2").getValue().trim();
    this.hcdNames[2] = sheetHCDs.getRange("B3").getValue().trim();
    this.hcdNames[3] = sheetHCDs.getRange("B4").getValue().trim();
    Logger.log(this.hcdNames);
*/
    this.listItems = new ListItems();
    Logger.log(this.listItems);

    // Data (Sheet)
    this.references = null;
    this.circuits = null;
    this.connections = null;
    //this.hcd_editor = {};
    this.frg = null;
  }

  readReviewEndLine()
  {
    this.referencesReviewEL = this.sheetProject.getRange("B5").getValue();
    Logger.log("References Review End Line: " + this.referencesReviewEL);
    if (!this.checkReviewEL(this.referencesReviewEL)) {
      throw new Error("Project シートの Review End Line には、1以上の整数を入力してください。（References）");
    }

    this.circuitsReviewEL = this.sheetProject.getRange("B6").getValue();
    Logger.log("Circuits Review End Line: " + this.circuitsReviewEL);
    if (!this.checkReviewEL(this.circuitsReviewEL)) {
      throw new Error("Project シートの Review End Line には、1以上の整数を入力してください。（Circuits）");
    }

    this.connectionsReviewEL = this.sheetProject.getRange("B7").getValue();
    Logger.log("Connections Review End Line: " + this.connectionsReviewEL);
    if (!this.checkReviewEL(this.connectionsReviewEL)) {
      throw new Error("Project シートの Review End Line には、1以上の整数を入力してください。（Connections）");
    }
/*
    this.hcdeditorReviewEL = this.sheetProject.getRange("B8").getValue();
    Logger.log("HCDeditor Review End Line: " + this.hcdeditorReviewEL);
    if (!this.checkReviewEL(this.hcdeditorReviewEL)) {
      throw new Error("Project シートの Review End Line には、1以上の整数を入力してください。（HCDeditor）");
   }
*/
    this.frgReviewEL = this.sheetProject.getRange("B8").getValue();
    Logger.log("FRG Review End Line: " + this.frgReviewEL);
    if (!this.checkReviewEL(this.frgReviewEL)) {
      throw new Error("Project シートの Review End Line には、1以上の整数を入力してください。（FRG）");
   }
  }

  /**
   * Review End Line のチェック
   * （1以上の整数）
   */
  checkReviewEL(value)
  {
    if (Number.isInteger(value)) {
      if (value > 0)
        return true;
    }
    return false;
  }
/*
  isEnableHCD(hcdNumber)
  {
    if (this.hcdNames[hcdNumber] == "")
      return false;
    else
      return true;
  }
*/
  getSheet(sheetName)
  {
    return this.braSpreadsheet.getSheetByName(sheetName);
  }

  //--------------------------------------------------------------------------------
  // 自動審査
  //--------------------------------------------------------------------------------
  reviewReferences()
  {
    this.references = new dataReferences(this.referencesReviewEL);
    this.references.review();
    return this.references.report(g_sheet_reportReferences, 3, 8, 13, 19, 24);
  }

  reviewCircuits()
  {
    this.circuits = new dataCircuits(this.circuitsReviewEL);
    this.circuits.review();
    return this.circuits.report(g_sheet_reportCircuits, 3, 8, 13, 19, 24);
  }

  reviewConnections()
  {
    this.connections = new dataConnections(this.connectionsReviewEL);
    this.connections.review();
    return this.connections.report(g_sheet_reportConnections, 3, 8, 13, 19, 24);
  }
/*
  reviewHcdEditor(hcdNumber)
  {
    this.hcd_editor[hcdNumber] = new dataHcdEditor(hcdNumber, this.hcdeditorReviewEL, this.isEnableHCD(hcdNumber));
    this.hcd_editor[hcdNumber].review();
    switch (hcdNumber) {
      case 1:
        return this.hcd_editor[hcdNumber].report(g_sheet_reportHCDeditor, 4, 8, 12, 16, 20);
        break;
      case 2:
        return this.hcd_editor[hcdNumber].report(g_sheet_reportHCDeditor, 25, 29, 33, 37, 41);
        break;
      case 3:
        return this.hcd_editor[hcdNumber].report(g_sheet_reportHCDeditor, 46, 50, 54, 58, 62);
        break;
    }
  }
*/
  reviewFRG()
  {
    this.frg = new dataFRG(this.frgReviewEL);
    this.frg.review();
    return this.frg.report(g_sheet_reportFRG, 3, 8, 13, 19, 24);
  }
}