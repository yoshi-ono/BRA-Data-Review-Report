class hcdBasic
{
  constructor(sheetName, reviewDataRows)
  {
    // シートオブジェクト
    this.sheet = hcdSpreadsheet.getSheetByName(sheetName);

    // 審査データ行数（最終行）
    this.reviewDataRows = reviewDataRows;

    // シートの全データ
    this.allData = this.sheet.getDataRange().getValues();
    
    // ヘッダ行
    this.header = this.allData[0];

    // 審査対象項目（配列）
    this.reviewItems = [];

    // 審査結果項目
    this.resultItemAutoErrorCodes = "";
    this.resultItemReviewer = "";
    this.resultItemReviewedDate = "";

    // 審査項目別エラー（連想配列）
    this.itemErrors = {};
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
    this.colNumAutoErrorCodes = this.getColNum(this.resultItemAutoErrorCodes);
    this.colNumReviewer = this.getColNum(this.resultItemReviewer);
    this.colNumReviewedDate = this.getColNum(this.resultItemReviewedDate);
  }

  recordResult(entity)
  {
    // HCDファイル記録
    this.sheet.getRange(entity.row, this.colNumAutoErrorCodes).setValue(entity.items[this.resultItemAutoErrorCodes]);
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