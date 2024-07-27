const Project = require("../models/project");
const User = require("../models/user");

module.exports.getAllUsers = async (req, res) => {
    const users = await User.find({type: 'Student'});
    res.render("admins/index.ejs", { users, showAdminNavbar: true, showNavbar: false });
};

module.exports.userProjects = async (req, res) => {
    const id = req.params.id;
    //const currUser = await User.findById(id);
    const allProjects = await Project.find({owner: id});
    res.render("admins/userProjects.ejs", { allProjects, id, projectsAvailable: allProjects.length > 0, showAdminNavbar: true, showNavbar: false });
};

module.exports.particularProject = async (req, res) => {
    let id = req.params.id;
    let user = req.user;
    let projectId = req.params.projectId;
    let idProject = await Project.findById(projectId).populate("owner");
    if (!idProject) {
        req.flash("error", "Wrong Project!");
        res.redirect("/admin/users/id/projects");
    }
    console.log(idProject);
    res.render("pages/show.ejs", { idProject, user, id, showAdminNavbar: true, showNavbar: false });
};

module.exports.editUserProject = async (req, res) => {
    let user = req.user;
    let projectId = req.params.projectId;
    let idProject = await Project.findById(projectId);
    if (!idProject) {
        req.flash("error", "Wrong Project!");
        res.redirect("/admin/users/id/projects");
    }
    res.render("pages/edit.ejs", { idProject, user, showAdminNavbar: true, showNavbar: false });
};

module.exports.deleteUserProject = async (req, res) => {
    let {id} = req.params;
    await Project.deleteMany({owner: id});
    await User.findByIdAndDelete(id);
    req.flash("success", "User and its projects deleted successfully");
    res.redirect("/admin/users");
};