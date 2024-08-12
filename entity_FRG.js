/*
 *  FRG エンティティ クラス
 */
class entityFRG extends entityBasic {
  constructor(header, data, row, reviewItems) {
    super(header, data, row, reviewItems);

    this.NodeID_Prefix = "";

    this.check();
  }

  isCorrectNodeId(nodeId)
  {
    var nodeName = nodeId;
    var indexPName = nodeId.indexOf(":");

    // 先頭が「R.｜C. ｜A.｜U.」（あるいは「プロジェクト名:R.｜C.｜A.｜U.」）のいずれかで始まっていない
    // ※プロジェクト名は、大文字／小文字／数字が使える [402:Node ID]
    if (indexPName >= 0) {
      var projectName = nodeId.slice(0, indexPName);  // 先頭がプロジェクト名
      nodeName = nodeId.slice(indexPName + 1);
      var regex = /^[0-9a-zA-Z]+$/;
      if (regex.exec(projectName) == null) {
        Logger.log("Node ID プロジェクト名エラー: " + projectName);
        return 402;
      }
    }

    var nodeNames = nodeName.split(".");
    if (nodeNames.length != 2) {
      Logger.log("Node ID \".\"が1つ含まれていない: " + nodeName);
      return 402;
    }

    if (nodeNames[0] != 'R' && nodeNames[0] != 'C' && nodeNames[0] != 'A' && nodeNames[0] != 'U') {
      Logger.log("Node ID 先頭文字エラー: " + nodeNames[0]);
      return 402;
    } else {
      this.NodeID_Prefix = nodeNames[0];
    }

    // 先頭の「R.｜C.｜A.｜U.」（あるいは「プロジェクト名:R.｜C.｜A.｜U.」）に続く文字がケバブケースではない。
    // ※ケバブケースは、大文字／小文字／数字／ハイフンが使える [403:Node ID]
    var regex = /^[0-9a-zA-Z-]+$/;
    if (regex.exec(nodeNames[1]) == null) {
      Logger.log("Node ID ケバブケースではない: " + nodeNames[1]);
      return 403;
    }

    Logger.log("Node ID is correct: " + nodeId);
    return 0;
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  check() {
    this.check_Node_ID();
    this.check_Sub_Nodes();
    this.check_Circuit_ID();
    this.check_Projected_Circuits();
    this.check_Capability_Realization_by_Implementation_LLM();
    this.check_Capability_Realization_by_Implementation();
    this.check_Implementation_of_Uniform_Circuit();
    this.check_Capability();
    this.check_Capability_Synthesis_LLM();
    this.check_Capability_Synthesis();
    this.check_Requirements_Realization_by_Interface_LLM();
    this.check_Requirements_Realization_by_Interface();
    this.check_Requirements_Endorsement_by_Capability_LLM();
    this.check_Requirements_Endorsement_by_Capability();
    this.check_Requirements();
    this.check_Requirements_Synthesis_LLM();
    this.check_Requirements_Synthesis();
    this.check_Semantics();
  }

  check_Node_ID() {
    // Node ID が記述されていない。 [401:Node ID]
    if (!this.isDescribed(this.items['Node ID'])) {
      this.errorNums['Node ID'].push(401);
    } else {
      var errorCode = this.isCorrectNodeId(this.items['Node ID']);
      if (errorCode > 0) {
        this.errorNums['Node ID'].push(errorCode);
      }

      // [Manual Error: 1] FRGの図面中に記述されたNode IDと一致しない [404:Node ID]
    }
  }
  check_Sub_Nodes() {
    if (this.isDescribed(this.items['Subnodes'])) {
      var nodes = this.items['Subnodes'];

      // Subnodesに列挙されたNode IDの終端が";"になっていない。 [410:Subnodes]
      if (!this.hasTerminalSymbol(nodes))
        this.errorNums['Subnodes'].push(410);

      // Subnodesに列挙されたNode IDの何れかが、Node IDとして定義されていない。 [411:Subnodes]
      if (isFinite(nodes))
        nodes = String(nodes);
      
      var list = nodes.split(';');
      for (var n of list) {
        if (this.isDescribed(n)) {
          var rows = g_bra_data.frg.searchItem('Node ID', n.trim());
          if (rows.length == 0) {
            this.errorNums['Subnodes'].push(411);
            break;
          }
        }
      }

      // [Manual Error: 1] FRGの図面中に記述されたNode IDと一致しない [412:Subnodes]
      // [Manual Error: 1] FRGの図面中で依存関係にある Subnodes と比較したときに、記載された Subnodes に過不足がある [413:Subnodes]
    }
  }
  check_Circuit_ID() {
    if (!this.isDescribed(this.items['Circuit ID'])) {
      // Node ID列の接頭辞で「U.」を指定しているが、Circuit ID列が記述されていない [424:Circuit ID]
      if (this.NodeID_Prefix == 'U')
        this.errorNums['Circuit ID'].push(424);

      // Node ID列の接頭辞で「A.」を指定しているが、Circuit ID列が記述されていない [425:Circuit ID]
      if (this.NodeID_Prefix == 'A')
        this.errorNums['Circuit ID'].push(425);
    } else {
      // Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [420:Circuit ID]
      if (!this.isDefinedCircuit(this.items['Circuit ID']))
        this.errorNums['Circuit ID'].push(420);

      // 異なるレコードに同じCircuit IDが記述されている． [421:Circuit ID]
      var rows = g_bra_data.frg.searchItem('Circuit ID', this.items['Circuit ID']);
      if (rows.length > 1)
        this.errorNums['Circuit ID'].push(421);

      // [Manual Warning: 3(->ListItems)] BIF Image に記述された Circuit IDと一致しない。 [422:Circuit ID]
      // [Manual Warning: 3(->ListItems)] BIF Image に記述された Uniform Circuit がすべて用いられていない [423:Circuit ID]
    }
  }
  check_Projected_Circuits() {
    if (this.isDescribed(this.items['Projected Circuits'])) {
      // Projected Circuitsに列挙されたCircuit IDの終端が";"になっていない。 [431:Projected Circuits]
      if (!this.hasTerminalSymbol(this.items['Projected Circuits']))
        this.errorNums['Projected Circuits'].push(431);

      // （列挙）Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [430:Projected Circuits]
      if (!this.isDefinedCircuits(this.items['Projected Circuits']))
        this.errorNums['Projected Circuits'].push(430);

      // [Manual Warning: 3(->ListItems)] BIF Image に記述された出力先のCircuit IDと一致しない。 [432:Projected Circuits]
    }
  }
  check_Capability_Realization_by_Implementation_LLM() {
    // [Warning] 記述されていない [441:Capability Realization by Implementation (LLM)]
    if (!this.isDescribed(this.items['Capability Realization by Implementation (LLM)'])) {
      this.warningNums['Capability Realization by Implementation (LLM)'].push(441);
    } else {
      // 「NG:」であると評価されている [440:Capability Realization by Implementation (LLM)]
      var val = this.items['Capability Realization by Implementation (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Capability Realization by Implementation (LLM)'].push(440);
    }
  }
  check_Capability_Realization_by_Implementation() {
    // Capability列が記述されているが、Capability Realization by Implementationが記述されていない [450:Capability Realization by Implementation]
    if (this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Capability Realization by Implementation']))
        this.errorNums['Capability Realization by Implementation'].push(450);

      // [Manual Warning: 3(->ListItems)] Capability Realization by Implementation 列の説明に疑義がある [451:Capability Realization by Implementation]
    }
  }
  check_Implementation_of_Uniform_Circuit() {
    // Subnodes列が記述されていないが、Implementation of Uniform Circuitが記述されていない [460:Implementation of Uniform Circuit]
    if (!this.isDescribed(this.items['Subnodes'])) {
      if (!this.isDescribed(this.items['Implementation of Uniform Circuit'])) {
        this.errorNums['Implementation of Uniform Circuit'].push(460);
      }
    }
    // Subnodes列が記述されているにもかかわらず、Implementation of Uniform Circuitが記述されている [461:Implementation of Uniform Circuit]
    else {
      if (this.isDescribed(this.items['Implementation of Uniform Circuit'])) {
        this.errorNums['Implementation of Uniform Circuit'].push(461);
      }
    }
  }
  check_Capability() {
    if (!this.isDescribed(this.items['Capability'])) {
      // Node ID列の接頭辞で「C.」を指定しているが、Capability列が記述されていない [471:Capability]
      if (this.NodeID_Prefix == 'C')
        this.errorNums['Capability'].push(471);
    } else {
      // [Manual Warning: 3(->ListItems)] Motif以外のCapabilityが用いられている [470:Capability]
    }
  }
  check_Capability_Synthesis_LLM() {
    // [Warning] 記述がされていない [481:Capability Synthesis (LLM)]
    if (!this.isDescribed(this.items['Capability Synthesis (LLM)'])) {
      this.warningNums['Capability Synthesis (LLM)'].push(481);
    } else {
      // 「NG:」であると評価されている [480:Capability Synthesis (LLM)]
      var val = this.items['Capability Synthesis (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Capability Synthesis (LLM)'].push(480);
    }
  }
  check_Capability_Synthesis() {
    // [Manual Warning: 3(->ListItems)] Capability Synthesis列の説明に疑義がある [482:Capability Synthesis]
  }
  check_Requirements_Realization_by_Interface_LLM() {
    // [Warning] 記述がされていない [501:Requirements Realization by Interface (LLM)]
    if (!this.isDescribed(this.items['Requirements Realization by Interface (LLM)'])) {
      this.warningNums['Requirements Realization by Interface (LLM)'].push(501);
    } else {
      // 「NG:」であると評価されている [500:Requirements Realization by Interface (LLM)]
      var val = this.items['Requirements Realization by Interface (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Realization by Interface (LLM)'].push(500);
    }
  }
  check_Requirements_Realization_by_Interface() {
    // Requirements列が記述されているが、Requirements Realization by Interfafce が記述されていない [510:Requirements Realization by Interface]
    if (this.isDescribed(this.items['Requirements'])) {
      if (!this.isDescribed(this.items['Requirements Realization by Interface']))
        this.errorNums['Requirements Realization by Interface'].push(510);
    }
  }
  check_Requirements_Endorsement_by_Capability_LLM() {
    // [Warning] 記述がされていない [521:Requirements Endorsement by Capability (LLM)]
    if (!this.isDescribed(this.items['Requirements Endorsement by Capability (LLM)'])) {
      this.warningNums['Requirements Endorsement by Capability (LLM)'].push(521);
    } else {
      // 「NG:」であると評価されている [520:Requirements Endorsement by Capability (LLM)]
      var val = this.items['Requirements Endorsement by Capability (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Endorsement by Capability (LLM)'].push(520);
    }
  }
  check_Requirements_Endorsement_by_Capability() {
    // Requirements列とCapability列が記述されているが、Requirements Endorsement by Capabilityが記述されていない [530:Requirements Endorsement by Capability]
    if (this.isDescribed(this.items['Requirements']) && this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Requirements Endorsement by Capability']))
        this.errorNums['Requirements Endorsement by Capability'].push(530);
    }

    // [Manual Warning: 3(->ListItems)] Requirements Endorsement by Capablity列の説明に疑義がある [522:Requirements Endorsement by Capability]
  }
  check_Requirements() {
    if (!this.isDescribed(this.items['Requirements'])) {
      if (this.NodeID_Prefix == 'R') {
        // Node ID列の接頭辞で「R.」を指定しているが、Requirements 列が記述されていない [542:Requirements]
        this.errorNums['Capability'].push(542);
      } else {
        // [Warning] Requirements が記述されていない [541:Requirements]
        this.warningNums['Requirements'].push(541);
      }
    } else {
      // 「Node ID:説明文」の記法で記述されていない [540:Requirements]
      var val = this.items['Requirements'].trim();
      var searchString = this.items['Node ID'] + ":";
      if (!val.startsWith(searchString))
        this.errorNums['Requirements'].push(540);
    }
  }
  check_Requirements_Synthesis_LLM() {
    // [Warning] 記述がされていない [551:Requirements Synthesis (LLM)]
    if (!this.isDescribed(this.items['Requirements Synthesis (LLM)'])) {
      this.warningNums['Requirements Synthesis (LLM)'].push(551);
    } else {
      // 「NG:」であると評価されている [550:Requirements Synthesis (LLM)]
      var val = this.items['Requirements Synthesis (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Synthesis (LLM)'].push(550);
    }
  }
  check_Requirements_Synthesis() {
    // Requirements列が記述されているが、Requirements Synthesis が記述されていない [560:Requirements Synthesis]
    if (this.isDescribed(this.items['Requirements'])) {
      if (!this.isDescribed(this.items['Requirements Synthesis']))
        this.errorNums['Requirements Synthesis'].push(560);
    }

    // [Manual Warning: 3(->ListItems)] Requirements Synthesis 列の説明に疑義がある [552:Requirements Synthesis]
  }
  check_Semantics() {
    if (!this.isDescribed(this.items['Output Semantics'])) {
      if (this.items['Region Category'] == 'input' || this.items['Region Category'] == 'input/output') {
        // Region Category列が「input」or「input/output」にも関わらず、Output Semantics列が記述されていない [571:Output Semantics]
        this.errorNums['Output Semantics'].push(571);
      } else if (this.isDescribed(this.items['Requirements'])) {
        // Requirements 列が記述されているにもかかわらず、Output Semantics列が記述されていない [572:Output Semantics]
        this.errorNums['Output Semantics'].push(572);
      } else {
        // [Warning] Semanticsが記述されていない [570:Semantics]
        this.warningNums['Output Semantics'].push(570);
      }
    }

  }
}
