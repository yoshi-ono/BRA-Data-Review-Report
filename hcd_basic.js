class hcdBasic
{
  constructor(sheetName, reviewDataRows)
  {
    // シートオブジェクト
    this.sheet = hcdSpreadsheet.getSheetByName(sheetName);
    // シートの全データ
    this.allData = this.sheet.getDataRange().getValues();

    // 審査データ行数（最終行）
    if (reviewDataRows == null)
      this.reviewDataRows = this.allData.length;
    else
      this.reviewDataRows = reviewDataRows;
    
    // ヘッダ行
    this.header = this.allData[0];

    // 審査対象項目（配列）
    this.reviewItems = [];

    // 審査結果項目
    this.resultItemAutoErrorCodes = "";
    this.resultItemReviewer = "";
    this.resultItemReviewedDate = "";

    // 審査項目別エラー（連想配列 + 連想配列{Codes, Count}）
    this.itemErrors = {};
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
      if (item.trim() == value)
        rows.push(i + 1);
    }

    return rows;
  }

  /*
   *------------------------------------------------------------
   *  審査結果記録
   *------------------------------------------------------------
   */
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
   * @return 'Good' or 'NG' 
   */
  getResult()
  {
    for (var item in this.itemErrors) {
      if (this.itemErrors[item]['Count'] > 0)
        return 'NG';
    }

    return 'Good';
  }

  report(reportSheet, rowResult, rowErrorCodes)
  {
    for (var i = 0; i < this.reviewItems.length; i++) {
      reportSheet.getRange(rowErrorCodes, 4 + i).setValue(this.itemErrors[this.reviewItems[i]]['Codes']);
      reportSheet.getRange(rowErrorCodes + 1, 4 + i).setValue(this.itemErrors[this.reviewItems[i]]['Count']);

      //Logger.log("[" + this.sheet.getName() + " " + this.reviewItems[i] + "]: " + this.itemErrors[this.reviewItems[i]]);
    }

    var result = this.getResult();
    reportSheet.getRange(rowResult, 3).setValue(result);

    return result;
  }
}