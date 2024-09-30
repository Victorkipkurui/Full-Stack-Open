const express = require('express');
require('express-async-errors');
const blogsRouter = express.Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
      response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body);
  const savedBlog = blog.save()
  response.status(201).json(savedBlog);
      
});

module.exports = blogsRouter;
