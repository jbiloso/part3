const mongoose = require('mongoose') 

//check if the password is given as third argument 
// node mongo.js <password>
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

// get the password and input it in the connection string
const password = process.argv[2] 
const url = `mongodb+srv://fullstack:${password}@fso.unjlhhh.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FSO`

mongoose.set('strictQuery', false) 

//create a schema, like a blueprint of the object
const contactSchema = new mongoose.Schema({
    name: String, 
    number: String, 
})

//Create a model  
const Contact = mongoose.model('Contact', contactSchema)

// try to build connection 
async function connectToDB () {
    try {
        await mongoose.connect(url); 
        console.log('Connected to MongoDB successfully\n') 

        // if the only argument given is the password
        // display all the entries in the phonebook 
        if(process.argv.length === 3) { 
            await showContacts();
        } 
        // if the given arguments is 5 (ex: node mongo.js "name surname" number)
        // add contact
        if (process.argv.length === 5){ 
            await addContact(); 
        }
    }catch(error) {
        console.log('Connection to MongoDB failed: ', error.message)
    }finally{
        await mongoose.connection.close();
    }
}

async function showContacts(){
    console.log('Phonebook:')
    const contacts = await Contact.find({});
    contacts.forEach(contact => {
        // console.log(contact)
        console.log(`${contact.name} ${contact.number}`)
    })
}

async function addContact(){
    // console.log('add this ')
    const name = process.argv[3] 
    const number = process.argv[4]  

    const newContact = new Contact({
        name: name,
        number: number,
    }) 
    await newContact.save();
        console.log('Contact saved!')
}

connectToDB();








