// IMPORTS
// ================================================
const express = require("express");
const Project = require("../data/helpers/projectModel.js");

const router = express.Router();

// ENDPOINTS
// ================================================

// READ ALL PROJECTS - done
router.get(`/`, (req, res) => {
  Project.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `Projects could not be retrieved.` });
    });
});

// READ A PROJECT - done
router.get(`/:id`, validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

// CREATE A PROJECT
router.post(`/`, validateProject, (req, res) => {
  const project = req.body;

  Project.insert(project)
    .then(newProject => {
      res.status(201).json(newProject);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The post could not be created" });
    });
});

// UPDATE A PROJECT

// DELETE A PROJECT

// GET A PROJECT'S ACTIONS

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

// check user input
function validateProject(req, res, next) {
  //   console.log("request\t", req.body);
  const inputPost = req.body;
  console.log(typeof inputPost.completed);

  // check existence
  if (Object.keys(inputPost).length === 0) {
    res.status(400).json({ message: "missing project data!" });
  } else if (!inputPost.name) {
    res.status(400).json({ message: "missing project name!" });
  } else if (!inputPost.description) {
    res.status(400).json({ message: "missing project description!" });
  }
  // check contents
  else if (inputPost.completed && typeof inputPost.completed !== "boolean") {
    // if "completed" exists as a key, check if boolean
    res.status(400).json({ message: "completed flag must be a boolean!" });
  } else if (
    typeof inputPost.name !== "string" ||
    typeof inputPost.description !== "string"
  ) {
    // if "completed" exists as a key, check if boolean
    res
      .status(400)
      .json({ message: "project name and description must be strings!" });
  }
  // continue if no errors
  else {
    next();
  }
}

module.exports = router;
