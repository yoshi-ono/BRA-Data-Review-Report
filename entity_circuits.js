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
    this.check_Contributor(151, 152);
    this.check_Project_ID(155, 156);
  }

  checkCircuitID()
  {
    // Circuit IDが記述されていない。
    if (!this.isDescribed(this.items['Circuit ID'])) {
      this.errorNums['Circuit ID'].push(101);
    } else {
      // Circuit IDの記述がStringではない。
      // Circuit IDがユニークではない（重複する記号が他のレコードに存在する）。
      // [Manual] 既存のCircuitを異なる名前で表している疑いがある（意味的な重複） 
    }
  }

  checkSourceOfID()
  {
    // Source of IDが記述されていない。
    if (!this.isDescribed(this.items['Source of ID'])) {
      this.errorNums['Source of ID'].push(107);
    } else {
      // Source of IDに指定範囲外の値が記述されている。
      // Source of IDに"makeshift"が指定されている場合には、追加の専門手的な判断を要するためEditorに通知する。（このためにエラーを設定する）
    }
  }

  checkNames()
  {
    // Namesが記述されていない。
    if (!this.isDescribed(this.items['Names'])) {
      this.errorNums['Names'].push(111);
    } else {
      // Namesの記述がStringsではない。
    }
  }

  checkDHBA_GraphOrder()
  {
    // DHBA: graph_orderが記述されていない。
    if (!this.isDescribed(this.items['DHBA: graph_order'])) {
      this.errorNums['DHBA: graph_order'].push(115);
    } else {
      // DHBA: graph_orderの小数点以下の桁数を含む数値ではない。
      // DHBA: graph_orderの小数点以上の数値がDHBAで指定されるCircuitに存在しない。
    }
  }

  checkSubCircuit()
  {
    // Source of IDがcollectionであるにも関わらず、Sub-Circuitsが記述されていない。
    // Sub-Circuitに列挙されたCircuit IDの何れかが、Cicuit IDとして定義されていない。
  }

  checkSuperClass()
  {
    // Super Classに列挙されたCircuit IDの何れかが、Cicuit IDとして定義されていない。
  }

  checkUniform()
  {
    // Uniformが記述されていない。
    if (!this.isDescribed(this.items['Uniform'])) {
      this.errorNums['Uniform'].push(127);
    } else {
      // Uniformに指定範囲外の値が記述されている。

    }
  }

  checkTransmitter()
  {
    // Transmitterに指定範囲外の値が記述されている。
  }

  checkModulationType()
  {
    // Modulation Typeに指定範囲外の値が記述されている。
  }

  checkSize()
  {
    // Sizeにnumber+[Reference ID] 以外の値が記述されている。
  }

  checkPhysiologicalData()
  {
    // [Manual] Physiological Dataの記述がIndex to data (URLs, drawings in papers, etc.)ではない。
  }
}