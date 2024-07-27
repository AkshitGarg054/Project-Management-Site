const express = require('express');
const router = express.Router();
const wrapAsyncFunc = require("../utils/wrapAsync.js");
const { isLoggedIn, isStudent, validateProject } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const projectController = require("../controllers/projects.js");

router.route("/")
.get(isStudent, wrapAsyncFunc(projectController.index))
.post(isStudent, upload.single("newP[img]"), validateProject, wrapAsyncFunc(projectController.createProject));


router.get("/new", isLoggedIn, projectController.renderNewForm);

router.route("/:id")
.get(isStudent, wrapAsyncFunc(projectController.showProject))
.put(isLoggedIn, upload.single("newP[img]"), validateProject, wrapAsyncFunc(projectController.updateProject))
.delete(isLoggedIn, wrapAsyncFunc(projectController.destroyProject));

router.get("/:id/edit", isStudent, wrapAsyncFunc(projectController.renderEditForm));

module.exports = router;