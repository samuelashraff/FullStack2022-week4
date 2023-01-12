const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require("../utils/middleware")
const jwt = require("jsonwebtoken")
const config = require("../utils/config")

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
    response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
        response.json(blog.toJSON())
    } else {
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    const user = request.user
    const token = request.token

    const decodeToken = jwt.verify(token, config.SECRET)
    if (!(token && decodeToken.id)) {
        return response.status(401).json({error: "token missing or invalid"})
    }

    const blog = await new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
      }).populate("user", { username: 1, name: 1 });
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    response.status(201).json(savedBlog.toJSON)
})

blogRouter.delete("/:id", async (request, response) => {
    const token = request.token
    const id = request.params.id
    const blog = await Blog.findById(id)
    const decodeToken = jwt.verify(token, config.SECRET)

    if (!(token && decodeToken.id)) {
        return response.status(401).json({error: "Token missing or invalid"})
    }

    if (blog.user.toString() === user.id.toString()) {
        await Blog.deleteOne({_id: id})
        response.sendStatus(204).end()
    } else {
        response.status(401).json({error: "Unauthorized operation"})
    }
})

blogRouter.put("/:id", async (request, response) => {
    const blog = request.body
    const id = request.params.id

    const updated = await Blog.findByIdAndUpdate(
        id,
        blog,
        { new: true, }
    ).populate("user", {username: 1, name: 1})

    updated 
    ? response.status(200).json(updated.toJSON)
    : response.status(404).end()
})

module.exports = blogRouter