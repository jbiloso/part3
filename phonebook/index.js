
const express = require('express') 
const app = express() 

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
        "id":"1",
        "name":"Arto Hellas", 
        "number":"040-123456"
    },
    {
        "id":"1",
        "name":"Arto Hellas", 
        "number":"040-123456"
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Hello worlddd!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const info = 
    `<div><div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div></div>`;
    response.send(info)
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

const PORT = 3001 
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
