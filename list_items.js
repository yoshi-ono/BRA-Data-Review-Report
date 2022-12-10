class ListItems
{
  constructor()
  {
    this.LiteratureType = [];

    this.setLiteratureType()
  }

  setLiteratureType()
  {
    let hcdSpreadsheet = SpreadsheetApp.openById(hcd_id);
    let adminonlySheet = hcdSpreadsheet.getSheetByName('AdminOnly');

    var data = adminonlySheet.getRange("E2:E11").getValues();

    for (var i = 0; i < data.length; i++)
    {
      this.LiteratureType.push(data[i][0]);
    }
  }
}