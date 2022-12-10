var listItems;

function summaryItemErrors(entity, itemErrors, reviewItem) {
  if (entity.hasErrorNums(reviewItem)) {
    var str = Utilities.formatString("row(%s) %s", entity.row, entity.getErrorIDsString(reviewItem));
    if (itemErrors[reviewItem] != "") {
      itemErrors[reviewItem] += ";\n"
    }
    itemErrors[reviewItem] += str;
  }
}

function check_references() {
  setting()

  listItems = new ListItems();
  Logger.log(listItems);

  let hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);
  let referencesSheet = hcdSpreadsheet.getSheetByName('References');

  var data = referencesSheet.getRange("A1:W7").getValues();
  
  var header = data[0];

  var itemErrors = {};
  itemErrors['DOI'] = "";
  itemErrors['BibTex'] = "";
  itemErrors['Litterature type'] = "";
  itemErrors['Alternative URL'] = "";
  itemErrors['Contributor'] = "";
  itemErrors['Project ID'] = "";

  var today = Utilities.formatDate(new Date(), 'JST', "yyyy/MM/dd");

  for (var i = 1; i < data.length; i++)
  {
    var entity = new entityReferences(header, data[i], i + 1);
    Logger.log(entity);

    // 記録
    referencesSheet.getRange(entity.row, 17).setValue(entity.items['Auto Error Codes']);
    referencesSheet.getRange(entity.row, 22).setValue(hcd_confirmor);
    referencesSheet.getRange(entity.row, 23).setValue(today);

    summaryItemErrors(entity, itemErrors, 'DOI');
    summaryItemErrors(entity, itemErrors, 'BibTex');
    summaryItemErrors(entity, itemErrors, 'Litterature type');
    summaryItemErrors(entity, itemErrors, 'Alternative URL');
    summaryItemErrors(entity, itemErrors, 'Contributor');
    summaryItemErrors(entity, itemErrors, 'Project ID');
  }

  Logger.log(itemErrors['DOI']);
  Logger.log(itemErrors['BibTex']);
  Logger.log(itemErrors['Litterature type']);
  Logger.log(itemErrors['Alternative URL']);
  Logger.log(itemErrors['Contributor']);
  Logger.log(itemErrors['Project ID']);

  sheet_BIF_autheniticity.getRange("C6").setValue(today);

  sheet_BIF_autheniticity.getRange("C10").setValue(itemErrors['DOI']);
  sheet_BIF_autheniticity.getRange("D10").setValue(itemErrors['BibTex']);
  sheet_BIF_autheniticity.getRange("E10").setValue(itemErrors['Litterature type']);
  sheet_BIF_autheniticity.getRange("F10").setValue(itemErrors['Alternative URL']);
  sheet_BIF_autheniticity.getRange("G10").setValue(itemErrors['Contributor']);
  sheet_BIF_autheniticity.getRange("H10").setValue(itemErrors['Project ID']);
}
