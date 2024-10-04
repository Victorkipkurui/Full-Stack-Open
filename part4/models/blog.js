const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  /*user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },*/
  url: String,
  user: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog