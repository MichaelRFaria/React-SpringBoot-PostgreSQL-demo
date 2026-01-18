import {useEffect, useState} from "react";
import '../styles/Notification.css'

// component that displays a notification with a message
export default function Notification({message, isVisible, time, onClick}) {
    const [progress, setProgress] = useState(0);

    // handles animating the progress bar indicating the timeout of the notification
    useEffect(() => {
        // if the notification is no longer visible then, we reset the progress after a 500ms delay, which is how long the notification takes to move off the screen
        if (!isVisible) {
            setTimeout(() => {
                setProgress(0);
            }, 500);
            return;
        }

        const startTime = performance.now();

        // request update call on next before browser repaint
        requestAnimationFrame(update);

        function update(now) { // now = performance.now()
            const elapsedTime = now - startTime;
            const percent = Math.min((elapsedTime / time) * 100, 100);

            setProgress(percent);

            // while the progress bar is not full, request another update before next browser repaint
            if (percent < 100) {
                requestAnimationFrame(update);
            }
        }
    }, [isVisible, time]);


    return (
        <div id="notification" className={isVisible ? "visible" : ""} onClick={onClick}>
            <p>{message}</p>
            <progress id="notificationProgressBar" value={progress} max="100"></progress>
        </div>
    )
}