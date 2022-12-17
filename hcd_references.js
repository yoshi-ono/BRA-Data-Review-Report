function summaryItemErrors(entity, itemErrors, reviewItem) {
  if (entity.hasErrorNums(reviewItem)) {
    var str = Utilities.formatString("row(%s) %s", entity.row, entity.getErrorNumsString(reviewItem));
    if (itemErrors[reviewItem] != "") {
      itemErrors[reviewItem] += ";\n"
    }
    itemErrors[reviewItem] += str;
  }
}

function check_references()
{
  let referencesSheet = hcdSpreadsheet.getSheetByName('References');

  var data = referencesSheet.getRange("A1:W7").getValues();
  
  var header = data[0];

  var reviewItems = [];
  reviewItems.push('DOI');
  reviewItems.push('BibTex');
  reviewItems.push('Litterature type');
  reviewItems.push('Alternative URL');
  reviewItems.push('Contributor');
  reviewItems.push('Project ID');

  var itemErrors = {};
  for (var i = 0; i < reviewItems.length; i++)
    itemErrors[reviewItems[i]] = "";

  for (var i = 1; i < data.length; i++)
  {
    var entity = new entityReferences(header, data[i], i + 1, reviewItems);
    //Logger.log(entity);

    // HCDファイル記録
    referencesSheet.getRange(entity.row, 17).setValue(entity.items['Auto Error Codes']);  // Q列=17
    referencesSheet.getRange(entity.row, 22).setValue(hcd_confirmor);   // V列=22
    referencesSheet.getRange(entity.row, 23).setValue(today);           // W列=23

    for (var j = 0; j < entity.reviewItems.length; j++)
      summaryItemErrors(entity, itemErrors, entity.reviewItems[j]);
  }

  for (var i = 0; i < reviewItems.length; i++) {
    Logger.log(itemErrors[reviewItems[i]]);

    // Report
    sheet_BIF_autheniticity.getRange(11, 4 + i).setValue(itemErrors[reviewItems[i]]);
  }
}
