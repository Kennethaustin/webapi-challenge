// IMPORTS
// ================================================
const express = require("express");
const projectRouter = require("./projects/projectRouter.js");
const actionRouter = require("./actions/actionRouter.js");

const server = express();

server.use(express.json());

// CUSTOM MIDDLEWARE
// ================================================
function logger(req, res, next) {
  console.log(
    `Request method:\t${req.method}\nRequest url:\t${
      req.url
      // }\nTime:\t${Date.now()}\n\n`
    }\nTime:\t${new Date().toISOString()}\n\n`
  );
  next();
}

server.use(logger);

// sanity check!
server.get("/", (req, res) => {
  res.json({ yo: "working!" });
});

// ROUTES
// ================================================
server.use(`/api/projects`, projectRouter);
server.use(`/api/actions`, actionRouter);

module.exports = server;
