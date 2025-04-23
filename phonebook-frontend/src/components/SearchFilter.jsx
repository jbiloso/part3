import { useState } from 'react' 

const SearchFilter = ({ persons, visiblePersons, setVisiblePersons, searchName,setSearchName}) => {

    const handleSearchChange = (event) => {
      //trim method will remove the whitespace from both ends of the string
      setSearchName(event.target.value.trim())
      // setNewSearch(searchName)
      // console.log('event.target.value is *', searchName,'*')
      // console.log('persons that should be visible are ', persons.filter((person)=> person.name.includes(searchName) ))
      setVisiblePersons(persons.filter((person)=> person.name.toLowerCase().includes(event.target.value.trim().toLowerCase())))
    //   console.log('current value of newSearch is ', event.target.value.trim())
      //as you can see here, when calling the setVisiblePersons, 
      // we are not using the value of the newSearch which has a state, 
      // because the state is updated asynchronously or late ,
      // for real time update, we use the event.target.value
      // but it is still necesarry to assign value = {searchName} to the input
    }
    return(
        <div>Search
            <input value={searchName} onChange={handleSearchChange}></input>
        </div>
    )
}

export default SearchFilter