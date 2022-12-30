class hcdReferences extends hcdBasic
{
  constructor(reviewDataRows)
  {
    super('References', reviewDataRows);
    this.setReviewItems();
    this.setResultItemName();
  }

  setReviewItems()
  {
    this.reviewItems.push('DOI');
    this.reviewItems.push('BibTex');
    this.reviewItems.push('Litterature type');
    this.reviewItems.push('Alternative URL');
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
      var entity = new entityReferences(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      this.recordResult(entity);
    }
  }
}
