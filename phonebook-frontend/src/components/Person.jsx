const Person = ({ person, deletePerson }) => {

    return(
        <div>           
            <button onClick={()=>deletePerson(person)}>delete </button>
                {person.name}
            <strong> {person.number}   </strong>
        </div>
    )
}
export default Person