class dataFRG extends dataBasic
{
  constructor(reviewDataRows)
  {
    super('FRG', reviewDataRows);
    this.setReviewItems();
    this.setResultItemName();
  }

  setReviewItems()
  {
    this.reviewItems.push('Node ID');
    this.reviewItems.push('Sub Nodes');
    this.reviewItems.push('Circuit ID');
    this.reviewItems.push('Projected Circuits');

    this.reviewItems.push('Capability Realization by Implementation (LLM)');
    this.reviewItems.push('Capability Realization by Implementation');

    this.reviewItems.push('Capability');

    this.reviewItems.push('Capability Synthesis (LLM)');
    this.reviewItems.push('Capability Synthesis');

    this.reviewItems.push('Requirements Realization by Interface (LLM)');
    this.reviewItems.push('Requirements Realization by Interface');

    this.reviewItems.push('Requirements Endorsement by Capability (LLM)');
    this.reviewItems.push('Requirements Endorsement by Capability');

    this.reviewItems.push('Requirements');

    this.reviewItems.push('Requirements Synthesis (LLM)');
    this.reviewItems.push('Requirements Synthesis');

    this.reviewItems.push('Semantics');

    this.initItemErrors();
    this.initItemWarnings();
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityFRG(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      entity.setAutoErrorCodes(this.resultItemAutoErrorCodes);
      entity.setReviewResults(this.resultItemReviewResult, this.resultItemErrorCode1, this.resultItemErrorCode2, this.resultItemOtherErrorCodes);
      
      this.recordResult(entity);
    }
  }
}
