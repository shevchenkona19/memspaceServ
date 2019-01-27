const express = require('express');
const router = express.Router();
const feedbackMethods = require("./feedback");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/like", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, feedbackMethods.postLike);
router.post("/dislike", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, feedbackMethods.postDislike);
router.delete("/like", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, feedbackMethods.deleteLike);
router.delete("/dislike", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, feedbackMethods.deleteDislike);
router.post("/comment", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, feedbackMethods.postComment);
router.get("/comments", feedbackMethods.getComments);
router.post("/messageForDev", passport.authenticate("jwt", {session: false}), feedbackMethods.postMessageForDev);
router.get("/allFeedbackDev", feedbackMethods.getAllDevFeedback);
router.post("/commentAnswer", passport.authenticate("jwt", {session: false}), auth.allButNotRegistered, feedbackMethods.postCommentRespond);
router.get("/answersForComment", feedbackMethods.getAnswersForComment);
router.get("/commentsToCommentId", feedbackMethods.getCommentsToCommentId);
router.get("/answersForCommentToId", feedbackMethods.getAnswersForCommentToId);

module.exports = router;