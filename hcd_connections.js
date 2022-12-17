class hcdConnections
{
  constructor()
  {
    this.sheet = hcdSpreadsheet.getSheetByName('Connections');

    this.data = this.sheet.getRange("A1:AP70").getValues();
  
    this.header = this.data[0];

    this.reviewItems = [];
    this.setReviewItems();

    this.itemErrors = {};
    for (var i = 0; i < this.reviewItems.length; i++)
      this.itemErrors[this.reviewItems[i]] = "";
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
  }

  review()
  {
    for (var i = 1; i < this.data.length; i++)
    {
      var entity = new entityConnections(this.header, this.data[i], i + 1, this.reviewItems);
      //Logger.log(entity);

      // HCDファイル記録
      this.sheet.getRange(entity.row, 35 + 1).setValue(entity.items['Auto Error Codes']);  // AJ列
      this.sheet.getRange(entity.row, 35 + 6).setValue(hcd_confirmor);   // AO列
      this.sheet.getRange(entity.row, 35 + 7).setValue(today);           // AP列

      for (var j = 0; j < entity.reviewItems.length; j++)
        summaryItemErrors(entity, this.itemErrors, entity.reviewItems[j]);
    }

    for (var i = 0; i < this.reviewItems.length; i++) {
      Logger.log(this.itemErrors[this.reviewItems[i]]);

      // Report
      sheet_BIF_autheniticity.getRange(23, 4 + i).setValue(this.itemErrors[this.reviewItems[i]]);
    }
  }
}
