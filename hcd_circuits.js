class hcdCircuits extends hcdBasic
{
  constructor(reviewDataRows)
  {
    super('Circuits', reviewDataRows);
    this.setReviewItems();
    this.initItemErrors();
  }

  setReviewItems()
  {
    this.reviewItems.push('Circuit ID');
    this.reviewItems.push('Source of ID');
    this.reviewItems.push('Names');
    this.reviewItems.push('DHBA: graph_order');
    this.reviewItems.push('Sub-Circuits');
    this.reviewItems.push('Super Class');
    this.reviewItems.push('Uniform');
    this.reviewItems.push('Transmitter');
    this.reviewItems.push('Modulation Type');
    this.reviewItems.push('Size');
    this.reviewItems.push('Physiological Data');
    this.reviewItems.push('Contributor');
    this.reviewItems.push('Project ID');
  }

  setResultItemName()
  {
    this.resultItemAutoErrorCodes = "Auto Error Codes"
    this.resultItemReviewer = "Reviewer";
    this.resultItemReviewedDate = "Reviewed date";

    this.setResultColNum();
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityCircuits(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      this.recordResult(entity);
    }
  }
}
