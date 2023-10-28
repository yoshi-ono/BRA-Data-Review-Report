class hcdEditor extends braBasic
{
  constructor(hcdNumber, reviewDataRows, enable)
  {
    var rows = reviewDataRows;
    if (!enable)
      rows = 1;

    super('HCDeditor', rows);

    this.hcdNoStr = "(" + hcdNumber + ")";
    //Logger.log("HCD Number: " + this.hcdNoStr)
    this.enable = enable;
    
    this.setReviewItems();
    this.setResultItemName();
  }

  setReviewItems()
  {
    this.reviewItems.push('Circuit ID');
    this.reviewItems.push('Component Label ' + this.hcdNoStr);
    this.reviewItems.push('Output Circuits ' + this.hcdNoStr);
    this.reviewItems.push('Output Circuit Validation ' + this.hcdNoStr);
    this.reviewItems.push('Input Circuit ' + this.hcdNoStr);
    this.reviewItems.push('Region Category ' + this.hcdNoStr);
    this.reviewItems.push('Process' + this.hcdNoStr);
    this.reviewItems.push('Output Semantics ' + this.hcdNoStr);

    this.initItemErrors();
  }

  /**
   * オーバーライド
   */
  setResultItemName()
  {
    this.resultItemReviewResult = "Review results " + this.hcdNoStr;
    this.resultItemAutoErrorCodes = "Auto Error Codes " + this.hcdNoStr;
    this.resultItemErrorCode1 = "Error Code-1 " + this.hcdNoStr;
    this.resultItemErrorCode2 = "Error Code-2 " + this.hcdNoStr;
    this.resultItemOtherErrorCodes = "Other Error Codes " + this.hcdNoStr;
    this.resultItemReviewComments = "Review comments " + this.hcdNoStr;
    this.resultItemReviewer = "Reviewer " + this.hcdNoStr;
    this.resultItemReviewedDate = "Reviewed date " + this.hcdNoStr;

    this.setResultColNum();
  }

  /**
   * オーバーライド
   * @return 'Pass', 'Fail' or 'Not used'
   */
  getResult()
  {
    if (!this.enable)
      return 'Not used';

    return super.getResult();
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityHCDeditor(this.header, this.allData[i], i + 1, this.reviewItems, this.hcdNoStr);
      //Logger.log(entity);

      entity.setAutoErrorCodes(this.resultItemAutoErrorCodes);
      entity.setReviewResults(this.resultItemReviewResult, this.resultItemErrorCode1, this.resultItemErrorCode2, this.resultItemOtherErrorCodes);

      this.recordResult(entity);
    }
  }
}
