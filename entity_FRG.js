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
    this.check_Subnodes();
    this.check_Circuit_ID();
    this.check_Projected_Circuits();

    this.check_Capability_and_Mechanism_Review_LLM();
    this.check_Capability_and_Mechanism();

    this.check_Implementation_of_Uniform_Circuit();
    this.check_Capability();
    this.check_Mechanism_Synthesis_Review_LLM();

    this.check_Requirements_Realization_by_Interface_Review_LLM();
    this.check_Requirements_Realization_by_Interface();

    this.check_Requirements_Endorsement_by_Capability_Review_LLM();

    this.check_Requirements();
    this.check_Requirements_Review_LLM();

    this.check_Output_Semantics();
    this.check_Output_Semantics_Review_LLM();
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
  check_Subnodes() {
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
      var circuits = this.items['Projected Circuits'];

      // Projected Circuitsに列挙されたCircuit IDの終端が";"になっていない。 [431:Projected Circuits]
      if (!this.hasTerminalSymbol(circuits))
        this.errorNums['Projected Circuits'].push(431);

      // （列挙）Circuits シートに登録されているCircuit ID以外のCircuit IDが記述されている． [430:Projected Circuits]
      if (!this.isDefinedCircuits(circuits))
        this.errorNums['Projected Circuits'].push(430);

      // 記載されているCircuit IDが、FRGシートのCircuit ID列に記載されていない [433:Projected Circuits]
      if (isFinite(circuits))
        circuits = String(circuits);

      var list = circuits.split(';');
      for (var circuit of list) {
        if (this.isDescribed(circuit)) {
          var rows = g_bra_data.frg.searchItem('Circuit ID', circuit.trim());
          if (rows.length == 0) {
            this.errorNums['Projected Circuits'].push(433);
            break;
          }
        }
      }

      // [Manual Warning: 3(->ListItems)] BIF Image に記述された出力先のCircuit IDと一致しない。 [432:Projected Circuits]
    }
  }

  check_Capability_and_Mechanism_Review_LLM() {
    // [Warning] 記述されていない [441:Capability&Mechanism Review (LLM)]
    if (!this.isDescribed(this.items['Capability&Mechanism Review (LLM)'])) {
      this.warningNums['Capability&Mechanism Review (LLM)'].push(441);
    } else {
      // 「NG:」であると評価されている [440:Capability&Mechanism Review (LLM)]
      var val = this.items['Capability&Mechanism Review (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Capability&Mechanism Review (LLM)'].push(440);
    }
  }

  check_Capability_and_Mechanism() {
    var c_and_m = this.items['Capability&Mechanism'];

    if (isFinite(c_and_m))
      c_and_m = String(c_and_m);

    const splitter = "<<mechanism to realize the capability>>";
    const grainest_mechanism = "<<mechanism realized by grainest coding scheme>>";

    // <<mechanism realized by grainest coding scheme>>が記述されていない [448:Capability&Mechanism]
    if (!c_and_m.includes(grainest_mechanism)) {
      this.errorNums['Capability&Mechanism'].push(448);
    } else {
      // <<mechanism realized by grainest coding scheme>>後が空欄になっている [449:Capability&Mechanism]
      var grainestParts = c_and_m.split(grainest_mechanism);
      if (grainestParts[1].trim() == "") {
        this.warningNums['Capability&Mechanism'].push(449);
      }
    }

    if (c_and_m.includes(splitter)) {
      var capab_mecha = c_and_m.split(splitter);

      // <<mechanism to realize the capability>>前が空欄になっている [451:Capability&Mechanism]
      if (capab_mecha[0].trim() == "")
        this.errorNums['Capability&Mechanism'].push(451);

      // <<mechanism to realize the capability>>後が空欄になっている [452:Capability&Mechanism]
      var mechanism = capab_mecha[1].split(grainest_mechanism)[0];
      if (mechanism.trim() == "")
        this.errorNums['Capability&Mechanism'].push(452);
    } else {
      // <<mechanism to realize the capability>>が記述されていない [450:Capability&Mechanism]
      this.errorNums['Capability&Mechanism'].push(450);
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
    // [Manual Warning: 3(->ListItems)] Motif以外のCapabilityが用いられている [470:Capability]
    // [Manual Error: 1] Output semanticsの内容が書かれている [471:Capability]
    // [Manual Warning: 3(->ListItems)] Capability に Output semantics の情報を入れても Requirements になっていない [472:Capability]
  }

  check_Mechanism_Synthesis_Review_LLM() {
    // [Warning] 記述がされていない [481:Mechanism Synthesis Review (LLM)]
    if (!this.isDescribed(this.items['Mechanism Synthesis Review (LLM)'])) {
      this.warningNums['Mechanism Synthesis Review (LLM)'].push(481);
    } else {
      // 「NG:」であると評価されている [480:Mechanism Synthesis Review (LLM)]
      var val = this.items['Mechanism Synthesis Review (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Mechanism Synthesis Review (LLM)'].push(480);
    }
  }

  check_Requirements_Realization_by_Interface_Review_LLM() {
    // [Warning] 記述がされていない [501:Requirements Realization by Interface Review (LLM)]
    if (!this.isDescribed(this.items['Requirements Realization by Interface Review (LLM)'])) {
      this.warningNums['Requirements Realization by Interface Review (LLM)'].push(501);
    } else {
      // 「NG:」であると評価されている [500:Requirements Realization by Interface Review (LLM)]
      var val = this.items['Requirements Realization by Interface Review (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Realization by Interface Review (LLM)'].push(500);
    }
  }
  check_Requirements_Realization_by_Interface() {
    // Requirements列が記述されているが、Requirements Realization by Interfafce が記述されていない [510:Requirements Realization by Interface]
    if (this.isDescribed(this.items['Requirements'])) {
      if (!this.isDescribed(this.items['Requirements Realization by Interface']))
        this.errorNums['Requirements Realization by Interface'].push(510);
    }
  }

  check_Requirements_Endorsement_by_Capability_Review_LLM() {
    // [Warning] 記述がされていない [521:Requirements Endorsement by Capability Review (LLM)]
    if (!this.isDescribed(this.items['Requirements Endorsement by Capability Review (LLM)'])) {
      this.warningNums['Requirements Endorsement by Capability Review (LLM)'].push(521);
    } else {
      // 「NG:」であると評価されている [520:Requirements Endorsement by Capability Review (LLM)]
      var val = this.items['Requirements Endorsement by Capability Review (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Endorsement by Capability Review (LLM)'].push(520);
    }
  }

  check_Requirements() {
    if (!this.isDescribed(this.items['Requirements'])) {
      // if (this.NodeID_Prefix == 'R') {
      //   // Node ID列の接頭辞で「R.」を指定しているが、Requirements 列が記述されていない [542:Requirements]
      //   this.errorNums['Requirements'].push(542);
      // } else {
      //   // [Warning] Requirements が記述されていない [541:Requirements]
      //   this.warningNums['Requirements'].push(541);
      // }

      // Requirements が記述されていない [541:Requirements]
      this.errorNums['Requirements'].push(541);
    } else {
      // // 「Node ID:説明文」の記法で記述されていない [540:Requirements]
      // var val = this.items['Requirements'].trim();
      // var searchString = this.items['Node ID'] + ":";
      // if (!val.startsWith(searchString))
      //   this.errorNums['Requirements'].push(540);
    }
  }
  check_Requirements_Review_LLM() {
    // [Warning] 記述がされていない [551:Requirements Review (LLM)]
    if (!this.isDescribed(this.items['Requirements Review (LLM)'])) {
      this.warningNums['Requirements Review (LLM)'].push(551);
    } else {
      // 「NG:」であると評価されている [550:Requirements Review (LLM)]
      var val = this.items['Requirements Review (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Requirements Review (LLM)'].push(550);
    }
  }

  check_Output_Semantics() {
    // Output Semanticsが記述されていない [560:Output Semantics]
    if (!this.isDescribed(this.items['Output Semantics'])) {
      this.errorNums['Output Semantics'].push(560);
    } else {
      var output_semantics = this.items['Output Semantics'];

      if (isFinite(output_semantics))
        output_semantics = String(output_semantics);

      var list = output_semantics.split(';');
      const regex = /^\[(?<circuitId>[^\]]+)\](?<description>.*);?$/;
      var uniformCircuits = this.items['Uniform Circuits'];
      var listCircuits = uniformCircuits.split(';').map(function (value) { return value.trim(); });

      for (var text of list) {
        if (text == "")
          continue;

        var match = text.trim().match(regex);
        if (match == null) {
          // 「[Circuit ID] 説明;」の記法で記述されていない [562:Output Semantics]
          this.errorNums['Output Semantics'].push(562);
        } else {
          var circuitId = match.groups.circuitId;
          var description = match.groups.description;

          // Output Semanticsの「説明」に"[", "]", ";"が用いられている [561:Output Semantics]
          if (description.includes("[") || description.includes("]") || description.includes(";"))
            this.errorNums['Output Semantics'].push(561);

          // 同じレコードのAH列（Uniform Circuit）に含まれないCircuit IDが用いられている [563:Output Semantics]
          if (!listCircuits.includes(circuitId))
            this.errorNums['Output Semantics'].push(563);
        }
      }
    }
  }
  check_Output_Semantics_Review_LLM() {
    // [Warning] 記述がされていない [571:Output Semantics Review (LLM)]
    if (!this.isDescribed(this.items['Output Semantics Review (LLM)'])) {
      this.warningNums['Output Semantics Review (LLM)'].push(571);
    } else {
      // 「NG:」であると評価されている [570:Output Semantics Review (LLM)]
      var val = this.items['Output Semantics Review (LLM)'].trim();
      if (val.startsWith("NG:"))
        this.errorNums['Output Semantics Review (LLM)'].push(570);
    }
  }
}
