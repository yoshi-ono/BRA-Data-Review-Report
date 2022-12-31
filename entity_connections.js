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
    this.check_Contributor(288, 289);
    this.check_Project_ID(294, 295);
  }

  check_sCID() {
    // Sender Circuit ID (sCID)が記述されていない。
    if (!this.isDescribed(this.items['Sender Circuit ID (sCID)'])) {
      this.errorNums['Sender Circuit ID (sCID)'].push(201);
    } else {
      // Sender Circuit ID (sCID)に定義済みのCircuit ID以外の値が記述されている。
    }
  }
  check_sCID_relation() {
    // sCID relationが記述されていない。
    if (!this.isDescribed(this.items['sCID relation'])) {
      this.errorNums['sCID relation'].push(207);
    } else {
      // sCID relationに指定範囲外の値が記述されている。
    }
  }
  check_Notation_of_sCID_in_Literature() {
    // sCID relationがイコール(=)で無いにも関わらずNotation of sCID in Literatureが記述されていない。
    // Notation of sCID in Literatureに定義済みのCircuit ID以外の値が記述されている。
  }
  check_rCID() {
    // Receiver Circuit ID (rCID)が記述されていない。
    if (!this.isDescribed(this.items['Receiver Circuit ID (rCID)'])) {
      this.errorNums['Receiver Circuit ID (rCID)'].push(219);
    } else {
      // Receiver Circuit ID (rCID)に定義済みのCircuit ID以外の値が記述されている。
    }
  }
  check_rCID_relation() {
    // rCID relationが記述されていない。
    if (!this.isDescribed(this.items['rCID relation'])) {
      this.errorNums['rCID relation'].push(229);
    } else {
      // rCID relationに指定範囲外の値が記述されている。
    }
  }
  check_Notation_of_rCID_in_Literature() {
    // rCID relationがイコール(=)で無いにも関わらずNotation of rCID in Literatureが記述されていない。
    // Notation of rCID in Literatureに定義済みのCircuit ID以外の値が記述されている。
  }
  check_Size() {
    // Sizeにnumber+[Reference ID] 以外の値が記述されている。
  }
  check_Reference_ID() {
    // Reference IDが記述されていない。
    if (!this.isDescribed(this.items['Reference ID'])) {
      this.errorNums['Reference ID'].push(252);
    } else {
      // Reference IDに指定範囲外の値が記述されている。
      // Reference IDに"makeshift"が指定されている場合には、追加の専門手的な判断を要するためEditorに通知する。（このためにエラーを設定する）
    }
  }
  check_Taxon() {
    // Taxonが記述されていない。
    if (!this.isDescribed(this.items['Taxon'])) {
      this.errorNums['Taxon'].push(259);
    } else {
      // Taxonに指定範囲外の値が記述されている。
    }
  }
  check_Measurement_method() {
    // Measurement methodが記述されていない。
    if (!this.isDescribed(this.items['Measurement method'])) {
      this.errorNums['Measurement method'].push(265);
    } else {
      // Measurement methodに指定範囲外の値が記述されている。
    }
  }
  check_Pointers_on_literature() {
    // Pointers on figureが空欄にも関わらず、Pointers on literatureが記述されていない。
    if (!this.isDescribed(this.items['Pointers on literature'])) {
      if (!this.isDescribed(this.items['Pointers on figure']))
        this.errorNums['Pointers on literature'].push(271);
    } else {
      // Pointers on literatureの記述が 10 words以上ではない。
      // このPointers on literatureセル内に記述されている文を、Reference IDで指定された文献上で見つけられない。
      // このPointers on literatureセル内に記述されている文によっては、このレコードで表現されるコネクションの存在を担保できない。
    }
  }
  check_Pointers_on_figure() {
    // Pointers on literatureが空欄にも関わらず、Pointers on figureが記述されていない。
    if (!this.isDescribed(this.items['Pointers on figure'])) {
      if (!this.isDescribed(this.items['Pointers on literature']))
        this.errorNums['Pointers on figure'].push(277);
    } else {
      // Pinter on figureの記述が、一つのFigureを指定するtext形式ではない。
      // Reference IDで指定された文献中におけるPointers on figureで指定される図面によっては、このレコードで表現されるコネクションの存在を担保できない。
    }
  }
  check_Indepth_literature() {
    // In-depth literatureの値がReference IDでない。
  }
}