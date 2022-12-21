function main() {
  setting();

  // Review End Line の取得
  var projectSheet = hcdSpreadsheet.getSheetByName("Project");
  var referencesReviewEL = projectSheet.getRange("B5").getValue();
  var circuitsReviewEL = projectSheet.getRange("B6").getValue();
  var connectionsReviewEL = projectSheet.getRange("B7").getValue();
  Logger.log("References Review End Line: " + referencesReviewEL);
  Logger.log("Circuits Review End Line: " + circuitsReviewEL);
  Logger.log("Connections Review End Line: " + connectionsReviewEL);

  var references = new hcdReferences(referencesReviewEL);
  references.review();
  references.report(11);

  var circuits = new hcdCircuits(circuitsReviewEL);
  circuits.review();
  circuits.report(17);

  var connections = new hcdConnections(connectionsReviewEL);
  connections.review();
  connections.report(23);
}
