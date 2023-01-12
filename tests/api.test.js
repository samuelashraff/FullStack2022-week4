const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require("./helper")

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

describe("when DB initially has blogs", () => {
    test('expected number of blogs returned from /api/blogs endpoint', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test("Assert blogs have key id, not _id", async () => {
        const response = await api.get("/api/blogs")
        const keys = Object.keys(response.body)
        expect(keys).toContain("id")
    })
})

describe("Addition of a new blog", () => {
    let token = null
    beforeAll(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.has("12345", 10)
        const user = await new User({
            username: "name",
            passwordHash
        }).save()
        const userToken = {
            username: "name",
            id: user.id
        }
        return (token = jwt.sign(userToken, config.SECRET))
    })
    test('Adding note succeeds for authorized user', async () => {
        const newBlog = new Blog({
            title: "testTitle",
            author: "testAuthor",
            url: "www.testUrl.fi",
            likes: 2,
            id: "6357e802b137c7be862df991"
        })
    
        await api
        .post('/api/blogs')
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await helper.getBlogs()
        expect(response).toHaveLength(helper.initialBlogs.length + 1)
    })
})



test('Adding note without explicit likes property sets the likes property to 0', async () => {
    const newBlog = new Blog({
        title: "testTitle",
        author: "testAuthor",
        url: "www.testUrl.fi",
        id: "6357e802b137c7be862df992"
    })
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const likes = response.body.map(obj => obj.likes)
    expect(likes[likes.length - 1]).toContain(0)
})

test('Adding blog without a title field results in a 400 status from backend', async () => {
    const newBlog = new Blog({
        author: "testAuthor",
        likes: 2,
        id: "6357e802b137c7be862df992"
    })

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('Test deleting a blog', async () => {
    const blogsAtStart = await helper.getBlogs()
    const blogToDelete = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

    const blogsAtEnd = await helper.getBlogs()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
})

test('Updating a blog', async () => {
    const blogsAtStart = await helper.getBlogs()
    const blogToUpdate = blogsAtStart[0]

    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: 10 })
    .expect(200)

    const blogsAtEnd = await helper.getBlogs()
    const updatedBlog = blogsAtEnd[0]
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(updatedBlog.likes).toBe(10)
})

afterAll(() => {
    mongoose.connection.close()
})