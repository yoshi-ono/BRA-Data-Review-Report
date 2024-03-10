/*
 *  FRG エンティティ クラス
 */
class entityFRG extends entityBasic {
  constructor(header, data, row, reviewItems) {
    super(header, data, row, reviewItems);
    this.check();
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  check() {
    this.check_Circuit_ID();
    this.check_Projected_Circuits();
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
    if (!this.isDescribed(this.items['Circuit ID'])) {
      this.errorNums['Circuit ID'].push(4001);
    } else {
      // Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [401:Circuit ID]
      if (!this.isDefinedCircuit(this.items['Circuit ID']))
        this.errorNums['Circuit ID'].push(401);

      // 異なるレコードに同じCircuit IDが記述されている． [402:Circuit ID]
      var rows = g_bra_data.frg.searchItem('Circuit ID', this.items['Circuit ID']);
      if (rows.length > 1)
        this.errorNums['Circuit ID'].push(402);

      // [Manual Warning: 3] BIF Image に記述された Circuit IDと一致しない。 [420:Circuit ID]
      // [Manual Warning: 3] BIF Image に記述された Uniform Circuit がすべて用いられていない [422:Circuit ID]
    }
  }
  check_Projected_Circuits() {
    if (!this.isDescribed(this.items['Projected Circuits'])) {
      this.errorNums['Projected Circuits'].push(4002);
    } else {
      // （列挙）Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [403:Projected Circuits]
      if (!this.isDefinedCircuits(this.items['Projected Circuits']))
        this.errorNums['Projected Circuits'].push(403);

      // [Manual Warning: 3] BIF Image に記述された出力先のCircuit IDと一致しない。 [421:Projected Circuits]
    }
  }
  check_Node_ID() {
    if (!this.isDescribed(this.items['Node ID'])) {
      this.errorNums['Node ID'].push(4003);
    } else {
      // 先頭が「R.」「C.」「U.」（あるいは「プロジェクト名:Node ID」）のいずれかで始まっていない [411:Node ID]
      // [Manual Error: 1] FRGの図面中に記述されたNode IDと一致しない [415:Node ID]
    }
  }
  check_Sub_Nodes() {
    if (this.isDescribed(this.items['Sub Nodes'])) {
      // （列挙）Node ID列にないNode IDが記載されている [414:Sub Nodes]
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

      // （不要？）先頭が「R.」「C.」「U.」（あるいは「プロジェクト名:Node ID」）のいずれかで始まっていない [413:Sub Nodes]
      // [Manual Error: 1] FRGの図面中に記述されたNode IDと一致しない [416:Sub Nodes]
      // [Manual Error: 1] FRGの図面中で依存関係にある Sub Nodes と比較したときに、記載された Sub Nodes に過不足がある [417:Sub Nodes]
    }
  }
  check_Capability() {
    if (this.isDescribed(this.items['Capability'])) {
      // [Manual Warning: 3] Motif以外のCapabilityが用いられている [443:Capability]
      //  [444:Capability]
      //  [445:Capability]
    }
  }
  check_Requirements() {
    // Requirements が記述されていない [446:Requirements]
    if (!this.isDescribed(this.items['Requirements'])) {
      this.errorNums['Requirements'].push(446);
    } else {
      // 「Node ID:説明文」の記法で記述されていない [447:Requirements]
      var val = this.items['Requirements'].trim();
      var searchString = this.items['Node ID'] + ":";
      if (!val.startsWith(searchString))
        this.errorNums['Requirements'].push(447);
    }
  }
  check_Semantics() {
    // Semanticsが記述されていない [448:Semantics]
      if (!this.isDescribed(this.items['Semantics'])) {
      this.errorNums['Semantics'].push(448);
    } else {
      //  [449:Semantics]
    }
  }
  check_Capability_Realization_by_Implementation() {
    // Capability列が記述されているが、Capability Realization by Implementationが記述されていない [450:Capability Realization by Implementation]
    if (this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Capability Realization by Implementation']))
        this.errorNums['Capability Realization by Implementation'].push(450);

      //  [451:Capability Realization by Implementation]
    }
  }
  check_Capability_Synthesis() {
    if (!this.isDescribed(this.items['Capability Synthesis'])) {
      this.errorNums['Capability Synthesis'].push(4007);
    } else {
      //  [452:Capability Synthesis]
      //  [453:Capability Synthesis]
    }
  }
  check_Requirements_Realization_by_Interface() {
    // Requirements Realization by Interfafce が記述されていない [454:Requirements Realization by Interface]
    if (!this.isDescribed(this.items['Requirements Realization by Interface'])) {
      this.errorNums['Requirements Realization by Interface'].push(454);
    } else {
      //  [455:Requirements Realization by Interface]
    }
  }
  check_Requirements_Endorsement_by_Capability() {
    // Capability列が記述されているが、Requirements Endorsement by Capabilityが記述されていない [456:Requirements Endorsement by Capability]
    if (this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Requirements Endorsement by Capability']))
        this.errorNums['Requirements Endorsement by Capability'].push(456);

      //  [457:Requirements Endorsement by Capability]
    }
  }
  check_Requirements_Synthesis() {
    // Requirements Synthesis が記述されていない [458:Requirements Synthesis]
    if (!this.isDescribed(this.items['Requirements Synthesis'])) {
      this.errorNums['Requirements Synthesis'].push(458);
    } else {
      //  [459:Requirements Synthesis]
    }
  }
  check_Capability_Realization_by_Implementation_LLM() {
    // [Warning] Capability の記述があるが、Capability Realization by Implementation (LLM) が記述されていない [465:Capability Realization by Implementation (LLM)]
    if (this.isDescribed(this.items['Capability'])) {
      if (!this.isDescribed(this.items['Capability Realization by Implementation (LLM)'])) {
        this.warningNums['Capability Realization by Implementation (LLM)'].push(465);
      }
    }

    if (this.isDescribed(this.items['Capability Realization by Implementation (LLM)'])) {
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
