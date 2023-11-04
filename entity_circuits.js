/*
 *  Circuits エンティティ クラス
 */
class entityCircuits extends entityBasic
{
  constructor(header, data, row, reviewItems)
  {
    super(header, data, row, reviewItems);
    this.check();
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  check()
  {
    this.checkCircuitID();
    this.checkSourceOfID();
    this.checkNames();
    this.checkDHBA_GraphOrder();
    this.checkSubCircuit();
    this.checkSuperClass();
    this.checkUniform();
    this.checkTransmitter();
    this.checkModulationType();
    this.checkSize();
    this.checkPhysiologicalData();
    this.check_Contributor(151);
    this.check_Project_ID(155);
  }

  checkCircuitID()
  {
    // Circuit IDが記述されていない。
    if (!this.isDescribed(this.items['Circuit ID'])) {
      this.errorNums['Circuit ID'].push(101);
    } else {
      // Circuit IDがユニークではない（重複する記号が他のレコードに存在する）。[103:Circuit ID]
      var rows = g_bra_data.circuits.searchItem('Circuit ID', this.items['Circuit ID']);
      if (rows.length > 1)
        this.errorNums['Circuit ID'].push(103);

      // [Manual] 既存のCircuitを異なる名前で表している疑いがある（意味的な重複） 
    }
  }

  checkSourceOfID()
  {
    // Source of IDが記述されていない。
    if (!this.isDescribed(this.items['Source of ID'])) {
      this.errorNums['Source of ID'].push(107);
    } else {
      // Source of IDに指定範囲外の値が記述されている。[108:Source of ID]
      if (!g_bra_data.listItems.SourceOfID.includes(this.items['Source of ID']))
        this.errorNums['Source of ID'].push(108);

      // Source of IDに"makeshift"が指定されている場合には、追加の専門手的な判断を要するためEditorに通知する。（このためにエラーを設定する）[109:Source of ID]
      if (this.items['Source of ID'] == "makeshift")
        this.warningNums['Source of ID'].push(109);
    }
  }

  checkNames()
  {
    // Namesが記述されていない。
    if (!this.isDescribed(this.items['Names'])) {
      this.errorNums['Names'].push(111);
    }
  }

  checkDHBA_GraphOrder()
  {
    // DHBA: graph_orderが記述されていない。
    if (!this.isDescribed(this.items['DHBA: graph_order'])) {
      this.errorNums['DHBA: graph_order'].push(115);
    } else {
      var val = this.items['DHBA: graph_order'];
      // DHBA: graph_orderの小数点以下の桁数を含む数値ではない。[116:DHBA: graph_order]
      if (isFinite(val)) {
        val = String(val);
        if (!val.includes('.')) {
          this.errorNums['DHBA: graph_order'].push(116);
        } else {
          /*
          // DHBA: graph_orderの小数点以上の数値がDHBAで指定されるCircuitに存在しない。
          var order = val.split('.');
          var rows = g_bra_data.circuits.searchItem('DHBA: graph_order', order[0]);
          var err = true;
          for (var row of rows) {
            var id = g_bra_data.circuits.getRowItemValue(row, 'Source of ID');
            if (id == "DHBA")
              err = false;
          }
          if (err)
            this.errorNums['DHBA: graph_order'].push(117);
          */
          // DHBA:graph_order の切り捨て値は 2 から 3316 までの整数値ではない。[117:DHBA: graph_order]
          var order = val.split('.');
          var roundnum = order[0];
          if (roundnum < 2 || 3316 < roundnum) {
            this.errorNums['DHBA: graph_order'].push(117);
          }
        }
      } else {
        this.errorNums['DHBA: graph_order'].push(116);
      }
    }
  }

  checkSubCircuit()
  {
    // Source of IDがcollectionであるにも関わらず、Sub-Circuitsが記述されていない。[120:Sub-Circuits]
    if (this.items['Source of ID'] == "collection") {
      if (!this.isDescribed(this.items['Sub-Circuits'])) {
        this.errorNums['Sub-Circuits'].push(120);
      }
    }
    // Sub-Circuitに列挙されたCircuit IDの何れかが、Cicuit IDとして定義されていない。[121:Sub-Circuits]
    if (this.isDescribed(this.items['Sub-Circuits'])) {
      if (!this.isDefinedCircuits(this.items['Sub-Circuits']))
        this.errorNums['Sub-Circuits'].push(121);
    }
  }

  checkSuperClass()
  {
    // Super Classに列挙されたCircuit IDの何れかが、Cicuit IDとして定義されていない。[124:Super Class]
    if (this.isDescribed(this.items['Super Class'])) {
      if (!this.isDefinedCircuits(this.items['Super Class']))
        this.errorNums['Super Class'].push(124);
    }
  }

  checkUniform()
  {
    // Uniformが記述されていない。
    if (!this.isDescribed(this.items['Uniform'])) {
      this.errorNums['Uniform'].push(127);
    } else {
      // Uniformに指定範囲外の値が記述されている。
      if (!g_bra_data.listItems.Uniform.includes(this.items['Uniform']))
        this.errorNums['Uniform'].push(128);
    }
  }

  checkTransmitter()
  {
    if (this.isDescribed(this.items['Transmitter'])) {
      // Transmitterに指定範囲外の値が記述されている。
      if (!g_bra_data.listItems.Transmitter.includes(this.items['Transmitter']))
        this.errorNums['Transmitter'].push(131);
    }
  }

  checkModulationType()
  {
    if (this.isDescribed(this.items['Modulation Type'])) {
      // Modulation Typeに指定範囲外の値が記述されている。
      if (!g_bra_data.listItems.ModulationType.includes(this.items['Modulation Type']))
        this.errorNums['Modulation Type'].push(134);
    }
  }

  checkSize()
  {
    // Sizeにnumber+[Reference ID] 以外の値が記述されている。<<保留>>
  }

  checkPhysiologicalData()
  {
    // [Manual] Physiological Dataの記述がIndex to data (URLs, drawings in papers, etc.)ではない。
  }
}