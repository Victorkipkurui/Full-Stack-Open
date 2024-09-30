const express = require('express');
const blogsRouter = express.Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => {
      response.status(500).json({ error: 'Something went wrong while fetching blogs' });
    });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);
  blog.save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => {
      response.status(400).json({ error: 'Failed to create blog' });
    });
});

module.exports = blogsRouter;
