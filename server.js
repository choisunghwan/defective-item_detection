var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;
var WebSocketServer = require("ws").Server,
wss = new WebSocketServer({ port: 8001 });
CLIENTS = [];
updown = [];
fireDetector = [];
objectDetector = [];


wss.on("connection", function (ws) {
  
  
  ws.on("message", function (message) {
    console.log("received: %s", message);
    var jsonData = JSON.parse(message);
    
    if (jsonData[0].req == "con") {
      CLIENTS.push(ws);
      console.log(updown);
      ws.send(JSON.stringify(updown));
      ws.send(JSON.stringify(fireDetector));
    } else if (jsonData[0].req == "up") {
      console.log("send: " + message);
      updownInfo = {};
      updownInfo["req"] = jsonData[0].req;
      updownInfo["upCnt"] = jsonData[0].upCnt;
      updown.push(updownInfo);
      sendAll(message);
    } else if (jsonData[0].req == "down") {
      console.log("send: " + message);
      updownInfo = {};
      updownInfo["req"] = jsonData[0].req;
      updownInfo["downCnt"] = jsonData[0].downCnt;
      updown.push(updownInfo);
      sendAll(message);
    } else if (jsonData[0].req == "passengerClose") {
      console.log("send: " + message);
      updownInfo = {};
      updownInfo["req"] = jsonData[0].req;
      updown.push(updownInfo);
      sendAll(message);
      updown = [];
    } else if (jsonData[0].req == "onFire") {
      console.log("send: " + message);
      fireDetectorInfo = {};
      fireDetectorInfo["req"] = jsonData[0].req;
      fireDetectorInfo["contents"] = jsonData[0].contents;
      fireDetector.push(fireDetectorInfo);
      sendAll(message);
    } else if (jsonData[0].req == "onSmoke") {
      console.log("send: " + message);
      fireDetectorInfo = {};
      fireDetectorInfo["req"] = jsonData[0].req;
      fireDetectorInfo["contents"] = jsonData[0].contents;
      fireDetector.push(fireDetectorInfo);
      sendAll(message);
    } else if (jsonData[0].req == "offFire") {
      console.log("send: " + message);
      fireDetectorInfo = {};
      fireDetectorInfo["req"] = jsonData[0].req;
      fireDetectorInfo["contents"] = jsonData[0].contents;
      fireDetector.push(fireDetectorInfo);
      sendAll(message);
    } else if (jsonData[0].req == "offFireDetector") {
      console.log("send: " + message);
      fireDetectorInfo = {};
      fireDetectorInfo["req"] = jsonData[0].req;
      fireDetectorInfo["contents"] = jsonData[0].contents;
      fireDetector.push(fireDetectorInfo);
      sendAll(message);
      fireDetector = [];
    } else if (jsonData[0].req == "openDetection") {
      console.log("send: " + message);
      objectInfo = {};
      objectInfo["req"] = jsonData[0].req;
      objectInfo["objectDate"] = jsonData[0].objectDate;
      objectInfo["objectName"] = jsonData[0].objectName;
      objectDetector.push(objectInfo);
      executeStatement2();
      //console.log(objectDetector[0].objectCnt);
      //sendAll(message);
      objectDetector = [];
    } else if (jsonData[0].req == "defectiveObj_LOG") {
      //console.log("send: " + message);
      objectInfo = {};
      objectInfo["req"] = jsonData[0].req;
      objectInfo["objectLog"] = jsonData[0].objectLog;
      objectInfo["objectName"] = jsonData[0].objectName;
      objectInfo["objectDefCnt"] = jsonData[0].objectDefCnt;
      objectDetector.push(objectInfo);
      executeStatement1();

      //console.log(objectDetector[0].objectCnt);
      //sendAll(message);
      objectDetector = [];
    } else if (jsonData[0].req == "defectiveAllObj") {
      //console.log("send: " + message);
      objectInfo = {};
      objectInfo["req"] = jsonData[0].req;
      objectInfo["objectAllCnt"] = jsonData[0].objectAllCnt;
      objectDetector.push(objectInfo);
      executeStatement3();
      //console.log(objectDetector[0].objectCnt);
      //sendAll(message);
      objectDetector = [];
    } else if (jsonData[0].req == "defectiveObj") {
      //console.log("send: " + message);
      objectInfo = {};
      objectInfo["req"] = jsonData[0].req;
      objectInfo["objectDefCnt"] = jsonData[0].objectNDefCnt;
      objectDetector.push(objectInfo);
      objectDetector = [];
    }
  });
  
  //WebSocket 연결 종료
  ws.on("close", function (message) {
    console.log("close");
    for (var i = 0; i < CLIENTS.length; i++) {
      if (CLIENTS[i] == ws) {
        CLIENTS.splice(i, 1);
      }
    }
  });

  //ws.send("NEW USER JOINED");
  ws.send(JSON.stringify("이선호등장"));
});

function sendAll(message) {
  for (var i = 0; i < CLIENTS.length; i++) {
    //console.log(CLIENTS[i].id);
    CLIENTS[i].send("" + message);
  }
}

function sendAllExceptMe(message, ws) {
  for (var i = 0; i < CLIENTS.length; i++) {
    if (CLIENTS[i] != ws) {
      //console.log("클라이언트 " + CLIENTS[i].id); // userName
      CLIENTS[i].send("" + message);
    }
  }
}

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
  //executeStatement1();
});
connection.connect();

//불량 사과 로그
function executeStatement1() {
  // console.log("db 실행");

  request = new Request(
    "INSERT INTO dbo.TB_DEFECTIVE_DETECT_LOG_CP (DEFECTIVE_DETECT_LOG_TIME_CP,DEFECTIVE_DETECT_NAME_CP,DEFECTIVE_DETECT_COUNT_CP) VALUES ('" +
      objectDetector[0].objectLog +
      "','" +
      objectDetector[0].objectName +
      "','" +
      objectDetector[0].objectDefCnt +
      "');",

    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  connection.execSql(request);
}

//물품 감지 테이블 INSERT
function executeStatement2() {
  // console.log("db 실행");

  request = new Request(
    "INSERT INTO dbo.TB_DEFECTIVE_DETECT_CP (DETECT_TIME_CP,DETECT_NAME_CP,DETECT_COUNT_CP) VALUES ('" +
      objectDetector[0].objectDate +
      "','" +
      objectDetector[0].objectName +
      "','0');",

    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  connection.execSql(request);
}

//물품 감지 테이블 총 사과 수 UPDATE
function executeStatement3() {
  // console.log("db 실행");

  request = new Request(
    "UPDATE dbo.TB_DEFECTIVE_DETECT_CP SET DETECT_COUNT_CP='" +
      objectDetector[0].objectAllCnt +
      "' WHERE DETECT_ID_CP = '1';",

    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  connection.execSql(request);
}

//물품 감지 테이블 불량 사과 UPDATE
function executeStatement4() {
  // console.log("db 실행");

  request = new Request(
    "UPDATE dbo.TB_DEFECTIVE_DETECT_CP SET DETECT_DEF_COUNT_CP='" +
      objectDetector[0].objectDefCnt +
      "' WHERE DETECT_ID_CP = '1';",

    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  connection.execSql(request);
}

function exitDB() {
  request.on("requestCompleted", function (rowCount, more) {
    connection.close();
    console.log("DB close");
  });
  //connection.execSql(request);
}
// Close the connection after the final event emitted by the request, after the callback passes
