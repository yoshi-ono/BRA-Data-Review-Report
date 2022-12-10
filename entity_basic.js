class entityBasic
{
  constructor(header, data, row)
  {
    this.items = {};
    for (var i = 0; i < header.length; i++) {
      this.items[header[i].trim()] = data[i];
    }

    this.row = row;

    this.reviewItems = [];
    this.errorNums = {};
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

  /*
   *------------------------------------------------------------
   *  エラー情報
   *------------------------------------------------------------
   */
  hasErrorNums(reviewItem) {
    if (this.errorNums[reviewItem].length > 0)
      return true;
    else
      return false;
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
   *  エラー記録
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
 
    this.items['Auto Error Codes'] = Utilities.formatString("%s Error(s)%s", allCount, errorsString);
  }

}