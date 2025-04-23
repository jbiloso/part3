const Notification = ({ type, message }) => {
    return (
        <div className="notif-div">
             <p className={type}>{message}</p>
        </div>
    )
}
export default Notification