//CRUD Web Server <(._.)>
const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();
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

const apiRouter = require("./api");
server.use("/api", apiRouter);

const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
  console.log(dino);
});
