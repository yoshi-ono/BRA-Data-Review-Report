/*
 *  Connections エンティティ クラス
 */
class entityConnections extends entityBasic
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
    this.check_sCID();
    this.check_sCID_relation();
    this.check_Notation_of_sCID_in_Literature();
    this.check_rCID();
    this.check_rCID_relation();
    this.check_Notation_of_rCID_in_Literature();
    this.check_Size();
    this.check_Reference_ID();
    this.check_Taxon();
    this.check_Measurement_method();
    this.check_Pointers_on_literature();
    this.check_Pointers_on_figure();
    this.check_Indepth_literature();
    this.check_Contributor(288);
    this.check_Project_ID(294);
  }

  check_sCID() {
    // Sender Circuit ID (sCID)が記述されていない。
    if (!this.isDescribed(this.items['Sender Circuit ID (sCID)'])) {
      this.errorNums['Sender Circuit ID (sCID)'].push(201);
    } else {
      // Sender Circuit ID (sCID)に定義済みのCircuit ID以外の値が記述されている。
      if (!this.isDefinedCircuit(this.items['Sender Circuit ID (sCID)']))
        this.errorNums['Sender Circuit ID (sCID)'].push(202);
    }
  }
  check_sCID_relation() {
    // sCID relationが記述されていない。
    if (!this.isDescribed(this.items['sCID relation'])) {
      this.errorNums['sCID relation'].push(207);
    } else {
      // sCID relationに指定範囲外の値が記述されている。
      if (!g_bra_data.listItems.CIDRelation.includes(this.items['sCID relation']))
        this.errorNums['sCID relation'].push(208);
    }
  }
  check_Notation_of_sCID_in_Literature() {
    // sCID relationがイコール(=)で無いにも関わらずNotation of sCID in Literatureが記述されていない。
    if (this.items['sCID relation'] != "=") {
      if (!this.isDescribed(this.items['Notation of sCID in Literature']))
        this.errorNums['Notation of sCID in Literature'].push(213);
    }
    // Notation of sCID in Literatureに定義済みのCircuit ID以外の値が記述されている。
    if (this.isDescribed(this.items['Notation of sCID in Literature'])) {
      if (!this.isDefinedCircuit(this.items['Notation of sCID in Literature']))
        this.errorNums['Notation of sCID in Literature'].push(214);
    }
  }
  check_rCID() {
    // Receiver Circuit ID (rCID)が記述されていない。
    if (!this.isDescribed(this.items['Receiver Circuit ID (rCID)'])) {
      this.errorNums['Receiver Circuit ID (rCID)'].push(219);
    } else {
      // Receiver Circuit ID (rCID)に定義済みのCircuit ID以外の値が記述されている。
      if (!this.isDefinedCircuit(this.items['Receiver Circuit ID (rCID)']))
        this.errorNums['Receiver Circuit ID (rCID)'].push(224);
    }
  }
  check_rCID_relation() {
    // rCID relationが記述されていない。
    if (!this.isDescribed(this.items['rCID relation'])) {
      this.errorNums['rCID relation'].push(229);
    } else {
      // rCID relationに指定範囲外の値が記述されている。[230:rCID relation]
      if (!g_bra_data.listItems.CIDRelation.includes(this.items['rCID relation']))
        this.errorNums['rCID relation'].push(230);
    }
  }
  check_Notation_of_rCID_in_Literature() {
    // rCID relationがイコール(=)で無いにも関わらずNotation of rCID in Literatureが記述されていない。
    // [235:Notation of rCID in Literature]
    if (this.items['rCID relation'] != "=") {
      if (!this.isDescribed(this.items['Notation of rCID in Literature']))
        this.errorNums['Notation of rCID in Literature'].push(235);
    }
    // Notation of rCID in Literatureに定義済みのCircuit ID以外の値が記述されている。
    // [236:Notation of rCID in Literature]
    if (this.isDescribed(this.items['Notation of rCID in Literature'])) {
      if (!this.isDefinedCircuit(this.items['Notation of rCID in Literature']))
        this.errorNums['Notation of rCID in Literature'].push(236);
    }
  }
  check_Size() {
    // Sizeにnumber+[Reference ID] 以外の値が記述されている。<<保留>>
  }
  check_Reference_ID() {
    // Reference IDが記述されていない。
    if (!this.isDescribed(this.items['Reference ID'])) {
      this.errorNums['Reference ID'].push(252);
    } else {
      // Reference IDに指定範囲外の値が記述されている。[253:Reference ID]
      if (!g_bra_data.listItems.ReferenceID.includes(this.items['Reference ID']))
        this.errorNums['Reference ID'].push(253);

      // Reference IDに"makeshift"が指定されている場合には、追加の専門手的な判断を要するためEditorに通知する。（このためにエラーを設定する）[254:Reference ID]
      if (this.items['Reference ID'] == "makeshift")
        this.errorNums['Reference ID'].push(254);
    }
  }
  check_Taxon() {
    // Taxonが記述されていない。
    if (!this.isDescribed(this.items['Taxon'])) {
      this.errorNums['Taxon'].push(259);
    } else {
      // Taxonに指定範囲外の値が記述されている。[260:Taxon]
      if (!g_bra_data.listItems.Taxon.includes(this.items['Taxon']))
        this.errorNums['Taxon'].push(260);
    }
  }
  check_Measurement_method() {
    // Measurement methodが記述されていない。
    if (!this.isDescribed(this.items['Measurement method'])) {
      this.errorNums['Measurement method'].push(265);
    } else {
      // Measurement methodに指定範囲外の値が記述されている。[266:Measurement method]
      if (!g_bra_data.listItems.MeasurementMethod.includes(this.items['Measurement method']))
        this.errorNums['Measurement method'].push(266);
    }
  }
  check_Pointers_on_literature() {
    // Pointers on figureが空欄にも関わらず、Pointers on literatureが記述されていない。
    if (!this.isDescribed(this.items['Pointers on literature'])) {
      if (!this.isDescribed(this.items['Pointers on figure']))
        this.errorNums['Pointers on literature'].push(271);
    } else {
      // Pointers on literatureの記述が 10 words以上ではない。[272:Pointers on literature]
      var literature = this.items['Pointers on literature'];
      if (isFinite(literature))
        literature = String(literature);

      if (literature.length < 10)
        this.errorNums['Pointers on literature'].push(272);

      // [Manual] このPointers on literatureセル内に記述されている文を、Reference IDで指定された文献上で見つけられない。
      // [Manual] このPointers on literatureセル内に記述されている文によっては、このレコードで表現されるコネクションの存在を担保できない。
    }
  }
  check_Pointers_on_figure() {
    // Pointers on literatureが空欄にも関わらず、Pointers on figureが記述されていない。
    if (!this.isDescribed(this.items['Pointers on figure'])) {
      if (!this.isDescribed(this.items['Pointers on literature']))
        this.errorNums['Pointers on figure'].push(277);
    } else {
      // Pinter on figureの記述が、一つのFigureを指定するtext形式ではない。<<保留>>
      // [Manual] Reference IDで指定された文献中におけるPointers on figureで指定される図面によっては、このレコードで表現されるコネクションの存在を担保できない。
    }
  }
  check_Indepth_literature() {
    // In-depth literatureのReference IDに指定範囲以外の値が記述されている。（同253）[283:In-depth literature]
    if (this.isDescribed(this.items['In-depth literature'])) {
      if (!g_bra_data.listItems.ReferenceID.includes(this.items['In-depth literature']))
        this.errorNums['In-depth literature'].push(283);
    }
  }
}