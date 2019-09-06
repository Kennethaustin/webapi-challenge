// IMPORTS
// ================================================
const express = require("express");
const Action = require("../data/helpers/actionModel.js");

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

// CREATE AN ACTION
router.post(`/`, validateAction, (req, res) => {
  const action = req.body;
  Action.insert(action).then(newAction => {
    res.status(201).json(newAction);
  });
});

// UPDATE AN ACTION - middleware errors triggered but don't want them
router.put(`/:id`, validateAction, (req, res) => {
  const actionId = req.params.id;
  const action = req.body;

  // missing project_id error from validateAction triggered
  //   Action.update(actionId, action)
  Action.update(actionId, { ...action, project_id: actionId }) // not fixed cuz middleware check is before
    .then(updatedAction => {
      res.status(200).json(updatedAction);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The action could not be updated" });
    });
});

// DELETE AN ACTION
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
    res.status(400).json({ message: "missing action data!" });
  } else if (!inputAction.project_id) {
    res.status(400).json({ message: "missing project_id" });
  } else if (!inputAction.description) {
    res.status(400).json({ message: "missing action description!" });
  } else if (!inputAction.notes) {
    res.status(400).json({ message: "missing action notes!" });
  } else if (typeof inputAction.project_id !== "number") {
    res.status(400).json({ message: "project_id must be integer" });
  } else if (
    inputAction.completed &&
    typeof inputAction.completed !== "boolean"
  ) {
    // if "completed" exists as a key, check if boolean
    res.status(400).json({ message: "completed flag must be a boolean!" });
  } else if (
    typeof inputAction.description !== "string" ||
    typeof inputAction.notes !== "string"
  ) {
    res
      .status(400)
      .json({ message: "action description and notes must be strings!" });
  } else {
    next();
  }
}

module.exports = router;
