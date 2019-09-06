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

// READ AN ACTION
router.get(`/:id`, validateActionId, (req, res) => {
  const actionId = req.params.id;
  Action.get(actionId)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `Action could not be retrieved.` });
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

module.exports = router;
