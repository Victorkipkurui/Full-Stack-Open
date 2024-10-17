require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user')
  if (blog) {
    res.status(200).json(blog)
  } else {
    res.status(404).json({ error: 'Blog not found' })
  }
})

blogsRouter.post('/', async (req, res) => {
  const { title, url, likes } = req.body

  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title,
    url,
    user: user.id,
    likes: likes || 0,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body
  if (likes === undefined) {
    return res.status(400).json({ error: '\'likes\' field is required' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true }
  )

  if (!updatedBlog) {
    return res.status(404).json({ error: 'Blog post not found' })
  }

  res.json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  const blogToDelete = await Blog.findById(req.params.id)

  if (!blogToDelete) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  if (blogToDelete.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this blog' })
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Blog deleted successfully' })
})

module.exports = blogsRouter