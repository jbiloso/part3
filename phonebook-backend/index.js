require('dotenv').config()
const express = require('express') 
const Person = require('./models/person')

const app = express() 

const morgan = require('morgan')
app.use(express.json())

//allows the backend to receive requests from 
// different origin
const cors = require('cors')

app.use(cors())

//built-in middleware from express called static 
// which allows Express to show static content like index.html and the javascript
app.use(express.static('dist')) 



morgan.token('details',  (req)=> {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
    }
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :details'))


app.get('/', (request, response) => {
    response.send('<h1>Hello worlddd!</h1>')
})

app.get('/api/persons', (request, response) => {
    // response.json(persons) 
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => { 
    let info = "";

    Person.countDocuments({})
        .then( count => {
            // response.json(count)
            info = `<div><div>Phonebook has info for ${count} people</div><div>${new Date()}</div></div>`
            response.send(info) 
        })
    //we use .send method for passign HTML/plain text/files, anything that is not JSON
})

app.get('/api/persons/:id', (request, response, next ) => {
    // const id = request.params.id 
    // const person = persons.find(person => person.id === id) 

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = request.params.id 
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body 


    // check if there is no name or number 
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and number cannot be blank'
        })
    } 
    // we will disable the checking for duplicate function for now
    // check if the name is a duplicate in phonebook
    // if(persons.some(person => person.name === body.name)){
    //     return response.status(400).json({
    //         error: `contact name '${body.name}' already exists`
    //     })
    // }

    // create a new model object 
    const person = new Person({
        name: body.name, 
        number: body.number
    })

    // saving that object to mongodb
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// for updating the number of an existing person 
app.put('/api/persons/:id', (request, response, next) => {
    const { number } = request.body 

    // a Mongoose model has a method findById to query a MongoDB collection
    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.number = number 

            // save() is used on a Mongoose document instance to save it to the database 
            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
    
})


const unknownEndpoint = (request, response) => {
    response.status(404).json({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
