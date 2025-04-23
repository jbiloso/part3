import Person from './Person'
const Persons = ({ visiblePersons, deletePerson }) => {
    return (
        <div>
        {visiblePersons.map(person => 
            <Person person={person} key={person.id} deletePerson={deletePerson} ></Person>
        )}
        </div>
    )
}
export default Persons