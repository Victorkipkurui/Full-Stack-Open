const _ = require('lodash')
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
