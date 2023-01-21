/*
 *  HCDeditor エンティティ クラス
 */
class entityHCDeditor extends entityBasic
{
  constructor(header, data, row, reviewItems, hcdNoStr)
  {
    super(header, data, row, reviewItems);
    this.hcdNoStr = hcdNoStr;
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
      var rows = g_editor.searchItem('Circuit ID', this.items['Circuit ID']);
      if (rows.length > 1)
        this.errorNums['Circuit ID'].push(402);
    }
  }
  check_Component_Label() {
    var itemName = 'Component Label ' + this.hcdNoStr;

    // Component Labelが記述されていない。[405:Component Label]
    if (!this.isDescribed(this.items[itemName])) {
      this.errorNums[itemName].push(405);
    }
  }
  check_Output_Circuits() {
    var itemName = 'Output Circuits ' + this.hcdNoStr;

    // 「Uniform=TRUE」であるレコードであるのにOutput Circuitsが書かれていない[408:Output Circuits]
    if (this.isTRUE(this.items['Uniform'])) {
      if (!this.isDescribed(this.items[itemName]))
        this.errorNums[itemName].push(408);
    }
    // 「Region Category=Input」であるレコードであるのにOutput Circuitsが書かれていない[409:Output Circuits]
    if (this.items['Region Category ' + this.hcdNoStr] === "Input") {
      if (!this.isDescribed(this.items[itemName]))
        this.errorNums[itemName].push(409);
    }
    // 「Uniform＝FALSE」にも関わらずOutput Circuit名が書かれている[411:Output Circuits]
    if (this.isFALSE(this.items['Uniform'])) {
      if (this.isDescribed(this.items[itemName]))
        this.errorNums[itemName].push(411);
    }
    // Output Circuitsに列挙されたCircuit IDの何れかが、Cicuit IDとして定義されていない。[413:Output Circuits]
    if (this.isDescribed(this.items[itemName])) {
      if (!this.isDefinedCircuits(this.items[itemName]))
        this.errorNums[itemName].push(413);
    }

    // [Manual] Output Circuitsが図面中(コンポーネント図)に記述されたOutputと一致しない。[414:Output Circuits]
  }
  check_Output_Circuit_Validation() {
    var itemName = 'Output Circuit Validation ' + this.hcdNoStr;

    // Output Circuitsに記述されたCircuit IDがProjectionカラムに記述されていない。(Output Circuit Validationで"x"が表示される。)
    // [418:Output Circuit Validation]
    if (this.items[itemName].includes("x")) {
      this.errorNums[itemName].push(418);
    }
  }
  check_Input_Circuit() {
    // [Manual] Input Circuitが図面中(コンポーネント図)に記述されたInputと一致しない。[422:Input Circuit]
  }
  check_Region_Category() {
    var itemName = 'Region Category ' + this.hcdNoStr;

    // Region Categoryが記述されていない。[428:Region Category]
    if (!this.isDescribed(this.items[itemName])) {
        this.errorNums[itemName].push(428);
    } else {
      // Region Categoryに指定範囲外の値が記述されている。[429:Region Category]
      if (!listItems.RegionCategory.includes(this.items[itemName]))
        this.errorNums[itemName].push(429);
    }
  }
  check_Process() {
    var itemName = 'Process' + this.hcdNoStr;

    // Processが記述されていない。[431:Process]
    if (!this.isDescribed(this.items[itemName])) {
      this.errorNums[itemName].push(431);
    } else {
      // 「Region Category」カラムが「ROI」「inROI」の個所で「(Undefined interface process)」が使用されている[432:Process]
      var nameRegionCategory = 'Region Category ' + this.hcdNoStr;
      if (this.items[nameRegionCategory] == "ROI" || this.items[nameRegionCategory] == "inROI") {
        if (this.items[itemName] == "(Undefined interface process)")
          this.errorNums[itemName].push(432);
      }

      var matchOut = this.items[itemName].match(/O\(.+?\)/g);
      var matchIn = this.items[itemName].match(/I\(.+?\)/g);
      // 以下の記述様式になっていない．：    O(XXX) および I(XXX) を含む。[433:Process]
      if (matchOut == null || matchIn == null) {
          this.errorNums[itemName].push(433);
      } else {
        // I(X)に記載されているXに，Input CircuitにAF（Input Circuit）カラムで記述されているもの以外が存在する[434:Process]

        // O(Y)に記載されているYが，AB（Circuit ID）カラムと異なる[435:Process]
      }
    }
  }
  check_Output_semantics() {
    var itemName = 'Output Semantics ' + this.hcdNoStr;

    // Output semanticsが記述されていない。[439:Output semantics]
    if (!this.isDescribed(this.items[itemName])) {
      this.errorNums[itemName].push(439);
    } else {
      // Referenceシートに記載されていない先行研究が引用されている  [Reference ID][441:Output semantics]
    }
  }
}