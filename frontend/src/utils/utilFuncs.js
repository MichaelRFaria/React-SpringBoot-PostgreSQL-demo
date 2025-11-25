// simple helper function to convert a string from the dd-mm-yyyy date format to yyyy-mm-dd (and vice versa) (which is the format of LocalDate, and is used for the database)
export function convertDate(date) {
    const [d, m, y] = date.split('-');
    return `${y}-${m}-${d}`;
}

export function comparePriority(a, b) {
    const map = {
        "High": 0,
        "Medium": 1,
        "Low": 2
    }

    return map[a] - map[b];
}

export function daysRemaining(date) {
    const [y, m, d] = date.split('-'); // yyyy-mm-dd
    const today = new Date(); // date now
    const dueDate = new Date(y,m-1,d); // due date (month is zero-indexed)
    const timeDifference = dueDate.getTime() - today.getTime(); // time until due date (milliseconds)

    const daysRemaining = timeDifference / 1000 / 60 / 60 / 24;
    return Math.ceil(daysRemaining);
}