/*
 *  基本エンティティ クラス
 */
class entityBasic
{
  constructor(header, data, row, reviewItems)
  {
    // データの項目名と内容（連想配列）
    this.items = {};
    for (var i = 0; i < header.length; i++) {
      this.items[header[i].trim()] = data[i];
    }
    //Logger.log(this.items);

    // スプレッドシート行番号
    this.row = row;

    // 審査対象項目（配列）
    this.reviewItems = reviewItems;

    // エラーデータの項目名とエラーナンバー
    this.errorNums = {};

    for (var i = 0; i < this.reviewItems.length; i++)
      this.errorNums[this.reviewItems[i]] = [];

    // ワーニングデータの項目名とエラーナンバー
    this.warningNums = {};

    for (var i = 0; i < this.reviewItems.length; i++)
      this.warningNums[this.reviewItems[i]] = [];
  }

  /*
   *------------------------------------------------------------
   *  共通エラーチェック
   *------------------------------------------------------------
   */
  isDescribed(item)
  {
    var val = item;
    if (isFinite(val))
      val = String(val);

    if (val.trim() === '')
      return false;
    else
      return true;
  }

  isTRUE(item)
  {
    if (item === true)
      return true;
    else
      return false;
  }

  isFALSE(item)
  {
    if (item === false)
      return true;
    else
      return false;
  }

  isURL(item)
  {
    if (isFinite(item))
      return false;
    
    if (item.startsWith("http://") || item.startsWith("https://"))
      return true;
    else
      return false;
  }

  isDefinedCircuit(value)
  {
    var rows = g_bra_data.circuits.searchItem('Circuit ID', value.trim());
    if (rows.length == 0)
      return false;
    else
      return true;
/*
    if (!g_bra_data.circuits.multisetCircuitID.has(value.trim()))
      return false;
    else
      return true;
*/
  }

  isDefinedCircuits(values)
  {
    var ret = true;

    var circuits = values;
    if (isFinite(circuits)) {
      circuits = String(circuits);
    }
    var idList = circuits.split(';');
    for (var id of idList) {
      if (this.isDescribed(id))
        if (!this.isDefinedCircuit(id))
          ret = false;
    }

    return ret;
  }

  /**
   * 列挙値の終端が";"であるかどうか。
   */
  hasTerminalSymbol(values)
  {
    var items = values;
    if (isFinite(items)) {
      items = String(items);
    }
    var str = items.trim();
    return str.endsWith(';');
  }

  check_Contributor(errorNum1) {
    // Contributorが記述されていない。
    if (!this.isDescribed(this.items['Contributor'])) {
      this.errorNums['Contributor'].push(errorNum1);
    }
  }
  
  check_Project_ID(errorNum1) {
    // Project IDが記述されていない。
    if (!this.isDescribed(this.items['Project ID'])) {
      this.errorNums['Project ID'].push(errorNum1);
    }
  }

  /*
   *------------------------------------------------------------
   *  項目のエラー情報取得
   *------------------------------------------------------------
   */
  getErrorCount(reviewItem) {
    return this.errorNums[reviewItem].length;
  }

  hasErrorNums(reviewItem) {
    if (this.getErrorCount(reviewItem) > 0)
      return true;
    else
      return false;
  }

  getErrorNumsString(reviewItem) {
    return this.errorNums[reviewItem].join();
  }

  getErrorIDsString(reviewItem) {
    var errorId = [];
    for (var i = 0; i < this.errorNums[reviewItem].length; i++) {
      errorId.push(Utilities.formatString("[%s:%s]", this.errorNums[reviewItem][i], reviewItem));
    }
    return errorId.join();
  }

  /*
   *------------------------------------------------------------
   *  項目のワーニング情報取得
   *------------------------------------------------------------
   */
  getWarningCount(reviewItem) {
    return this.warningNums[reviewItem].length;
  }

  hasWarningNums(reviewItem) {
    if (this.getWarningCount(reviewItem) > 0)
      return true;
    else
      return false;
  }

  getWarningNumsString(reviewItem) {
    return this.warningNums[reviewItem].join();
  }

  getWarningIDsString(reviewItem) {
    var warningId = [];
    for (var i = 0; i < this.warningNums[reviewItem].length; i++) {
      warningId.push(Utilities.formatString("[%s:%s]", this.warningNums[reviewItem][i], reviewItem));
    }
    return warningId.join();
  }

  /*
   *------------------------------------------------------------
   *  Auto Error Codes, Review results 記録
   *------------------------------------------------------------
   */
  setAutoErrorCodes(itemName)
  {
    this.autoErrorCount = 0;
    this.autoWarningCount = 0;
    var eCount = 0;
    var wCount = 0;
    var errorsString = "";
    var warningsString = "";

    for (var i = 0; i < this.reviewItems.length; i++)
    {
      eCount = this.errorNums[this.reviewItems[i]].length;
      if (eCount > 0) {
        this.autoErrorCount += eCount;
        errorsString += this.getErrorIDsString(this.reviewItems[i]) + ";\n";
      }

      wCount = this.warningNums[this.reviewItems[i]].length;
      if (wCount > 0) {
        this.autoWarningCount += wCount;
        warningsString += this.getWarningIDsString(this.reviewItems[i]) + ";\n";
      }
    }
 
    // 0 Error(s)/Warning(s) の場合は非表示とする。
    this.items[itemName] = "";
 
    if (this.autoErrorCount > 0) {
      this.items[itemName] += Utilities.formatString("%s Error(s);\n%s", this.autoErrorCount, errorsString);
    }

    if (this.autoWarningCount > 0) {
      this.items[itemName] += Utilities.formatString("%s Warning(s);\n%s", this.autoWarningCount, warningsString);
    }
  }

  setManualCount(code)
  {
    if (g_bra_data.listItems.isManualWarning(code)) {
      this.manualWarningCount++;
      this.reportManualWarningCodes += Utilities.formatString("row(%s) %s;\n", this.row, code);
    } else {
      this.manualErrorCount++;
      this.reportManualErrorCodes += Utilities.formatString("row(%s) %s;\n", this.row, code);
    }
  }

  setReviewResults(itemName, nameEC1, nameEC2, nameOEC)
  {
    this.manualErrorCount = 0;
    this.manualWarningCount = 0;
    this.reportManualErrorCodes = "";
    this.reportManualWarningCodes = "";

    if (this.isDescribed(this.items[nameEC1])) {
      this.setManualCount(this.items[nameEC1]);
    }

    if (this.isDescribed(this.items[nameEC2])) {
      this.setManualCount(this.items[nameEC2]);
    }

    if (this.isDescribed(this.items[nameOEC])) {
      var otherEC = this.items[nameOEC];
      if (isFinite(otherEC)) {
        otherEC = String(otherEC);
      }
      var errorCodes = otherEC.split(';');
      for (var code of errorCodes) {
        if (this.isDescribed(code))
          this.setManualCount(code);
      }
    }

    // Review results 更新
    this.items[itemName] = "";
    if (this.autoErrorCount > 0 || this.manualErrorCount > 0) {
      this.items[itemName] += Utilities.formatString("Error: %s;\n", this.autoErrorCount + this.manualErrorCount);
    }

    if (this.autoWarningCount > 0 || this.manualWarningCount > 0) {
      this.items[itemName] += Utilities.formatString("Warning: %s;\n", this.autoWarningCount + this.manualWarningCount);
    }

    if (this.items[itemName] == "") {
      this.items[itemName] = 0;
    }
  }
}