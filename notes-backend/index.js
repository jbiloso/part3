require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const morgan = require('morgan')

const app = express() 

//built in express.static middleware to serve frontend static files 
// like index.html, css, js from your backend Express server 
app.use(express.static('dist')) 

//activate the json-parser 
//the json-parser takes the json data of a request
//transforms it into a javascript object and then 
//attaches it to the body property of the request object 
//before the route handler is called
app.use(express.json()) // json-parser middleware should be loaded before any HTTP requests 

app.use(morgan('dev')) //for logs 

let notes = [
    {id: "1", content: "HTML is easy", important: true},
    {id: "2", content: "Browser can execute only JavaScript", important: false},
    {id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true}
]

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0 
    return String(maxId + 1)
}

app.post('/api/notes', (request, response, next) => {
    const body = request.body 

    // the validation for empty content 
    // is moved to the model using mongoose validation

    const note = new Note({
        content: body.content, 
        important: body.important || false
    })
    note.save().then(savedNote => {
        response.json(savedNote)
    })
    .catch(error => next(error))

})

app.get('/', (request, response) => {
    response.send('<h1>Hello Worlds!</h1>')
})

app.get('/api/notes', (request, response) => {
    // response.json(notes) 
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    // const id = request.params.id 
    // const note = notes.find(note => note.id === id)

    // if (note) {
    //     response.json(note)
    // } else {
    //     response.status(404).end()
    // }
    // Note.findById(request.params.id)
    //     .then(note => {
    //         response.json(note)
    //     })
    //using Mongoose's findById method 
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        }) 
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const {content, important} = request.body 

    Note.findById(request.params.id)
        .then(note => {
            if ( !note ){
                return response.status(404).end()
            }

            note.content = content 
            note.important = important 

            return note.save().then((updatedNote) => {
                response.json(updatedNote)
            })
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    // const id = request.params.id 
    // notes = notes.filter(note => note.id !== id) 
    // response.status(204).end()
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint'})
}

// handler of requests with unknown endpoint
// this middleware for handling unsupported routes is loaded only after all the endpoints have been defined 
// just before the error handler
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message) 

    // checks if the error is a CastError exception 
    // in which case we know that the error was caused by an invalid object id for mongo
    if (error.name === 'CastError') {
        return response.status(400).json({error: 'malformatted id hehe'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message})
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this! 
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})