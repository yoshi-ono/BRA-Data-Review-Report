class ListItems
{
  constructor()
  {
    this.adminonlySheet = hcdSpreadsheet.getSheetByName('AdminOnly');

    this.LiteratureType = this.getItems("E2:E11");
    this.RegionCategory = this.getItems("Z2:Z6");
    this.SourceOfID = this.getItems("T2:T223");
    this.Uniform = ['TRUE', 'FALSE'];
    this.Transmitter = this.getItems("P2:P7");
    this.ModulationType = this.getItems("R2:R4");
  }

  getItems(range)
  {
    var data = this.adminonlySheet.getRange(range).getValues();

    var items = [];
    for (var i = 0; i < data.length; i++)
    {
      var val = data[i][0];

      if (isFinite(val))
        val = String(val);

      val = val.trim();

      if (val === "" || val === "[]")
        continue;

      items.push(val);
    }
    return items;
  }
}