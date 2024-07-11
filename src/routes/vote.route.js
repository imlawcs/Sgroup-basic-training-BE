const express = require("express");
const vote = express.Router();
const voteControllers = require('../controllers/vote.controller.js');
const auth = require('../middlewares/auth.middleware');

vote.post("/create-poll",auth.authenticateToken, auth.authorization, voteControllers.createPoll);
vote.post("/update-poll",auth.authenticateToken, auth.authorization, voteControllers.updatePoll);
vote.post("/create-option",auth.authenticateToken, auth.authorization, voteControllers.createOption);
vote.post("/submit", voteControllers.submit);
vote.post("/unsubmit", voteControllers.unsubmit);
vote.get("/result-poll",auth.authenticateToken, auth.authorization, voteControllers.resultPoll);
vote.post("/test-autho", auth.authorization);
// router.post("/create-vote", voteControllers.createVote);
// router.get("/change-vote", authenticateToken, voteControllers.changeVote);
// router.post("/email", userControllers.getMail);

module.exports = vote;
