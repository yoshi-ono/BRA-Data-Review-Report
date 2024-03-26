/*
 *  FRG エンティティ クラス
 */
class entityFRG extends entityBasic {
  constructor(header, data, row, reviewItems) {
    super(header, data, row, reviewItems);
    this.check();
  }

  isCorrectNodeId(nodeId)
  {
    var nodeName = nodeId;
    var indexPName = nodeId.indexOf(":");

    // 先頭が「R.｜C. ｜A.｜U.」（あるいは「プロジェクト名:R.｜C.｜A.｜U.」）のいずれかで始まっていない
    // ※プロジェクト名は、大文字／小文字／数字が使える [411:Node ID]
    if (indexPName >= 0) {
      var projectName = nodeId.slice(0, indexPName);  // 先頭がプロジェクト名
      nodeName = nodeId.slice(indexPName + 1);
      var regex = /^[0-9a-zA-Z]+$/;
      if (regex.exec(projectName) == null) {
        Logger.log("Node ID プロジェクト名エラー：" + projectName);
        return 411;
      }
    }

    var nodeNames = nodeName.split(".");
    if (nodeNames.length < 2) {
      Logger.log("Node ID \".\"が含まれていない：" + nodeName);
      return 411;
    }

    if (nodeNames[0] != 'R' && nodeNames[0] != 'C' && nodeNames[0] != 'A' && nodeNames[0] != 'U') {
      Logger.log("Node ID 先頭文字エラー：" + nodeNames[0]);
      return 411;
    }

    // 先頭の「R.｜C.｜A.｜U.」（あるいは「プロジェクト名:R.｜C.｜A.｜U.」）に続く文字がケバブケースではない。
    // ※ケバブケースは、大文字／小文字／数字／ハイフンが使える [412:Node ID]
    var regex = /^[0-9a-zA-Z-]+$/;
    if (regex.exec(nodeNames[1]) == null) {
      Logger.log("Node ID ケバブケースではない：" + nodeNames[1]);
      return 412;
    }

    return 0;
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  check() {
    this.check_Circuit_ID();
    this.check_Projected_Circuits();
    this.check_Implementation_of_Uniform_Circuit();
    this.check_Node_ID();
    this.check_Sub_Nodes();
    this.check_Capability();
    this.check_Requirements();
    this.check_Semantics();
    this.check_Capability_Realization_by_Implementation();
    this.check_Capability_Synthesis();
    this.check_Requirements_Realization_by_Interface();
    this.check_Requirements_Endorsement_by_Capability();
    this.check_Requirements_Synthesis();
    this.check_Capability_Realization_by_Implementation_LLM();
    this.check_Capability_Synthesis_LLM();
    this.check_Requirements_Realization_by_Interface_LLM();
    this.check_Requirements_Endorsement_by_Capability_LLM();
    this.check_Requirements_Synthesis_LLM();
  }

  check_Circuit_ID() {
    if (this.isDescribed(this.items['Circuit ID'])) {
      // Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [401:Circuit ID]
      if (!this.isDefinedCircuit(this.items['Circuit ID']))
        this.errorNums['Circuit ID'].push(401);

      // 異なるレコードに同じCircuit IDが記述されている． [402:Circuit ID]
      var rows = g_bra_data.frg.searchItem('Circuit ID', this.items['Circuit ID']);
      if (rows.length > 1)
        this.errorNums['Circuit ID'].push(402);

      // [Manual Warning: 3(->ListItems)] BIF Image に記述された Circuit IDと一致しない。 [420:Circuit ID]
      // [Manual Warning: 3(->ListItems)] BIF Image に記述された Uniform Circuit がすべて用いられていない [422:Circuit ID]
    }
  }
  check_Projected_Circuits() {
    if (this.isDescribed(this.items['Projected Circuits'])) {
      // （列挙）Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [403:Projected Circuits]
      if (!this.isDefinedCircuits(this.items['Projected Circuits']))
        this.errorNums['Projected Circuits'].push(403);

      // [Manual Warning: 3(->ListItems)] BIF Image に記述された出力先のCircuit IDと一致しない。 [421:Projected Circuits]
    }
  }
  check_Implementation_of_Uniform_Circuit() {
    // Sub Nodes列が記述されていないが、Implementation of Uniform Circuitが記述されていない [404:Implementation of Uniform Circuit]
    if (!this.isDescribed(this.items['Sub Nodes'])) {
      if (!this.isDescribed(this.items['Implementation of Uniform Circuit'])) {
        this.errorNums['Implementation of Uniform Circuit'].push(404);
      }
    }
    // Sub Nodes列が記述されているにもかかわらず、Implementation of Uniform Circuitが記述されている [405:Implementation of Uniform Circuit]
    else {
      if (this.isDescribed(this.items['Implementation of Uniform Circuit'])) {
        this.errorNums['Implementation of Uniform Circuit'].push(405);
      }
    }
  }
  check_Node_ID() {
    // Node ID が記述されていない。 [410:Node ID]
    if (!this.isDescribed(this.items['Node ID'])) {
      this.errorNums['Node ID'].push(410);
    } else {
      var errorCode = isCorrectNodeId(this.items['Node ID']);
      if (errorCode > 0) {
        this.errorNums['Node ID'].push(errorCode);
      }

      // [Manual Error: 1] FRGの図面中に記述されたNode IDと一致しない [415:Node ID]
    }
  }
  check_Sub_Nodes() {
    if (this.isDescribed(this.items['Sub Nodes'])) {
      // Sub Nodesに列挙されたNode IDの何れかが、Node IDとして定義されていない。 [414:Sub Nodes]
      var nodes = this.items['Sub Nodes'];
      if (isFinite(nodes))
        nodes = String(nodes);
      
      var list = nodes.split(';');
      for (var n of list) {
        if (this.isDescribed(n)) {
          var rows = g_bra_data.frg.searchItem('Node ID', n.trim());
          if (rows.length == 0) {
            this.errorNums['Sub Nodes'].push(414);
            break;
          }
        }
      }

      // [Manual Error: 1] FRGの図面中に記述されたNode IDと一致しない [416:Sub Nodes]
      // [Manual Error: 1] FRGの図面中で依存関係にある Sub Nodes と比較したときに、記載された Sub Nodes に過不足がある [417:Sub Nodes]
    }
  }
  check_Capability() {
    // [Manual Warning: 3(->ListItems)] Motif以外のCapabilityが用いられている [443:Capability]
  }
  check_Requirements() {
    // [Warning] Requirements が記述されていない [446:Requirements]
    if (!this.isDescribed(this.items['Requirements'])) {
      this.warningNums['Requirements'].push(446);
    } else {
      // 「Node ID:説明文」の記法で記述されていない [447:Requirements]
      var val = this.items['Requirements'].trim();
      var searchString = this.items['Node ID'] + ":";
      if (!val.startsWith(searchString))
        this.errorNums['Requirements'].push(447);
    }
  }
  check_Semantics() {
    // [Warning] Semanticsが記述されていない [448:Semantics]
      if (!this.isDescribed(this.items['Output Semantics'])) {
      this.warningNums['Output Semantics'].push(448);
    }
  }
  check_Capability_Realization_by_Implementation() {
    // Capability列が記述されているが、Capability Realization by Implementationが記述されていない [450:Capability Realization by Implementation]
    if (this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Capability Realization by Implementation']))
        this.errorNums['Capability Realization by Implementation'].push(450);
    }
  }
  check_Capability_Synthesis() {
  }
  check_Requirements_Realization_by_Interface() {
    // Requirements列が記述されているが、Requirements Realization by Interfafce が記述されていない [454:Requirements Realization by Interface]
    if (this.isDescribed(this.items['Requirements'])) {
      if (!this.isDescribed(this.items['Requirements Realization by Interface']))
        this.errorNums['Requirements Realization by Interface'].push(454);
    }
  }
  check_Requirements_Endorsement_by_Capability() {
    // Requirements列とCapability列が記述されているが、Requirements Endorsement by Capabilityが記述されていない [456:Requirements Endorsement by Capability]
    if (this.isDescribed(this.items['Requirements']) && this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Requirements Endorsement by Capability']))
        this.errorNums['Requirements Endorsement by Capability'].push(456);
    }
  }
  check_Requirements_Synthesis() {
    // Requirements列が記述されているが、Requirements Synthesis が記述されていない [458:Requirements Synthesis]
    if (this.isDescribed(this.items['Requirements'])) {
      if (!this.isDescribed(this.items['Requirements Synthesis']))
        this.errorNums['Requirements Synthesis'].push(458);
    }
  }
  check_Capability_Realization_by_Implementation_LLM() {
    // [Warning] 記述されていない [465:Capability Realization by Implementation (LLM)]
    if (!this.isDescribed(this.items['Capability Realization by Implementation (LLM)'])) {
      this.warningNums['Capability Realization by Implementation (LLM)'].push(465);
    } else {
      // 「NG:」であると評価されている [460:Capability Realization by Implementation (LLM)]
      var val = this.items['Capability Realization by Implementation (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Capability Realization by Implementation (LLM)'].push(460);
    }
  }
  check_Capability_Synthesis_LLM() {
    // [Warning] 記述がされていない [466:Capability Synthesis (LLM)]
    if (!this.isDescribed(this.items['Capability Synthesis (LLM)'])) {
      this.warningNums['Capability Synthesis (LLM)'].push(466);
    } else {
      // 「NG:」であると評価されている [461:Capability Synthesis (LLM)]
      var val = this.items['Capability Synthesis (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Capability Synthesis (LLM)'].push(461);
    }
  }
  check_Requirements_Realization_by_Interface_LLM() {
    // [Warning] 記述がされていない [467:Requirements Realization by Interface (LLM)]
    if (!this.isDescribed(this.items['Requirements Realization by Interface (LLM)'])) {
      this.warningNums['Requirements Realization by Interface (LLM)'].push(467);
    } else {
      // 「NG:」であると評価されている [462:Requirements Realization by Interface (LLM)]
      var val = this.items['Requirements Realization by Interface (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Realization by Interface (LLM)'].push(462);
    }
  }
  check_Requirements_Endorsement_by_Capability_LLM() {
    // [Warning] 記述がされていない [468:Requirements Endorsement by Capability (LLM)]
    if (!this.isDescribed(this.items['Requirements Endorsement by Capability (LLM)'])) {
      this.warningNums['Requirements Endorsement by Capability (LLM)'].push(468);
    } else {
      // 「NG:」であると評価されている [463:Requirements Endorsement by Capability (LLM)]
      var val = this.items['Requirements Endorsement by Capability (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Endorsement by Capability (LLM)'].push(463);
    }
  }
  check_Requirements_Synthesis_LLM() {
    // [Warning] 記述がされていない [469:Requirements Synthesis (LLM)]
    if (!this.isDescribed(this.items['Requirements Synthesis (LLM)'])) {
      this.warningNums['Requirements Synthesis (LLM)'].push(469);
    } else {
      // 「NG:」であると評価されている [464:Requirements Synthesis (LLM)]
      var val = this.items['Requirements Synthesis (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Synthesis (LLM)'].push(464);
    }
  }
}
