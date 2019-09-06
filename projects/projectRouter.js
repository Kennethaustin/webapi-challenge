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
      res.status(500).json({ error: "The project could not be created" });
    });
});

// UPDATE A PROJECT
router.put(`/:id`, validateProjectId, validateProject, (req, res) => {
  const projectId = req.params.id;
  const project = req.body;

  Project.update(projectId, project)
    .then(updatedProject => {
      res.status(200).json(updatedProject);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The project could not be updated" });
    });
});

// DELETE A PROJECT
router.delete(`/:id`, validateProjectId, (req, res) => {
  const projectId = req.params.id;

  Project.remove(projectId)
    .then(
      () => res.status(204).end() // successfully deleted, but why doesn't .json() return?
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The project could not be deleted" });
    });
});

// GET A PROJECT'S ACTIONS
router.get(`/:id/actions`, validateProjectId, (req, res) => {
  const projectId = req.params.id;
  Project.getProjectActions(projectId)
    .then(projectActions => {
      if (projectActions[0]) {
        res.status(200).json(projectActions);
      } else {
        // if project exists but has no actions
        res
          .status(404)
          .json({ message: `Project ${projectId} has no actions!` });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The project's actions could not be retrieved" });
    });
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

// check user input
function validateProject(req, res, next) {
  //   console.log("request\t", req.body);
  const inputProject = req.body;
  console.log(typeof inputProject.completed);

  // check existence
  if (Object.keys(inputProject).length === 0) {
    res.status(400).json({ message: "missing project data!" });
  } else if (!inputProject.name) {
    res.status(400).json({ message: "missing project name!" });
  } else if (!inputProject.description) {
    res.status(400).json({ message: "missing project description!" });
  }
  // check contents
  else if (
    inputProject.completed &&
    typeof inputProject.completed !== "boolean"
  ) {
    // if "completed" exists as a key, check if boolean
    res.status(400).json({ message: "completed flag must be a boolean!" });
  } else if (
    typeof inputProject.name !== "string" ||
    typeof inputProject.description !== "string"
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
