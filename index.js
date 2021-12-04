require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const errrorHandler = (error, req, res, next) => {
    console.log(error.message)
    if(error.name === 'CastError') {
        return res.status(400).send({error: 'maformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message})
    }
    next(error)
}

const morgan =require('morgan')
const { response } = require('express')
morgan.token('response', function(request, response) {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'))


/*let persons = [
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
] */
app.get('/', (req, res) => {
    res.send('<h2>Hello World!</h2>')
})

app.get('/api/persons', (req, res) => {
    console.log('getting persons')
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

 app.get('/info', (req, res, next) => {
    const date = new Date()
    Person.find({})
        .then(result => {
            res.send(`<p>Phonebook has info for ${result.length} people </p> ${date}` )
        })
        .catch(error => next(error))
}) 


app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})
const generateId = (() => {
    const id =  Math.floor(Math.random()*(10000))
    return id
})
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    }) 
    person.save()
        .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})
 app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
}) 
app.use(errrorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
