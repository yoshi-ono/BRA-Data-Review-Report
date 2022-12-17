class hcdCircuits extends hcdBasic
{
  constructor(reviewLastRow)
  {
    super('Circuits', reviewLastRow);
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
}
