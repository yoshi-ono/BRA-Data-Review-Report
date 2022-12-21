/*
 *  基本エンティティ クラス
 */
class entityBasic
{
  constructor(header, data, row, reviewItems)
  {
    // データの項目名と内容
    this.items = {};
    for (var i = 0; i < header.length; i++) {
      this.items[header[i].trim()] = data[i];
    }

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
    if (item === '')
      return false;
    else
      return true;
  }

  check_Contributor(errorNum1, errorNum2) {
    // Contributorが記述されていない。
    if (!this.isDescribed(this.items['Contributor'])) {
      this.errorNums['Contributor'].push(errorNum1);
    } else {
      // Contributorがtext形式で記述されていない。
    }
  }
  
  check_Project_ID(errorNum1, errorNum2) {
    // Project IDが記述されていない。
    if (!this.isDescribed(this.items['Project ID'])) {
      this.errorNums['Project ID'].push(errorNum1);
    } else {
      // Project IDがtext形式で記述されていない。
    }
  }

  /*
   *------------------------------------------------------------
   *  項目のエラー情報取得
   *------------------------------------------------------------
   */
  hasErrorNums(reviewItem) {
    if (this.errorNums[reviewItem].length > 0)
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
   *  Auto Error Codes 記録
   *------------------------------------------------------------
   */
  setAutoErrorCodes() {
    var allCount = 0;
    var count = 0;
    var errorsString = "";

    for (var i = 0; i < this.reviewItems.length; i++)
    {
      count = this.errorNums[this.reviewItems[i]].length;
      if (count > 0) {
        allCount += count;
        errorsString += ";\n" + this.getErrorIDsString(this.reviewItems[i])
      }
    }
 
    if (allCount > 0)
      this.items['Auto Error Codes'] = Utilities.formatString("%s Error(s)%s", allCount, errorsString);
    else
      // 0 Error(s) の場合は非表示とする。
      this.items['Auto Error Codes'] = "";
  }

}