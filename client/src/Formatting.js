import moment from "moment";

export function formatDisplayDate(date) {
    return (
        moment(date).format("MMMM Do, YYYY")
    );
}