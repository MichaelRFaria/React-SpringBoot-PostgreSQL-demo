import '../styles/Notification.css'

export default function Notification({message, isVisible}) {

    return (
        <div id={`notification${isVisible ? 'Visible' : 'Invisible'}`}>
            {message}
        </div>
    )
}