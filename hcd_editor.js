class hcdEditor extends hcdBasic
{
  constructor(hcdNumber)
  {
    super('HCDeditor');
    this.hcdNoStr = "(" + hcdNumber + ")";
    //Logger.log("HCD Number: " + this.hcdNoStr)
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

  setResultItemName()
  {
    this.resultItemAutoErrorCodes = "Auto Error Codes " + this.hcdNoStr;
    this.resultItemReviewer = "Confirmor " + this.hcdNoStr;
    this.resultItemReviewedDate = "Confirmed date " + this.hcdNoStr;

    this.setResultColNum();
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityHCDeditor(this.header, this.allData[i], i + 1, this.reviewItems, this.hcdNoStr);
      //Logger.log(entity);

      entity.setAutoErrorCodes(this.resultItemAutoErrorCodes);

      this.recordResult(entity);
    }
  }
}
