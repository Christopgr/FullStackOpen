const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('express')

const api = supertest(app)

const initialBlogs = [
    {
        title: "Greatly interestings tests",
        author: "Chris Topalis",
        url: "www.willExistSoon.com",
        likes: 0,
    },
    {
        title: "Tests suck",
        author: "Chris Topalis",
        url: "www.whogivesaflyingfuckabouttests.com",
        likes: 0,
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let noteObject = new Blog(initialBlogs[0])
    await noteObject.save()
    noteObject = new Blog(initialBlogs[1])
    await noteObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('id is correctly defined', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blog = blogs[0]

    expect(blog).toHaveProperty('id');
})

test('a valid blog can be added', async () => {

    const newBlog = {
        title: "Doing boring tests",
        author: "Chris Topalis",
        url: "www.willExistSoon.com",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYwZTJkMGVhNzM1YzM1NDc4MDQ4ZWQzMyIsImlhdCI6MTYyNjI1NDI2N30.W_oOIgvZcKsCeAKqfZHaKi-AalErJ0Hy-NWslFwsf3s')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAfter = response.body

    expect(blogsAfter).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAfter.map(n => n.title)
    expect(titles).toContain(
        'Doing boring tests'
    )
})

test('posting without likes defaults it to likes: 0', async () => {
    const newBlog = {
        title: "Amazing test without likes",
        author: "Chris Topalis",
        url: "www.willExistSoon.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAfter = response.body
    const blogToCheck = blogsAfter[blogsAfter.length - 1]

    expect(blogToCheck).toHaveProperty('likes', 0);
})

test('badly formed blog', async () => {
    const newBlog = {
        url: "www.willExistSoon.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

})

test('a BLOG can be deleted', async () => {


    let response = await api.get('/api/blogs')
    const blogs = response.body
    const blog = blogs[0]

    await api.delete(`/api/blogs/${blog.id}`).expect(204)

    console.log(blog.id)

    response = await api.get('/api/blogs')
    const afterblogs = response.body


    expect(afterblogs).toHaveLength(
        initialBlogs.length - 1
    )

    const titles = afterblogs.map(r => r.title)

    expect(titles).not.toContain(blog.title)
})

test('a BLOG can be updated', async () => {

    const editedBlog = {
        title: "Edited Blog",
        author: "Chris Topalis",
        url: "www.willExistSoon.com",
        likes: 13
    }

    let response = await api.get('/api/blogs')
    const blogs = response.body
    const blog = blogs[0]

    await api.put(`/api/blogs/${blog.id}`)
        .send(editedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    response = await api.get('/api/blogs')
    const afterblogs = response.body

    const titles = afterblogs.map(r => r.title)

    expect(titles).toContain(editedBlog.title)
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    const usersInDb = async () => {
        const users = await User.find({})
        return users.map(u => u.toJSON())
    }

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('create user with small pass', async () => {
        const newUser = {
            username: 'mluuk',
            name: 'Matti Luuk',
            password: 'sa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(401)
    })
})

afterAll(() => {
    mongoose.connection.close()
})