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


let persons = [
    {
        "id":"1",
        "name":"Arto Hellas", 
        "number":"040-123456"
    },
    {
        "id":"2",
        "name":"Ada Lovelace", 
        "number":"39.44.5323523"
    },
    {
        "id":"3",
        "name":"Jake Martin", 
        "number":"11-22-35242"
    },
    {
        "id":"5",
        "name":"Sandy Antonio", 
        "number":"76-34334-23"
    },
]

const generateId= () => {
    const id = Math.floor(Math.random() * 1000000)
    return id.toString() //convert to strings because ids are strings
} 

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
    const info = 
    `<div><div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div></div>`;
    response.send(info) 
    //we use .send method for passign HTML/plain text/files, anything that is not JSON
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    const person = persons.find(person => person.id === id) 

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body 


    // check if there is no name or number 
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and number cannot be blank'
        })
    } 

    // check if the name is a duplicate in phonebook
    if(persons.some(person => person.name === body.name)){
        return response.status(400).json({
            error: `contact name '${body.name}' already exists`
        })
    }

    const person = {
        id: generateId(),
        name: body.name, 
        number: body.number
    }

    persons = persons.concat(person) 
    response.status(201).json(person) // 201 = created

})

const unknownEndpoint = (request, response) => {
    response.status(404).json({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
