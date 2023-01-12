const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
    {
        title: "test",
        author: "author",
        url: "www.test.fi",
        likes: 2,
        id: "6357e781685a5b786cdfe202"
    },
    {
        title: "test2",
        author: "author2",
        url: "www.test.fi",
        likes: 3,
        id: "6357e802b137c7be862df990"
    }
]

const getBlogs = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON)
}

const getUsers = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
  };

module.exports = {initialBlogs, getBlogs, getUsers}