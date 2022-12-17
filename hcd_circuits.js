function check_circuits()
{
  let circuitsSheet = hcdSpreadsheet.getSheetByName('Circuits');

  var data = circuitsSheet.getRange("A1:AM21").getValues();
  
  var header = data[0];

  var reviewItems = [];
  reviewItems.push('Circuit ID');
  reviewItems.push('Source of ID');
  reviewItems.push('Names');
  reviewItems.push('DHBA: graph_order');
  reviewItems.push('Sub-Circuits');
  reviewItems.push('Super Class');
  reviewItems.push('Uniform');
  reviewItems.push('Transmitter');
  reviewItems.push('Modulation Type');
  reviewItems.push('Size');
  reviewItems.push('Physiological Data');
  reviewItems.push('Contributor');
  reviewItems.push('Project ID');

  var itemErrors = {};
  for (var i = 0; i < reviewItems.length; i++)
    itemErrors[reviewItems[i]] = "";

  for (var i = 1; i < data.length; i++)
  {
    var entity = new entityCircuits(header, data[i], i + 1, reviewItems);
    //Logger.log(entity);

    // HCDファイル記録
    circuitsSheet.getRange(entity.row, 33).setValue(entity.items['Auto Error Codes']);  // AG列=33
    circuitsSheet.getRange(entity.row, 38).setValue(hcd_confirmor);   // AL列=38
    circuitsSheet.getRange(entity.row, 39).setValue(today);           // AM列=39

    for (var j = 0; j < entity.reviewItems.length; j++)
      summaryItemErrors(entity, itemErrors, entity.reviewItems[j]);
  }

  for (var i = 0; i < reviewItems.length; i++) {
    Logger.log(itemErrors[reviewItems[i]]);

    // Report
    sheet_BIF_autheniticity.getRange(17, 4 + i).setValue(itemErrors[reviewItems[i]]);
  }
}
