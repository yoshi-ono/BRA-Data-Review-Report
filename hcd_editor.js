class hcdEditor extends hcdBasic
{
  constructor(reviewDataRows)
  {
    super('HCDeditor', reviewDataRows);
    this.setReviewItems();
    this.initItemErrors();
  }

  setReviewItems()
  {
    this.reviewItems.push('Circuit ID');
    this.reviewItems.push('Component Label (1)');
    this.reviewItems.push('Output Circuits (1)');
    this.reviewItems.push('Output Circuit Validation (1)');
    this.reviewItems.push('Input Circuit (1)');
    this.reviewItems.push('Region Category (1)');
    this.reviewItems.push('Process (1)');
    this.reviewItems.push('Output semantics (1)');
  }

  setResultItemName()
  {
    this.resultItemAutoErrorCodes = "Auto Error Codes (1)"
    this.resultItemReviewer = "Confirmor (1)";
    this.resultItemReviewedDate = "Confirmed date (1)";

    this.setResultColNum();
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityHCDeditor(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      this.recordResult(entity);
    }
  }
}
