import '../styles/Notification.css'
import {useEffect, useState} from "react";

// component that displays a notification with a message
export default function Notification({message, isVisible, time, onClick}) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            setTimeout(() => {
                setProgress(0);
            }, 500);
            return;
        }

        const startTime = performance.now();

        function update(now) {
            const elapsedTime = now - startTime;
            const percent = Math.min((elapsedTime / time) * 100, 100);

            setProgress(percent);

            if (percent < 100) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }, [isVisible, time]);


    return (
        <div id="notification" className={isVisible ? "visible" : ""} onClick={onClick}>
            <p>{message}</p>
            <progress id="notificationProgressBar" value={progress} max="100"></progress>
        </div>
    )
}