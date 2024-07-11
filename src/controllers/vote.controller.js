const db = require("../database/connection.js");
// const mailService = require("../middlewares/mailService.js");
require('dotenv').config();
const voteServices = require('../services/vote.service.js');

const createPoll = async (req, res) => {
    const poll = req.body;
    try {
        const polls = await voteServices.createPoll(poll.title, poll.userId);
        res.status(200).json(polls);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const updatePoll = async (req, res) => {
    const poll = req.body;
    try {
        const polls = await voteServices.updatePoll(poll.title, poll.userId, poll.isLock, poll.pollId);
        res.status(200).json(polls);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const createOption = async (req, res) => {
    const option = req.body;
    try {
        const options = await voteServices.createOption(option.title, option.pollId);
        res.status(200).json(options);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const submit = async (req, res) => {
    const submit = req.body;
    try {
        const submits = await voteServices.submit(submit.userId, submit.optionId);
        res.status(200).json(submits);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const unsubmit = async (req, res) => {
    const submit = req.body;
    try {
        const submits = await voteServices.unsubmit(submit.userId, submit.optionId);
        res.status(200).json(submits);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const resultPoll = async(req, res) => {
    try {
        const result = await voteServices.resultPoll();
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
}

module.exports = {
    createPoll,
    createOption,
    updatePoll,
    submit,
    unsubmit,
    resultPoll
}