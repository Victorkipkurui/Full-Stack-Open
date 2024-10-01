const { test, describe, after,beforeEach } = require('node:test');
const assert = require('node:assert');
const listHelper = require('./listhelper');
const mongoose = require('mongoose');
const request = require('supertest');
const supertest = require('supertest');
const app = require('../app'); 
const Blog = require('../models/blog');
const api = supertest(app);
const blogs = listHelper.blogs;

test('dummy returns one', () => {
  const blogs = []; 
  const result = listHelper.dummy(blogs); 
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    const expected = {
      id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    };
    assert.StrictEqual(result, expected)
  });
});

describe('most blogs', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    const expected = {
      author: "Robert C. Martin",
      blogs: 3    
    };
    assert.deepStrictEqual(result, expected);
  });
});

describe('most likes', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostLikes(blogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17   
    };
    assert.deepStrictEqual(result, expected);
  });
});

//supertest
describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogObjects = blogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  })
  console.log('done')
})

  test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, blogs.length)
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogAtStart = await listHelper.blogsInDb()
      const blogToView = blogAtStart[0]
      const blogNote = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(blogNote.body, blogToView)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Coming HOme',
        author: 'Kipkurui Victor',
        url: 'https://example.com',
        likes: 7, 
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await listHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

      const contents = blogsAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    });

  });

  describe('POST /api/blogs', () => {
    it('should default the likes property to 0 if missing', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'John Doe',
    
      };
      const response = await request(app)
        .post('/api/blogs')
        .send(newBlog)
        .expect(201);
      expect(response.body.likes).toBe(0);
    });
  });

  describe('POST /api/blogs', () => {
    test('should respond with 400 Bad Request if the title is missing', async () => {
      const newBlog = {
        author: 'John Doe',
        url: 'http://example.com',
      };
  
      const response = await request(app)
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
  
      expect(response.body.error).toBe('Title and URL are required');
    });
  
    test('should respond with 400 Bad Request if the url is missing', async () => {
      const newBlog = {
        author: 'John Doe',
        title: 'Test Blog',
      
      };
      const response = await request(app)
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
  
      expect(response.body.error).toBe('Title and URL are required');
    });
  });

after(async () => {
  await mongoose.connection.close()
})