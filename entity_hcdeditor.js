/*
 *  HCDeditor エンティティ クラス
 */
class entityHCDeditor extends entityBasic
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
    this.check_Circuit_ID();
    this.check_Component_Label();
    this.check_Output_Circuits();
    this.check_Output_Circuit_Validation();
    this.check_Input_Circuit();
    this.check_Region_Category();
    this.check_Process();
    this.check_Output_semantics();
  }

  check_Circuit_ID() {
    // Circuit IDが記述されていない。[401:Circuit ID]
    if (!this.isDescribed(this.items['Circuit ID'])) {
      this.errorNums['Circuit ID'].push(401);
    } else {
      // 異なるレコードに同じCircuit IDが記述されている．[402:Circuit ID]
    }
  }
  check_Component_Label() {
    // Component Labelが記述されていない。[405:Component Label]
    if (!this.isDescribed(this.items['Component Label (1)'])) {
      this.errorNums['Component Label (1)'].push(405);
    }
  }
  check_Output_Circuits() {
    // 「Uniform=TRUE」であるレコードであるのにOutput Circuitsが書かれていない[408:Output Circuits]
    if (this.isTRUE(this.items['Uniform'])) {
      if (!this.isDescribed(this.items['Output Circuits (1)']))
        this.errorNums['Output Circuits (1)'].push(408);
    }
    // 「Region Category=Input」であるレコードであるのにOutput Circuitsが書かれていない[409:Output Circuits]
    if (this.items['Region Category (1)'] === "Input") {
      if (!this.isDescribed(this.items['Output Circuits (1)']))
        this.errorNums['Output Circuits (1)'].push(409);
    }
    // 「Uniform＝FALSE」にも関わらずOutput Circuit名が書かれている[411:Output Circuits]
    if (this.isFALSE(this.items['Uniform'])) {
      if (this.isDescribed(this.items['Output Circuits (1)']))
        this.errorNums['Output Circuits (1)'].push(411);
    }
    // 二つ以上のCircuitが「;」で区切られていない[413:Output Circuits]
    // [Manual] Output Circuitsが図面中(コンポーネント図)に記述されたOutputと一致しない。[414:Output Circuits]
  }
  check_Output_Circuit_Validation() {
    // Output Circuitsに記述されたCircuit IDがProjectionカラムに記述されていない。(Output Circuit Validationで"x"が表示される。)[418:Output Circuit Validation]
    if (this.items['Output Circuit Validation (1)'].includes("x")) {
      this.errorNums['Output Circuit Validation (1)'].push(418);
    }
  }
  check_Input_Circuit() {
    // [Manual] Input Circuitが図面中(コンポーネント図)に記述されたInputと一致しない。[422:Input Circuit]
  }
  check_Region_Category() {
    if (this.isDescribed(this.items['Region Category (1)'])) {
      // Region Categoryに指定範囲外の値が記述されている。[428:Region Category]
      if (!listItems.RegionCategory.includes(this.items['Region Category (1)']))
        this.errorNums['Region Category (1)'].push(428);
    }
  }
  check_Process() {
    // Processが記述されていない。[431:Process]
    if (!this.isDescribed(this.items['Process(1)'])) {
      this.errorNums['Process(1)'].push(431);
    } else {
      // 「Region Category」カラムが「ROI」「inROI」の個所で「(Undefined interface process)」が使用されている[432:Process]
      // 以下の記述様式になっていない．：    O(XXX) および I(XXX) を含む。[433:Process]
      // I(X)に記載されているXに，Input CircuitにAF（Input Circuit）カラムで記述されているもの以外が存在する[434:Process]
      // O(Y)に記載されているYが，AB（Circuit ID）カラムと異なる[435:Process]
    }
  }
  check_Output_semantics() {
    // Output semanticsが記述されていない。[439:Output semantics]
    if (!this.isDescribed(this.items['Output Semantics (1)'])) {
      this.errorNums['Output Semantics (1)'].push(439);
    } else {
      // Referenceシートに記載されていない先行研究が引用されている  [Reference ID][441:Output semantics]
    }
  }
}