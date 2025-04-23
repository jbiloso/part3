import { useState, useEffect } from 'react'
import axios from 'axios' 
import Persons from './components/Persons'
import FormAdd from './components/FormAdd'
import SearchFilter from './components/SearchFilter'

import personService from './services/persons'

import Notification from './components/Notification' 

const App = () => {
  // const [persons, setPersons] = useState([
  //   { id: 1, name: 'Arto Hellas', number:'39-44-3225225'},
  //   { id: 2, name: 'Ada Lovelace', number: '39-44-5323523'},
  //   { id: 3, name: 'Dan Abramov', number:'12-43-234345'},
  //   { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122'},
  // ])
  const [persons, setPersons] = useState([])

  const [visiblePersons, setVisiblePersons] = useState(persons)
  const [searchName , setSearchName ] = useState('')
  const [notif, setNotif] = useState(['','']) //first parameter is the type , second param is the message 
                                              //types are : add, delete, update

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(returnedPersons =>{
        // console.log('initial persons ',returnedPersons)
        setPersons(returnedPersons)
        setVisiblePersons(returnedPersons.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase())))
      })
  }
  useEffect(hook, [])
  // console.log('render',persons.length, 'persons')

  const deletePerson = (person) => { 
    window.confirm(`Are you sure you want to delete ${person.name}?`)
    personService
        .remove(person.id)
        .then(response => {
            // console.log(response)
            const currentPersons = persons.filter(p => p.id !== person.id )
            // console.log('current persons after delete, ', currentPersons)
            setPersons(currentPersons)
            setVisiblePersons(currentPersons.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase())))
            setNotif(['delete',`Deleted ${person.name}`])
            
        })
        .catch(error => { //this is when trying to delete a contact, that's been deleted from the server using another browser
            const filteredPersons = persons.filter(p => p.id !== person.id);
            setPersons(filteredPersons);
            setVisiblePersons(
              filteredPersons.filter(p => 
                p.name.toLowerCase().includes(searchName.toLowerCase())
              )
            );
          
            setNotif([
              'delete',
              `Information of ${person.name} has already been removed from server`
            ]);
          
          })
  }
  return(
    <div>
      <h2>Phonebook</h2>
      <Notification type={notif[0]} message={notif[1]}></Notification>
      <SearchFilter 
        persons={persons} 
        visiblePersons={visiblePersons} 
        setVisiblePersons={setVisiblePersons} 
        searchName={searchName} 
        setSearchName={setSearchName}
      ></SearchFilter>

      <h3>Add New</h3>
      <FormAdd 
        persons={persons} 
        setPersons={setPersons} 
        visiblePersons={visiblePersons} 
        setVisiblePersons={setVisiblePersons} 
        searchName={searchName}
        setNotif= {setNotif}> 
      </FormAdd>

      <h3>Numbers</h3>
      <Persons 
        visiblePersons={visiblePersons}
        deletePerson = {deletePerson}
      ></Persons>
    </div>
  )
}
export default App