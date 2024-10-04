require('express-async-errors')
//const request = require('request')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.status(200).json(blog)
  } else {
    res.status(404).json('invalid id')
  }
})

blogsRouter.post('/', async (req, res) => {

  const { title, url, likes, user } = req.body

  /*const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)*/

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }
  const blog = new Blog({
    title,
    url,
    user,
    likes: likes || 0,
  })

  const savedBlog = await blog.save()
  //user.blogs = user.blogs.concat(savedBlog._id)
  //await user.save()
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
}
)

blogsRouter.delete('/:id', async (req, res) => {

  const blogTodelete = await Blog.findByIdAndDelete(req.params.id)
  if(blogTodelete){
    return res.status(200).json('Blog deleted successfully')
  } else {
    return res.status(404).json('Blog not found')
  }
})
module.exports = blogsRouter