const mongoose  = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

//we added the word noteApp in here , that will be the name of the database 
const url = `mongodb+srv://fullstack:${password}@fso.unjlhhh.mongodb.net/noteApp?retryWrites=true&w=majority&appName=FSO`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// schema definition
// tells the Mongoose how the note objects are to be stored in the database

const noteSchema = new mongoose.Schema({
    content: String, 
    important: Boolean,
})

// model definition
 //the first param is the singular name of the model
 // the name of the collection will be the lowercase plural notes, 
//  because the Mongoose conention is to automatically name collections as the plural 
// when the schema refers to them in the singular 
// so database is named noteApp, 
// and the collection is named notes
const Note = mongoose.model('Note', noteSchema)
// so the Note here is a model, a model is a constructor function that creates new JavaScript objects
// based on the provided parameters. Since the obejcts are created with the model's constructor function
// they have all the properties of the model, which include methods for saving the object to the database. 


// saving the object to the database uses save method, 
// which can be proided with an event handler with then method
// const note = new Note({
//     content: 'ComSci is heart',
//     important: false,
// })

// // the result of the save operation is in the result parameter of the event handler 
// note.save().then(result => {
//     console.log('note saved')
//     mongoose.connection.close()
// }) 

//the objects are retrieved from the database with the find method od the Note model 
// the parameter of the method is an object expressing search conditions 
// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })


// here, we only restrict the search conditions to notes with important value set to false
Note.find({ important: false}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})