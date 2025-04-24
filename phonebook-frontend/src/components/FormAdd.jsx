import { useState } from 'react' 
import personService from '../services/persons'



const FormAdd = ({ persons , setPersons , visiblePersons, setVisiblePersons, searchName, setNotif}) => {
    
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
      }
    
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const addContact = () => {
        event.preventDefault()
        //create contact object
        const personObject = {
          // id: persons.length+1,
          name: newName,
          number: newNumber
        }

        const person = persons.find(person => person.name.toLowerCase() === personObject.name.toLowerCase())

        if (person){ //edit 
          console.log('contact exists') 
          const confirmUpdate = window.confirm(`Contact name '${personObject.name}' already exists. Do you want to update their number?`)
          if(confirmUpdate){
            personService
              .update(person.id, personObject)
              .then(response => {
                // console.log(response)
                const updatedPersons = persons.map(p => 
                  p.id === person.id ? response : p
                )
                setPersons(updatedPersons)
                // console.log('updated persons: ', updatedPersons)
                setVisiblePersons(updatedPersons.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase())))
                // console.log('updated visible persons: ', visiblePersons)
                // alert(`Updated ${person.name}'s number successfully!`)
                setNotif(['update',`Updated ${person.name}'s number`])
              })
              .catch(error => {
                console.log(error.response.data.error)
                setNotif(['delete', 'Number validation failed! '])
              }) 

                // Remove the deleted person locally

          }
          // personService
          //   .update()
        }else{ //simply add
          personService
          .create(personObject)
          .then(returnedPerson => {
            const updatedPersons = persons.concat(returnedPerson)
            setPersons(updatedPersons)
            // console.log(updatedPersons)
            setVisiblePersons(updatedPersons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase())))
            setNotif(['add',`Added ${returnedPerson.name}`])
          })
          .catch(error => {
            console.log(error.response.data.error)
            setNotif(['delete', 'Name or number validation failed! '])
          }) 
        }
        setNewName('')
        setNewNumber('')

        // // list of names
        // const names = persons.map(person => person.name)
        // // console.log(names.includes(personObject.name))
        // if (!names.includes(personObject.name)){
        //     setPersons(persons.concat(personObject)) //add contact
        //     const localPersons = ([...persons, personObject])
        //     setVisiblePersons(localPersons.filter((person)=> person.name.toLowerCase().includes(searchName.toLowerCase())))
        //     // console.log('perons ',persons)
        //     // console.log(personObject.name)
        // }else{
        //   {alert(`${personObject.name} is already added to phonebook`)} //show alert
        // }

      }
    return (
        <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}></input>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default FormAdd