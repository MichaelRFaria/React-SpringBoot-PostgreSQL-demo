// simple helper function to convert a string from the dd-mm-yyyy date format to yyyy-mm-dd (and vice versa)
// (which is the format of LocalDate, and is used for the database)
// used to prepare dates for date comparisons and converting to LocalDate type format
export function convertDate(date) {
    const [d, m, y] = date.split('-');
    return `${y}-${m}-${d}`;
}

// simple helper function to convert a string from the yyyy-mm-dd date format to a human-readable format
// 2025-01-23 -> "23 Jan, 2025"
export function convertDateToReadable(date) {
    const [y, m, d] = date.split('-');
    const monthNumToWord = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    }

    return `${d} ${monthNumToWord[m]}, ${y}`;
}

export function comparePriority(a, b) {
    const map = {
        "High": 0,
        "Medium": 1,
        "Low": 2
    }

    return map[a] - map[b];
}

export function daysRemaining(date, type) {
    const [y, m, d] = date.split('-'); // yyyy-mm-dd
    const today = new Date(); // date now
    const taskDate = new Date(y, m - 1, d); // due date (month is zero-indexed)
    const timeDifference = taskDate.getTime() - today.getTime(); // time until due date (milliseconds)

    const daysRemaining = timeDifference / 1000 / 60 / 60 / 24;

    if (daysRemaining < 0 && type === "due") {
        return "Overdue!";
    } else if (daysRemaining > 0 && type === "start") {
        return "Started!";
    }

    return Math.abs(Math.ceil(daysRemaining));
}