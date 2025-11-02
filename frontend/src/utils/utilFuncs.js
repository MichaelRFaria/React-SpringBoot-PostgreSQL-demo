// simple helper function to convert a string from the dd-mm-yyyy date format to yyyy-mm-dd (and vice versa) (which is the format of LocalDate, and is used for the database)
export function convertDate(date) {
    const [d, m, y] = date.split('-');
    return `${y}-${m}-${d}`;
}