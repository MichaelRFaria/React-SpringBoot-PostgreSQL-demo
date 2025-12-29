import '../styles/Alert.css'

// component that displays an alert box with a message and confirmation and cancellation options
export default function Alert({message, isVisible, action1, action2}) {

    return (
        <div id="alert" className={isVisible ? "visible" : ""}>
            {message}
            <div id="buttons">
                <button onClick={action2}>Cancel</button>
                <button onClick={action1}>Confirm</button>
            </div>
        </div>
    )
}