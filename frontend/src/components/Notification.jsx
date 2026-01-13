import '../styles/Notification.css'

// component that displays a notification with a message
export default function Notification({message, isVisible, onClick}) {

    return (
        <div id="notification" className={isVisible ? "visible" : ""} onClick={onClick}>
            {message}
        </div>
    )
}