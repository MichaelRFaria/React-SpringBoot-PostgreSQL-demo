import '../styles/Alert.css'

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