import '../styles/Notification.css'

// component that displays a notification with a message
export default function Notification({message, isVisible}) {

    return (
        <div id="notification" className={isVisible ? "visible" : ""}>
            {message}
        </div>
    )
}