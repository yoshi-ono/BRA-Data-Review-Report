class braBasic
{
  constructor(sheetName, reviewDataRows)
  {
    // シートオブジェクト
    this.sheet = g_braSpreadsheet.getSheetByName(sheetName);
    // シートの全データ
    /*
    var lastColumn = this.sheet.getLastColumn();
    var lastRow = this.sheet.getLastRow();
    var dataRange = this.sheet.getRange(1, 1, lastColumn, lastRow);
    */
    var dataRange = this.sheet.getDataRange();
    this.allData = dataRange.getValues();
    this.allFormulas = dataRange.getFormulas();

    // 審査データ行数（最終行）
    if (reviewDataRows == null)
      this.reviewDataRows = this.allData.length;
    else
      this.reviewDataRows = reviewDataRows;

    // マニュアル審査完了数
    this.manualReviewed = 0;
    
    // ヘッダ行
    this.header = this.allData[0];

    // 審査対象項目（配列）
    this.reviewItems = [];

    // 審査項目別エラー（連想配列 + 連想配列{Codes, Count}）
    this.itemErrors = {};

    // マニュアル審査エラー（連想配列{Codes, Count}）
    this.manualErrors = {'Codes':"", 'Count':0};
  }

  getColNum(name)
  {
    var col = (-1);

    for (var i = 0; i < this.header.length; i++)
    {
      if (this.header[i].trim() == name)
        col = i + 1;
    }

    return col;
  }

  /**
   * アイテムを検索する。
   * @param {string} name - 項目名
   * @param {string} value - 値
   * @return {number[]} 値が一致した行番号（配列） 
   */
  searchItem(name, value)
  {
    var rows = [];
    var colNum = this.getColNum(name);

    for (var i = 0; i < this.allData.length; i++)
    {
      var item = this.allData[i][colNum - 1]

      if (isFinite(item))
        item = String(item);

      if (item.trim() == value)
        rows.push(i + 1);
    }

    return rows;
  }

  getRowItemValue(row, item)
  {
    var colNum = this.getColNum(item);
    return this.allData[row - 1][colNum - 1];
  }

  /*
   *------------------------------------------------------------
   *  審査結果記録
   *------------------------------------------------------------
   */
  setResultItemName()
  {
    this.resultItemReviewResult = "Review results";
    this.resultItemAutoErrorCodes = "Auto Error Codes"
    this.resultItemErrorCode1 = "Error Code-1";
    this.resultItemErrorCode2 = "Error Code-2";
    this.resultItemOtherErrorCodes = "Other Error Codes";
    this.resultItemReviewComments = "Review comments";
    this.resultItemReviewer = "Reviewer";
    this.resultItemReviewedDate = "Reviewed date";

    this.setResultColNum();
  }

  setResultColNum()
  {
    this.colNumReviewResult = this.getColNum(this.resultItemReviewResult);
    this.colNumAutoErrorCodes = this.getColNum(this.resultItemAutoErrorCodes);
    this.colNumErrorCode1 = this.getColNum(this.resultItemErrorCode1);
    this.colNumErrorCode2 = this.getColNum(this.resultItemErrorCode2);
    this.colNumOtherErrorCodes = this.getColNum(this.resultItemOtherErrorCodes);
    this.colNumReviewComments = this.getColNum(this.resultItemReviewComments);
    this.colNumReviewer = this.getColNum(this.resultItemReviewer);
    this.colNumReviewedDate = this.getColNum(this.resultItemReviewedDate);
  }

  recordResult(entity)
  {
    // HCDファイル記録
    this.sheet.getRange(entity.row, this.colNumReviewResult).setValue(entity.items[this.resultItemReviewResult]);
    this.sheet.getRange(entity.row, this.colNumAutoErrorCodes).setValue(entity.items[this.resultItemAutoErrorCodes]);
    //this.sheet.getRange(entity.row, this.colNumReviewer).setValue(hcd_confirmor);
    //this.sheet.getRange(entity.row, this.colNumReviewedDate).setValue(today);

    // レポート用サマライズ
    for (var j = 0; j < entity.reviewItems.length; j++)
      this.summaryItemErrors(entity, entity.reviewItems[j]);

    this.manualErrors['Codes'] += entity.reportManualErrorCodes;
    this.manualErrors['Count'] += entity.manualErrorCount;
  }

  /*
   *------------------------------------------------------------
   *  レポート（審査項目別エラー）
   *------------------------------------------------------------
   */
  initItemErrors()
  {
    for (var i = 0; i < this.reviewItems.length; i++)
      this.itemErrors[this.reviewItems[i]] = {'Codes':"", 'Count':0};
  }

  summaryItemErrors(entity, reviewItem)
  {
    if (entity.hasErrorNums(reviewItem)) {
      var str = Utilities.formatString("row(%s) %s", entity.row, entity.getErrorNumsString(reviewItem));
      //Logger.log(str);

      if (this.itemErrors[reviewItem]['Codes'] != "") {
        this.itemErrors[reviewItem]['Codes'] += ";\n"
      }
      this.itemErrors[reviewItem]['Codes'] += str;

      this.itemErrors[reviewItem]['Count'] += entity.getErrorCount(reviewItem);
    }
  }

  /**
   * @return 'Pass' or 'Fail'
   */
  getResult()
  {
    for (var item in this.itemErrors) {
      if (this.itemErrors[item]['Count'] > 0)
        return 'Fail';
    }

    if (this.manualErrors['Count'] > 0)
      return 'Fail';

    return 'Pass';
  }

  report(reportSheet, rowResult, rowAutoErrorCodes, rowManualErrorCodes)
  {
    // Auto-review results
    for (var i = 0; i < this.reviewItems.length; i++) {
      reportSheet.getRange(rowAutoErrorCodes, 3 + i).setValue(this.itemErrors[this.reviewItems[i]]['Codes']);
      reportSheet.getRange(rowAutoErrorCodes + 1, 3 + i).setValue(this.itemErrors[this.reviewItems[i]]['Count']);

      //Logger.log("[" + this.sheet.getName() + " " + this.reviewItems[i] + "]: " + this.itemErrors[this.reviewItems[i]]);
    }

    // Manual-review results
    reportSheet.getRange(rowManualErrorCodes, 3).setValue(this.manualErrors['Codes']);
    reportSheet.getRange(rowManualErrorCodes + 1, 3).setValue(this.manualErrors['Count']);
    //Logger.log(this.manualErrors);

    // Results
    var result = this.getResult();
    reportSheet.getRange(rowResult, 2).setValue(result);

    return result;
  }
}
