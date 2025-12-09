import '../styles/Notification.css'

export default function Notification({message, isVisible}) {

    return (
        <div id="notification" className={isVisible ? "visible" : ""}>
            {message}
        </div>
    )
}