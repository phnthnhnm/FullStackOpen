const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there are initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    token = jwt.sign(userForToken, process.env.SECRET)

    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach((blog) => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Async/Await in JavaScript',
        author: 'John Doe',
        url: 'http://example.com/async-await',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(titles.includes('Async/Await in JavaScript'))
    })

    test('blog without likes defaults to 0', async () => {
      const newBlog = {
        title: 'No Likes Blog',
        author: 'Jane Doe',
        url: 'http://example.com/no-likes',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog = response.body
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'Jane Doe',
        url: 'http://example.com/no-title',
        likes: 5,
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'No URL Blog',
        author: 'Jane Doe',
        likes: 5,
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('adding a blog fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Jane Doe',
        url: 'http://example.com/unauthorized',
        likes: 5,
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
      const blogToDelete = {
        title: 'To-be-deleted',
        author: 'John Doe',
        url: 'http://delete.com/',
        likes: 1,
      }

      const response = await api.post('/api/blogs').send(blogToDelete).set('Authorization', `Bearer ${token}`)

      const id = response.body.id

      const blogsAtStart = await helper.blogsInDb()

      await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('a blog can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = response.body
      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
