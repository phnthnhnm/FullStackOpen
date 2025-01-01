require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

// Custom token to log request body for POST requests
morgan.token('body', (req) => JSON.stringify(req.body))

// Use morgan with custom format to include request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const nameExists = persons.some((person) => person.name === body.name)
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  }

  persons.push(newPerson)
  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = persons.findIndex((person) => person.id === id)

  if (index !== -1) {
    persons.splice(index, 1)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const entryCount = persons.length
  const requestTime = new Date()
  res.send(
    `<p>Phonebook has info for ${entryCount} people</p>
     <p>${requestTime}</p>`
  )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
