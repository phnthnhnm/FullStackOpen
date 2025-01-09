import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'Login successful', type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    setNotification({ message: 'Logged out', type: 'success' })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      setNewBlog({ title: '', author: '', url: '' })
      setNotification({ message: `A new blog "${blog.title}" by ${blog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Error creating blog', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input type="text" value={newBlog.title} name="title" onChange={handleBlogChange} />
      </div>
      <div>
        author
        <input type="text" value={newBlog.author} name="author" onChange={handleBlogChange} />
      </div>
      <div>
        url
        <input type="text" value={newBlog.url} name="url" onChange={handleBlogChange} />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <h3>create new</h3>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
