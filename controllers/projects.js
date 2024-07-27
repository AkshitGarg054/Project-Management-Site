const Project = require("../models/project");
const User = require("../models/user");
const { sendNotification } = require("../utils/email-config.js");

module.exports.index = async (req, res) => {
    const userId = req.user._id;
    const allProjects = await Project.find({owner: userId});
    res.render("pages/index.ejs", { allProjects, projectsAvailable: allProjects.length > 0, showAdminNavbar: false, showNavbar: true });
};

module.exports.renderNewForm = (req, res) => {
    res.render("pages/new.ejs", { showAdminNavbar: false, showNavbar: true });
};

module.exports.showProject = async (req, res) => {
    let id = req.params.id;
    let user = req.user;
    let idProject = await Project.findById(id).populate("owner");
    if (!idProject) {
        req.flash("error", "Wrong Project!");
        res.redirect("/projects");
    }
    console.log(idProject);
    res.render("pages/show.ejs", { idProject, user, showAdminNavbar: false, showNavbar: true });
};

module.exports.createProject = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newP = req.body.newP;
    const newProject = new Project(newP);

    newProject.owner = req.user._id;

    const userId = req.user._id;
    const ourUser = await User.findById(userId);
    ourUser.projects.push(newProject);
    await ourUser.save();

    newProject.img = {url, filename};
    await newProject.save();
    req.flash("success", "New Project added!");
    res.redirect("/projects");
};

module.exports.renderEditForm = async (req, res) => {
    let user = req.user;
    let id = req.params.id;
    let idProject = await Project.findById(id);
    if (!idProject) {
        req.flash("error", "Wrong Project!");
        res.redirect("/projects");
    }
    res.render("pages/edit.ejs", { idProject, user, showAdminNavbar: false, showNavbar: true });
};

module.exports.updateProject = async (req, res) => {
    let id = req.params.id;
    let updatedProject = await Project.findByIdAndUpdate(id, req.body.newP);

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedProject.img = {url, filename};
        await updatedProject.save();
    }

    if (req.user.type === 'Admin') {
        const adminId = req.user._id;
        const project = await Project.findById(id);
        project.changes.push({
            action: 'edited',
            adminId: adminId,
        });
        await project.save();
        const owner = await User.findById(project.owner);
        await sendNotification(owner.email, `Your project "${project.projectName}" is edited by an admin.`);
    };

    req.flash("success", "Project Updated!");
    if (req.user.type === 'Student') {
        res.redirect(`/projects/${id}`);
    } else if (req.user.type === 'Admin') {
        res.redirect(`/admin/users/${req.user._id}/projects/${id}`);
    }
};

module.exports.destroyProject = async (req, res) => {
    let {id} = req.params;
    let project = await Project.findById(id);
    let ownerId = project.owner;
    if (req.user.type === 'Admin') {
        const adminId = req.user._id;
        project.changes.push({
            action: 'deleted',
            adminId: adminId,
        });
        await project.save();
        const owner = await User.findById(project.owner);
        await sendNotification(owner.email, `Your project "${project.projectName}" is deleted by an admin.`);
    };
    await User.findByIdAndUpdate(ownerId, {$pull: {projects: id}});
    let deletedProject = await Project.findByIdAndDelete(id);
    console.log(deletedProject);
    req.flash("success", "Project Deleted!");
    if (req.user.type === 'Student') {
        res.redirect("/projects");
    } else if (req.user.type === 'Admin') {
        res.redirect(`/admin/users/${req.user._id}/projects`);
    }
};