// IMPORTS
// ================================================
const express = require("express");
const Project = require("../data/helpers/projectModel.js");

const router = express.Router();

// ENDPOINTS
// ================================================
router.get(`/`, (req, res) => {
  Project.get()
    .then(projects => {
      // console.log(projects);
      // res.end();
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Projects could not be retrieved." });
    });
});

// CUSTOM MIDDLEWARE
// ================================================

module.exports = router;
