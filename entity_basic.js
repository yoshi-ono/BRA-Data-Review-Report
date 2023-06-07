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
    /*
    var rows = g_circuits.searchItem('Circuit ID', value.trim());
    if (rows.length == 0)
      return false;
    else
      return true;
    */
    if (!g_circuits.multisetCircuitID.has(value.trim()))
      return false;
    else
      return true;
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
        //var rows = g_circuits.searchItem('Circuit ID', id.trim());
        //if (rows.length == 0)
        if (!this.isDefinedCircuit(id))
          ret = false;
    }

    return ret;
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
   *  Auto Error Codes, Review results 記録
   *------------------------------------------------------------
   */
  setAutoErrorCodes(itemName) {
    this.autoErrorCount = 0;
    var count = 0;
    var errorsString = "";

    for (var i = 0; i < this.reviewItems.length; i++)
    {
      count = this.errorNums[this.reviewItems[i]].length;
      if (count > 0) {
        this.autoErrorCount += count;
        errorsString += ";\n" + this.getErrorIDsString(this.reviewItems[i])
      }
    }
 
    if (this.autoErrorCount > 0)
      this.items[itemName] = Utilities.formatString("%s Error(s)%s", this.autoErrorCount, errorsString);
    else
      // 0 Error(s) の場合は非表示とする。
      this.items[itemName] = "";
  }

  setReviewResults(itemName, nameEC1, nameEC2, nameOEC)
  {
    this.manualErrorCount = 0;
    this.reportManualErrorCodes = "";

    if (this.isDescribed(this.items[nameEC1])) {
      this.manualErrorCount++;
      this.reportManualErrorCodes += Utilities.formatString("row(%s) %s", this.row, this.items[nameEC1]) + "\n";
    }

    if (this.isDescribed(this.items[nameEC2])) {
      this.manualErrorCount++;
      this.reportManualErrorCodes += Utilities.formatString("row(%s) %s", this.row, this.items[nameEC2]) + "\n";
    }

    if (this.isDescribed(this.items[nameOEC])) {
      var otherEC = this.items[nameOEC];
      if (isFinite(otherEC)) {
        otherEC = String(otherEC);
      }
      var errorCodes = otherEC.split(';');
      for (var code of errorCodes) {
        if (this.isDescribed(code))
          this.manualErrorCount++;
      }
      this.reportManualErrorCodes += Utilities.formatString("row(%s) %s", this.row, otherEC) + "\n";
    }

    this.items[itemName] = this.autoErrorCount + this.manualErrorCount;
  }
}