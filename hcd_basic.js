class hcdBasic
{
  constructor(sheetName, reviewDataRows)
  {
    this.sheet = hcdSpreadsheet.getSheetByName(sheetName);
    this.reviewDataRows = reviewDataRows;

    this.allData = this.sheet.getDataRange().getValues();
    
    this.header = this.allData[0];

    this.reviewItems = [];

    this.itemErrors = {};

    this.setResultColNum();
  }

  initItemErrors()
  {
    for (var i = 0; i < this.reviewItems.length; i++)
      this.itemErrors[this.reviewItems[i]] = "";
  }

  summaryItemErrors(entity, reviewItem) {
    if (entity.hasErrorNums(reviewItem)) {
      var str = Utilities.formatString("row(%s) %s", entity.row, entity.getErrorNumsString(reviewItem));
      //Logger.log(str);

      if (this.itemErrors[reviewItem] != "") {
        this.itemErrors[reviewItem] += ";\n"
      }
      this.itemErrors[reviewItem] += str;
    }
  }

  getColNum(name)
  {
    for (var i = 0; i < this.header.length; i++)
    {
      if (this.header[i] == name)
        return i + 1;
    }

    return (-1);
  }

  setResultColNum()
  {
    this.colNumAutoErrorCodes = this.getColNum('Auto Error Codes');
    this.colNumReviewer = this.getColNum('Reviewer');
    this.colNumReviewedDate = this.getColNum('Reviewed date');
  }

  recordResult(entity)
  {
    // HCDファイル記録
    this.sheet.getRange(entity.row, this.colNumAutoErrorCodes).setValue(entity.items['Auto Error Codes']);
    this.sheet.getRange(entity.row, this.colNumReviewer).setValue(hcd_confirmor);
    this.sheet.getRange(entity.row, this.colNumReviewedDate).setValue(today);

    for (var j = 0; j < entity.reviewItems.length; j++)
      this.summaryItemErrors(entity, entity.reviewItems[j]);
  }

  report(reportRow)
  {
    for (var i = 0; i < this.reviewItems.length; i++) {
      Logger.log(this.itemErrors[this.reviewItems[i]]);

      // Report
      sheet_BIF_autheniticity.getRange(reportRow, 4 + i).setValue(this.itemErrors[this.reviewItems[i]]);
    }
  }
}