const express = require('express');
const router = express.Router();
const wrapAsyncFunc = require("../utils/wrapAsync.js");
const { isAdmin } = require('../middleware.js');

const adminController = require("../controllers/admin.js");

router.get("/users", isAdmin, wrapAsyncFunc(adminController.getAllUsers));

router.get("/users/:id/projects", isAdmin, wrapAsyncFunc(adminController.userProjects));

router.get("/users/:id/projects/:projectId", isAdmin, wrapAsyncFunc(adminController.particularProject));

router.get("/users/:id/projects/:projectId/edit", isAdmin, wrapAsyncFunc(adminController.editUserProject));

router.delete("/delete-user/:id", wrapAsyncFunc(adminController.deleteUserProject));

module.exports = router;