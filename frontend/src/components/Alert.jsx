import '../styles/Alert.css'

// component that displays an alert box with a message and confirmation and cancellation options
export default function Alert({message, isVisible, action1, action2, onClick}) {

    return (
        <div id="alert" className={isVisible ? "visible" : ""}>
            <div id="alertHeader">
                <span></span>
                <button onClick={onClick}>×</button>
            </div>
            {message}
            <div id="alertButtons">
                <button onClick={action2}>Cancel</button>
                <button onClick={action1}>Confirm</button>
            </div>
        </div>
    )
}