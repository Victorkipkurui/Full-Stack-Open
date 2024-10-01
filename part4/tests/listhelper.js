const _ = require('lodash');
const { Blog } = require('../models/blog');
const dummy = (blogs) => {
 const value = 1
  return value;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const favorite = _.maxBy(blogs, 'likes');
  return {
    id: favorite._id,
    title: favorite.title,
    author: favorite.author,
    url: favorite.url,
    likes: favorite.likes
  };;
};

const mostBlogs = (blogs) => {
  const authorBlogCounts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(Object.keys(authorBlogCounts), (author) => authorBlogCounts[author]);

  return {
    author: topAuthor,
    blogs: authorBlogCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');
  
  const authorLikes = _.map(groupedByAuthor, (authorBlogs, author) => {
    return {
      author,
      likes: _.sumBy(authorBlogs, 'likes'),
    };
  });
  const topAuthor = _.maxBy(authorLikes, 'likes');
  return topAuthor;
};

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
  {
    id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }  
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  blogs,
  nonExistingId,
}
