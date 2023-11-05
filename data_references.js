class dataReferences extends dataBasic
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
    this.initItemWarnings();
  }

  /**
   * オーバーライド
   */
  setResultItemName()
  {
    this.resultItemBibTex = "BibTex";
  
    super.setResultItemName();
  }

  /**
   * オーバーライド
   */
  setResultColNum()
  {
    this.colNumBibTex = this.getColNum(this.resultItemBibTex);

    super.setResultColNum();
  }

  /**
   * オーバーライド
   */
  recordResult(entity)
  {
    if (entity.BibTex != "") {
      this.sheet.getRange(entity.row, this.colNumBibTex).setValue(entity.BibTex);
    }

    super.recordResult(entity);
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityReferences(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      entity.setAutoErrorCodes(this.resultItemAutoErrorCodes);
      entity.setReviewResults(this.resultItemReviewResult, this.resultItemErrorCode1, this.resultItemErrorCode2, this.resultItemOtherErrorCodes);
      
      this.recordResult(entity);
    }
  }
}
