// IMPORTS
// ================================================
const express = require("express");
const Project = require("../data/helpers/projectModel.js");

const router = express.Router();

// ENDPOINTS
// ================================================

// GET ALL PROJECTS
router.get(`/`, (req, res) => {
  Project.get()
    .then(projects => {
      // console.log(projects);
      // res.end();
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `Projects could not be retrieved.` });
    });
});

// GET A PROJECT
router.get(`/:id`, validateProjectId, (req, res) => {
  //   const projectId = req.params.id;
  //   Project.get(projectId)
  //     .then(project => {
  //       res.status(200).json(project);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res
  //         .status(500)
  //         .json({ error: `Project ${projectId} could not be retrieved.` });
  //     });

  res.status(200).json(req.project);
});

// CUSTOM MIDDLEWARE
// ================================================

function validateProjectId(req, res, next) {
  const projectId = req.params.id;
  Project.get(projectId)
    .then(project => {
      // if project exists, go on
      if (project) {
        req.project = project; // add 'project' key to avoid redo-ing request in GET
        next();
      } else {
        res.status(404).json({ error: `Project ${projectId} does not exist!` });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: `Project ${projectId} could not be retrieved` });
    });
}

module.exports = router;
