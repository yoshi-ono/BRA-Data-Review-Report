class hcdConnections extends hcdBasic
{
  constructor(reviewDataRows)
  {
    super('Connections', reviewDataRows);
    this.setReviewItems();
    this.setResultItemName();
  }

  setReviewItems()
  {
    this.reviewItems.push('Sender Circuit ID (sCID)');
    this.reviewItems.push('sCID relation');
    this.reviewItems.push('Notation of sCID in Literature');
    this.reviewItems.push('Receiver Circuit ID (rCID)');
    this.reviewItems.push('rCID relation');
    this.reviewItems.push('Notation of rCID in Literature');
    this.reviewItems.push('Size');
    this.reviewItems.push('Reference ID');
    this.reviewItems.push('Taxon');
    this.reviewItems.push('Measurement method');
    this.reviewItems.push('Pointers on literature');
    this.reviewItems.push('Pointers on figure');
    this.reviewItems.push('In-depth literature');
    this.reviewItems.push('Contributor');
    this.reviewItems.push('Project ID');

    this.initItemErrors();
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
      var entity = new entityConnections(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      this.recordResult(entity);
    }
  }
}
