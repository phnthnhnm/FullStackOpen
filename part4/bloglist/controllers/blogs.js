const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
