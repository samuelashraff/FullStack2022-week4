const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    const user = request.user
    const token = request.token

    if (!(token || !token.id)) {
        return response.status(401).json({error: "token missing or invalid"})
    }

    if (!user) return response.status(401).json({ error: 'user not found' })

    const blog = await new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
      })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete("/:id", async (request, response) => {
    const token = request.token
    const id = request.params.id
    const blog = await Blog.findById(id)

    if (!blog) {
        return response.status(404).json({ error: 'Blog with said id not found'})
    }
    if (!(token || !token.id)) {
        return response.status(401).json({error: "Token missing or invalid"})
    }

    if (!user) {
        return response.status(401).json({ error: 'User not found' })
    }

    const user = request.user

    if (blog.user.toString() === user.id.toString()) {
        await Blog.deleteOne({_id: id})
        response.sendStatus(204).end()
    } else {
        response.status(401).json({error: "Unauthorized operation"})
    }
})

blogRouter.put("/:id", async (request, response) => {
    const body = request.body
    const id = request.params.id

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogRouter