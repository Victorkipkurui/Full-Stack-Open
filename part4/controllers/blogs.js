require('express-async-errors');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (req, res) => { 
  const blogs = await Blog.find({})
      res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404).json('invalid id');
  }
});

blogsRouter.post('/', async (req, res) => {

  const {title, url, likes} = req.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  const blog = new Blog({
    title,
    url,
    user: user,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {

  const blogTodelete = await Blog.findByIdAndDelete(req.params.id)
  if(blogTodelete){
  return res.status(200).json('Blog deleted successfully')
  } else {
  return res.status(404).json('Blog not found');
  }
});

module.exports = blogsRouter;