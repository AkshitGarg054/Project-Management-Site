const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Student", "Admin"],
        required: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project",
        }
    ],
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpiry: {
        type: Date,
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);