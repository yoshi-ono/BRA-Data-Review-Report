class ListItems
{
  constructor()
  {
    this.adminonlySheet = g_bra_data.getSheet('AdminOnly');

    this.LiteratureType = this.getItems("E2:E14");
    this.RegionCategory = this.getItems("Z2:Z6");
    this.SourceOfID = this.getItems("T2:T223");
    this.Uniform = ["TRUE", "FALSE", true, false];
    this.Transmitter = this.getItems("P2:P7");
    this.ModulationType = this.getItems("R2:R4");
    this.CIDRelation = ["=", "'=", "<", ">"];
    this.ReferenceID = this.getItems("U2:U223");
    this.Taxon = this.getItems("H2:H12");
    this.MeasurementMethod = this.getItems("M2:M20");

    // Error Type: 3
    this.ManualWarning = ["104", "422", "423", "432", "470"];
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

      if (val === "" || val === "[]" || val === "(Reserve Items)")
        continue;

      items.push(val);
    }
    return items;
  }

  isManualWarning(errorStr)
  {
    // エラー番号のみ
    var regex = /^\d+$/;
    var result = regex.exec(errorStr);
    //Logger.log("エラー番号のみ：" + result);

    if (result != null) {
      return this.ManualWarning.includes(result[0]);
    }

    // エラー表記 [NNN:項目]エラーの説明
    var regex = /^\[(\d+):/
    var result = regex.exec(errorStr);
    //Logger.log("エラー表記：" + result);

    if (result != null) {
      return this.ManualWarning.includes(result[1]);
    }

    return false;
  }
}