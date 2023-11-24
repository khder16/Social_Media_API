const mongoose = require('mongoose')
const Type = mongoose.Schema.Types



const userSchema = new mongoose.Schema(
    {
        userInfo: {
            type: Type.ObjectId,
            ref: 'Auth',
            required: true,
        },
        jobTitle: {
            type: String,

        },
        about: {
            type: String,
        },
        connections: {
            type: Array,
            default: [],
        },
        location: String,
        experience: [
            {
                position: {
                    type: String,
                },
                company: {
                    type: String,
                },
                location: {
                    type: String,
                },
                summary: {
                    type: String,
                }
            }
        ],
        education: [
            {
                schoolName: {
                    type: String,

                },
                course: {
                    type: String,

                },
                summary: {
                    type: String
                }
            }
        ],
        skills: {
            type: [String],
            default: []
        },
        preferredPositions: [
            {
                position: {
                    type: String,

                },
                years: {
                    type: Number,

                }
            }
        ],
        bookmarkedPosts: {
            type: Array,
            default: []
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);


