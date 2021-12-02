const express = require('express')
const app = express()

app.use(express.json())
const morgan =require('morgan')
morgan.token('response', function(request, response) {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        number: "345223405",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "456798765",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
]
app.get('/', (req, res) => {
    res.send('<h2>Hello World!</h2>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const phonebooksize = persons.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${phonebooksize} people </p>
    <p> ${date}`)
    
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id != id)
    res.status(204).end()
})
const generateId = (() => {
    const id =  Math.floor(Math.random()*(10000))
    return id
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if(persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    } 
    persons = persons.concat(person)
    response.json(body)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
