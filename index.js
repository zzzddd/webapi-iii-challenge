// code away!

require("dotenv").config();

const server = require("./server");

const port = process.env.PORT || 9000;
server.listen(port, () =>
  console.log(`\n*** Serveer running on http://localhost:${port} ***\n`)
);