import { useState } from "react";
import axios from "axios";

const BlogForm = ({ user }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newBlog = { title, author, url, likes, user: user.id };
      const response = await axios.post("/api/blogs", newBlog, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response.data);
      setTitle("");
      setAuthor("");
      setUrl("");
      setLikes(0);
    } catch (err) {
      setError(err, "Failed to create blog. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Create a New Blog</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Likes</label>
            <input
              type="number"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              min="0"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded py-2 w-full hover:bg-blue-600">
            Create Blog
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default BlogForm;
