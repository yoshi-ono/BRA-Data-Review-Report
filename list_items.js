class ListItems
{
  constructor()
  {
    this.adminonlySheet = hcdSpreadsheet.getSheetByName('AdminOnly');

    this.LiteratureType = this.getItems("E2:E11");
    this.RegionCategory = this.getItems("Z2:Z6");
  }

  getItems(range)
  {
    var data = this.adminonlySheet.getRange(range).getValues();

    var items = [];
    for (var i = 0; i < data.length; i++)
    {
      items.push(data[i][0]);
    }
    return items;
  }
}