const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    repoLink: {
        type: String,
        required: true,
    },
    img: {
        url: String,
        filename: String,
    },
    hostLink: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    changes: [
        {
            action: String,
            adminId: { 
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            timeStamp: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
