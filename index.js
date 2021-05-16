//CRUD Web Server <(._.)>
const express = require("express");
const server = express();
const { PORT = 3000 } = process.env
server.use(express.json());
const morgan = require("morgan");
server.use(morgan("dev"));
require("dotenv").config();
const dino = `               __
              / _)
     _.----._/ /
    /         /
 __/ (  | (  |
/__.-'|_|--|_|
`;

server.use((req, res, next) => {
  const now = Date.now();
  req.timeOfRequest = now;
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

server.get("/background/:color", (req, res, next) => {
    res.send(`
      <body style="background: ${req.params.color};">
        <h1>Hello World</h1>
      </body>
    `);
});

server.get('/add/:first/to/:second', (req, res, next) => {
    res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
      Number(req.params.first) + Number(req.params.second)
     }</h1>`);
});

const apiRouter = require("./api/index.js");
server.use("/api", apiRouter);

const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
  console.log(dino);
});
