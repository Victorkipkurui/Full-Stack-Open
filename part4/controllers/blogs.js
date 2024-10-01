const express = require('express');
require('express-async-errors');
const blogsRouter = express.Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
      res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', async (req, res) => {
  const { title, url, author, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  const blog = new Blog({
    title,
    url,
    author,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;