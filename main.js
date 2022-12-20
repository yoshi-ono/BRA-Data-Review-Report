function main() {
  setting();

  var references = new hcdReferences(7);
  references.review();
  references.report(11);

  var circuits = new hcdCircuits(21);
  circuits.review();
  circuits.report(17);

  var connections = new hcdConnections(70);
  connections.review();
  connections.report(23);
}
