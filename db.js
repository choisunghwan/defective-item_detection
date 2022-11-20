var Connection = require("tedious").Connection;
var config = {
  server: "49.247.6.52", //update me
  authentication: {
    type: "default",
    options: {
      userName: "user2", //update me
      password: "user2", //update me
    },
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: false, // 오류 발생시 추가 한 부분!
    database: "DB2", //update me
  },
};
var connection = new Connection(config);
connection.on("connect", function (err) {
  // If no error, then good to proceed.
  console.log("Connected");
  executeStatement1();
});

connection.connect();

var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;

function executeStatement1() {
  request = new Request(
    "INSERT dbo.TB_PASSENGER_CP (UP_CP) VALUES ('3');",
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  request.addParameter("Name", TYPES.NVarChar, "SQL Server Express 2014");
  request.addParameter("Number", TYPES.NVarChar, "SQLEXPRESS2014");
  request.addParameter("Cost", TYPES.Int, 11);
  request.addParameter("Price", TYPES.Int, 11);
  request.on("row", function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        console.log("Product id of inserted item is " + column.value);
      }
    });
  });

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    connection.close();
  });
  connection.execSql(request);
}
