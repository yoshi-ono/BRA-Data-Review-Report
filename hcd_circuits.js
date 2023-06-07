class hcdCircuits extends hcdBasic
{
  constructor(reviewDataRows)
  {
    super('Circuits', reviewDataRows);
    this.setReviewItems();
    this.setResultItemName();

    this.createMultisetCircuitID();
  }

  createMultisetCircuitID()
  {
    this.multisetCircuitID = new Map();

    var colNum = this.getColNum('Circuit ID');

    for (var i = 0; i < this.allData.length; i++)
    {
      var item = this.allData[i][colNum - 1]

      if (isFinite(item))
        item = String(item);
      else
        item = item.trim();

      if (item == "")
        continue;

      if (!this.multisetCircuitID.has(item)) {
        this.multisetCircuitID.set(item, []);
      }

      var row = i + 1;
      var rows = this.multisetCircuitID.get(item);
      rows.push(row);

      if (rows.length > 1)
        Logger.log("duplicate Circuit ID: %s (row %s)", item, this.multisetCircuitID.get(item).join(", ")); 
    }
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

    this.initItemErrors();
  }

  review()
  {
    for (var i = 1; i < this.reviewDataRows; i++)
    {
      var entity = new entityCircuits(this.header, this.allData[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      entity.setAutoErrorCodes(this.resultItemAutoErrorCodes);
      entity.setReviewResults(this.resultItemReviewResult, this.resultItemErrorCode1, this.resultItemErrorCode2, this.resultItemOtherErrorCodes);
      
      this.recordResult(entity);
    }
  }
}
