// IMPORTS
// ================================================
const express = require("express");
const Action = require("../data/helpers/actionModel.js");
const Project = require("../data/helpers/projectModel.js");

const router = express.Router();

// ENDPOINTS
// ================================================

// READ ALL ACTIONS - done
router.get(`/`, (req, res) => {
  Action.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `Actions could not be retrieved.` });
    });
});

// READ AN ACTION - done
router.get(`/:id`, validateActionId, (req, res) => {
  //   res.status(200).json(action); // why does this still work?
  res.status(200).json(req.action);
});

// CREATE AN ACTION - ensure that project_id provided belongs to existing project (NEED TO DO)
// use Project.getProjectActions instead?
router.post(`/`, validateAction, (req, res) => {
  const action = req.body;
  const projectId = req.body.project_id;
  console.log(projectId);

  // How to rewrite with validatePostId function?
  // If project_id of action_id is incorrect, how to catch?
  Project.get(projectId)
    .then(project => {
      // if project exists, go on
      if (project) {
        Action.insert(action)
          .then(newAction => {
            res.status(201).json(newAction);
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({ error: `Action ${actionId} could not be added` });
          });
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
});

// UPDATE AN ACTION - done
router.put(`/:id`, validateAction, (req, res) => {
  const actionId = req.params.id;
  const action = req.body;

  console.log("ACTION", actionId, action);

  // missing project_id error from validateAction triggered
  Action.update(actionId, action)
    //   Action.update(actionId, { ...action, project_id: actionId }) // woops - wrong Id
    .then(updatedAction => {
      res.status(200).json(updatedAction);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The action could not be updated" });
    });
});

// DELETE AN ACTION - done
router.delete(`/:id`, validateActionId, (req, res) => {
  const actionId = req.params.id;
  Action.remove(actionId)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The action could not be deleted" });
    });
});

// CUSTOM MIDDLEWARE
// ================================================

function validateActionId(req, res, next) {
  const actionId = req.params.id;
  Action.get(actionId)
    .then(action => {
      // if action exists, go on
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({ error: `Action ${actionId} does not exist!` });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: `Action ${actionId} could not be retrieved` });
    });
}

function validateAction(req, res, next) {
  //   console.log("request\t", req.body);
  const inputAction = req.body;
  console.log(typeof inputAction.completed);

  // check existence
  if (Object.keys(inputAction).length === 0) {
    return res.status(400).json({ message: "missing action data!" });
  }
  if (!inputAction.project_id) {
    return res.status(400).json({ message: "missing project_id" });
  }
  if (!inputAction.description || !inputAction.notes) {
    return res
      .status(400)
      .json({ message: "missing action description or notes!" });
  }

  // check data types
  if (typeof inputAction.project_id !== "number") {
    return res.status(400).json({ message: "project_id must be integer" });
  }
  // if "completed" exists as a key, check if boolean
  if (inputAction.completed && typeof inputAction.completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "completed flag must be a boolean!" });
  }

  if (
    typeof inputAction.description !== "string" ||
    typeof inputAction.notes !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "action description and notes must be strings!" });
  }

  next();
}

module.exports = router;
