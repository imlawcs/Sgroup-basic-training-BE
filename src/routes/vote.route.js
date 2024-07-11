const express = require("express");
const vote = express.Router();
const voteControllers = require('../controllers/vote.controller.js');

vote.post("/create-poll", voteControllers.createPoll);
vote.post("/update-poll", voteControllers.updatePoll);
vote.post("/create-option", voteControllers.createOption);
vote.post("/submit", voteControllers.submit);
vote.post("/unsubmit", voteControllers.unsubmit);
vote.get("/result-poll", voteControllers.resultPoll);
// router.post("/create-vote", voteControllers.createVote);
// router.get("/change-vote", authenticateToken, voteControllers.changeVote);
// router.post("/email", userControllers.getMail);

module.exports = vote;
