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

  var today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd");

  for (var i = 1; i < data.length; i++)
  {
    var entity = new entityReferences(header, data[i], i + 1, reviewItems);
    Logger.log(entity);

    // HCDファイル記録
    referencesSheet.getRange(entity.row, 17).setValue(entity.items['Auto Error Codes']);
    referencesSheet.getRange(entity.row, 22).setValue(hcd_confirmor);
    referencesSheet.getRange(entity.row, 23).setValue(today);

    for (var j = 0; j < entity.reviewItems.length; j++)
      summaryItemErrors(entity, itemErrors, entity.reviewItems[j]);
  }

  for (var i = 0; i < reviewItems.length; i++)
    Logger.log(itemErrors[reviewItems[i]]);

  // Report
  sheet_BIF_autheniticity.getRange("C6").setValue(today);

  sheet_BIF_autheniticity.getRange(11, 4).setValue(itemErrors['DOI']);
  sheet_BIF_autheniticity.getRange(11, 5).setValue(itemErrors['BibTex']);
  sheet_BIF_autheniticity.getRange(11, 6).setValue(itemErrors['Litterature type']);
  sheet_BIF_autheniticity.getRange(11, 7).setValue(itemErrors['Alternative URL']);
  sheet_BIF_autheniticity.getRange(11, 8).setValue(itemErrors['Contributor']);
  sheet_BIF_autheniticity.getRange(11, 9).setValue(itemErrors['Project ID']);
}
