const express = require("express"); //importing express module
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express(); //creating app instance
app.use(express.json()); // for parsing application/json

const dbPath = path.join(__dirname, "businessquant.db");

let db = null;

// Initialize DB and Start server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1
app.get("/Api1", async (request, response) => {
  const { ticker } = request.query;
  const getDataQuery = `SELECT *
        FROM 
          sampleData
        WHERE 
          ticker = "${ticker}"`;

  const details = await db.all(getDataQuery);
  response.send(details);
});

//API 2
app.get("/Api2", async (request, response) => {
  const { ticker, column } = request.query;
  // console.log(column)
  const getDataQuery = `SELECT 
        ticker, ${column}
        FROM 
          sampleData
        WHERE 
          ticker = "${ticker}" `;

  const details = await db.all(getDataQuery);
  response.send(details);
});

//API 3
app.get("/Api3", async (request, response) => {
  const { ticker, column, period } = request.query;
  const year = period[0];
  // console.log(column)
  const getDataQuery = `SELECT 
        ${column}
        FROM 
          sampleData
        WHERE 
          ticker = "${ticker}" AND  CAST((substr(date, 7, 4) || "-" || substr(date, 1, 2) || "-" || substr(date, 4, 2)) AS TEXT) >=  DATE('now','-${year} years')`;

  const details = await db.all(getDataQuery);
  response.send(details);
});

//API 4
app.get("/Api4", async (request, response) => {
  const { ticker, column, period } = request.query;
  // console.log(column)
  const year = period[0];
  const getDataQuery = `SELECT 
        ${column}
        FROM 
          sampleData 
        WHERE 
          ticker = "${ticker}" AND  CAST((substr(date, 7, 4) || "-" || substr(date, 1, 2) || "-" || substr(date, 4, 2)) AS TEXT) >=  DATE('now','-${year} years')`;

  const details = await db.all(getDataQuery);
  response.send(details);
});

//API 5
app.get("/getData", async (request, response) => {
  const { period } = request.query;

  const getDataQuery = `SELECT *
  FROM sampleData`;

  const details = await db.all(getDataQuery);
  response.send(details);
});

module.exports = app;
