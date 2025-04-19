
const express = require('express') 
const app = express() 

app.use(express.json())

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
    response.json(person)

})

const PORT = 3001 
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
