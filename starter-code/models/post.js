const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: String,
    creatorId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    imgPath: String,
    imgName: String
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;