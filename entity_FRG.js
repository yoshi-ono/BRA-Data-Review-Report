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
    this.check_Implementation();
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
    // Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [401:Circuit ID]
    // 異なるレコードに同じCircuit IDが記述されている． [402:Circuit ID]
    // BIF Image に記述された Circuit IDと一致しない。 [420:Circuit ID]
    // BIF Image に記述された Uniform Circuit がすべて用いられていない [422:Circuit ID]
    if (!this.isDescribed(this.items['Circuit ID'])) {
      this.errorNums['Circuit ID'].push(N);
    } else {
    }
  }
  check_Projected_Circuits() {
    // Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [403:Projected Circuits]
    // BIF Image に記述された出力先のCircuit IDと一致しない。 [421:Projected Circuits]


    if (!this.isDescribed(this.items['Projected Circuits'])) {
      this.errorNums['Projected Circuits'].push(N);
    } else {
    }
  }
  check_Node_ID() {
    // 先頭が「R.」「C.」「U.」（あるいは「プロジェクト名:Node ID」）のいずれかで始まっていない [411:Node ID]
    // FRGの図面中に記述されたNode IDと一致しない [415:Node ID]


    if (!this.isDescribed(this.items['Node ID'])) {
      this.errorNums['Node ID'].push(N);
    } else {
    }
  }
  check_Sub_Nodes() {
    // 先頭が「R.」「C.」「U.」（あるいは「プロジェクト名:Node ID」）のいずれかで始まっていない [413:Sub Nodes]
    // Node ID列にないNode IDが記載されている [414:Sub Nodes]
    // FRGの図面中に記述されたNode IDと一致しない [416:Sub Nodes]
    // FRGの図面中で依存関係にある Sub Nodes と比較したときに、記載された Sub Nodes に過不足がある [417:Sub Nodes]
    if (!this.isDescribed(this.items['Sub Nodes'])) {
      this.errorNums['Sub Nodes'].push(N);
    } else {
    }
  }
  check_Implementation() {
    //  [442:Implementation]



    if (!this.isDescribed(this.items['Implementation'])) {
      this.errorNums['Implementation'].push(N);
    } else {
    }
  }
  check_Capability() {
    // Motif以外のCapabilityが用いられている [443:Capability]
    //  [444:Capability]
    //  [445:Capability]

    if (!this.isDescribed(this.items['Capability'])) {
      this.errorNums['Capability'].push(N);
    } else {
    }
  }
  check_Requirements() {
    // Requirements が記述されていない [446:Requirements]
    // 「Node ID:説明文」の記法で記述されていない [447:Requirements]


    if (!this.isDescribed(this.items['Requirements'])) {
      this.errorNums['Requirements'].push(N);
    } else {
    }
  }
  check_Semantics() {
    // Semanticsが記述されていない [448:Semantics]
    //  [449:Semantics]


    if (!this.isDescribed(this.items['Semantics'])) {
      this.errorNums['Semantics'].push(N);
    } else {
    }
  }
  check_Capability_Realization_by_Implementation() {
    // Capability列が記述されているが、Capability Realization by Implementationが記述されていない [450:Capability Realization by Implementation]
    //  [451:Capability Realization by Implementation]


    if (!this.isDescribed(this.items['Capability Realization by Implementation'])) {
      this.errorNums['Capability Realization by Implementation'].push(N);
    } else {
    }
  }
  check_Capability_Synthesis() {
    //  [452:Capability Synthesis]
    //  [453:Capability Synthesis]


    if (!this.isDescribed(this.items['Capability Synthesis'])) {
      this.errorNums['Capability Synthesis'].push(N);
    } else {
    }
  }
  check_Requirements_Realization_by_Interface() {
    // Requirements Realization by Interfafce が記述されていない [454:Requirements Realization by Interface]
    //  [455:Requirements Realization by Interface]


    if (!this.isDescribed(this.items['Requirements Realization by Interface'])) {
      this.errorNums['Requirements Realization by Interface'].push(N);
    } else {
    }
  }
  check_Requirements_Endorsement_by_Capability() {
    // Capability列が記述されているが、Requirements Endorsement by Capabilityが記述されていない [456:Requirements Endorsement by Capability]
    //  [457:Requirements Endorsement by Capability]


    if (!this.isDescribed(this.items['Requirements Endorsement by Capability'])) {
      this.errorNums['Requirements Endorsement by Capability'].push(N);
    } else {
    }
  }
  check_Requirements_Synthesis() {
    // Requirements Synthesis が記述されていない [458:Requirements Synthesis]
    //  [459:Requirements Synthesis]


    if (!this.isDescribed(this.items['Requirements Synthesis'])) {
      this.errorNums['Requirements Synthesis'].push(N);
    } else {
    }
  }
  check_Capability_Realization_by_Implementation_LLM() {
    // 「NG:」であると評価されている [460:Capability Realization by Implementation (LLM)]
    // Capability の記述があるが、Capability Realization by Implementation (LLM) が記述されていない [465:Capability Realization by Implementation (LLM)]


    if (!this.isDescribed(this.items['Capability Realization by Implementation (LLM)'])) {
      this.errorNums['Capability Realization by Implementation (LLM)'].push(N);
    } else {
    }
  }
  check_Capability_Synthesis_LLM() {
    // 「NG:」であると評価されている [461:Capability Synthesis (LLM)]
    // 記述がされていない [466:Capability Synthesis (LLM)]


    if (!this.isDescribed(this.items['Capability Synthesis (LLM)'])) {
      this.errorNums['Capability Synthesis (LLM)'].push(N);
    } else {
    }
  }
  check_Requirements_Realization_by_Interface_LLM() {
    // 「NG:」であると評価されている [462:Requirements Realization by Interface (LLM)]
    // 記述がされていない [467:Requirements Realization by Interface (LLM)]


    if (!this.isDescribed(this.items['Requirements Realization by Interface (LLM)'])) {
      this.errorNums['Requirements Realization by Interface (LLM)'].push(N);
    } else {
    }
  }
  check_Requirements_Endorsement_by_Capability_LLM() {
    // 「NG:」であると評価されている [463:Requirements Endorsement by Capability (LLM)]
    // 記述がされていない [468:Requirements Endorsement by Capability (LLM)]


    if (!this.isDescribed(this.items['Requirements Endorsement by Capability (LLM)'])) {
      this.errorNums['Requirements Endorsement by Capability (LLM)'].push(N);
    } else {
    }
  }
  check_Requirements_Synthesis_LLM() {
    // 「NG:」であると評価されている [464:Requirements Synthesis (LLM)]
    // 記述がされていない [469:Requirements Synthesis (LLM)]


    if (!this.isDescribed(this.items['Requirements Synthesis (LLM)'])) {
      this.errorNums['Requirements Synthesis (LLM)'].push(N);
    } else {
    }
  }

}