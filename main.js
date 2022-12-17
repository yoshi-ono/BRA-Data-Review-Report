function main() {
  setting();

  //check_references();

  var circuits = new hcdCircuits(21);
  circuits.review();
  circuits.report(17);

  //var connections = new hcdConnections();
  //connections.review();
  //connections.report();
}
