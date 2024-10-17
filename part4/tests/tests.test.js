const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, blogsInDb, blogs } = require('./listhelper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

describe('Helper functions and Unit Tests',() => {
  test('dummy returns one', () => {
    const blogs = []
    const result = dummy(blogs)
    assert.strictEqual(result, 1)
  })

  describe('total likes', () => {
    test('when list has multiple blogs, equals the sum of likes', () => {
      const result = totalLikes(blogs)
      assert.strictEqual(result, 36)
    })
  })

  describe('favorite blog', () => {
    test('returns the blog with the most likes', () => {
      const result = favoriteBlog(blogs)
      const expected = {
        id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }
      assert.deepStrictEqual(result, expected)
    })
  })

  describe('most blogs', () => {
    test('returns the author with the most blogs', () => {
      const result = mostBlogs(blogs)
      const expected = {
        author: 'Robert C. Martin',
        blogs: 3
      }
      assert.deepStrictEqual(result, expected)
    })
  })

  describe('most likes', () => {
    test('returns the author with the most likes', () => {
      const result = mostLikes(blogs)
      const expected = {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
      assert.deepStrictEqual(result, expected)
    })
  })
})

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    const blogObjects = blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    console.log('done')
  })
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  // eslint-disable-next-line no-trailing-spaces
  
  assert.strictEqual(response.body).toHaveLength(5)
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogAtStart = await blogsInDb()
    const blogToView = blogAtStart[0]
    const blogNote = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(blogNote.body, blogToView)
  })
})

describe('addition of a new blog', () => {
  let token
  beforeAll(async () => {
    const userCredentials = {
      username: 'testuser',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(userCredentials)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)

    token = loginResponse.body.token
  })

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Coming Home',
      author: 'Kipkurui Victor',
      url: 'https://example.com',
      likes: 7,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('Coming Home'))
  })
})

describe('if likes is missing default to 0', () => {
  test('should default the likes property to 0 if missing', async () => {
    const newBlog = {
      title: 'Coming HOme',
      author: 'Kipkurui Victor',
      url: 'https://example.com',

    }
    const response = await api(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    assert.strictEqual(response.body.likes).toBe(0)
  })
})

describe('if title or url missing', () => {
  test('should respond with 400 Bad Request if the title is missing', async () => {
    const newBlog = {
      author: 'Kipkurui Victor',
      url: 'https://example.com',
      likes: 7,
    }

    const response = await api(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response.body.error).toBe('Title and URL are required')
  })

  test('should respond with 400 Bad Request if the url is missing', async () => {
    const newBlog = {
      title: 'Coming HOme',
      author: 'Kipkurui Victor',
      likes: 7,

    }
    const response = await api(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response.body.error).toBe('Title and URL are required')
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})