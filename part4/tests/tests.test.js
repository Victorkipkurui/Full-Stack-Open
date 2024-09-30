const { test, describe, after,beforeEach } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/listhelper');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); 
const Blog = require('../models/blog');
const api = supertest(app);
const blogs = [
  {
    id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }, 
]

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
    assert.deepStrictEqual(result, expected)
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

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(listHelper.blogs)

  })
  test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, listHelper.blogs.length)
  })
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.content)
    assert(contents.includes('Browser can execute only JavaScript'))
  })
  describe('viewing a specific blog', () => {

    test('succeeds with a valid id', async () => {
      const blogAtStart = await helper.blogsindb()

      const blogToView = blogAtStart[0]

      const blogNote = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(blogNote.body, blogToView)
    })
    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })
  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        id: favorite._id,
        title: favorite.title,
        author: favorite.author,
        url: favorite.url,
        likes: favorite.likes
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsindb()
      assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

      const contents = blogsAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)

      const contents = notesAtEnd.map(r => r.content)
      assert(!contents.includes(noteToDelete.content))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})