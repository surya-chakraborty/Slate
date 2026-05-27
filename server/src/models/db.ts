import mongoose, { Schema } from "mongoose";

// We need user, content Schema then tags for category selection of content and link schmea for unqiue shareable link
// content and link will refer to a user and content tag refres to tag schema
// build models around the schmea then

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
}, { timestamps: true})

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: {
        type: mongoose.Types.ObjectId,
        ref: 'Tag'
    },
    type: String,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true})

const TagSchema = new Schema({
    title: String
})

const LinkSchema = new Schema({
    hash: String,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
})

export const UserModel = mongoose.model('User', UserSchema)
export const TagModel = mongoose.model('Tag', TagSchema)
export const LinkModel = mongoose.model('Link', LinkSchema)
export const ContentModel = mongoose.model('Content', ContentSchema)
