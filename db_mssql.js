const express = require("express");
const app = express();

app.listen(1433, function () {
  console.log("listening on 8888");
});

// mssql 연동하기
var sql = require("mssql");
var config = {
  user: "user2",
  password: "user2",
  server: "49.247.6.52",
  database: "DB2",
  stream: true,
};

sql.connect(config, function (err) {
  encrypt: false;
  if (err) {
    return console.error("error : ", err);
  }
  console.log("MSSQL 연결 완료");
});

app.get("/", (req, res) => {
  res.send("this is dbconn.js");
});

// insert
app.get("/insert", (req, res) => {
  res.send("this is insert page");

  var request = new sql.Request();
  request.stream = true;

  var q = "insert into student(id, name, grade)\
    values(8, 'ha', 2)";
  request.query(q, (err, recordset) => {
    if (err) {
      consnole.log("query error :", err);
    } else {
      console.log("insert 완료");
    }
  });
});

// update
app.get("/update", (req, res) => {
  res.send("this is update page");

  var request = new sql.Request();
  request.stream = true;

  var q = "update student set grade = 1 where name = 'joe'";
  request.query(q, (err, recordset) => {
    if (err) {
      console.log("query error :", err);
    } else {
      console.log("update 완료");
    }
  });
});
