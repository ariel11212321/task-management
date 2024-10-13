class DateHelper {
    formatDate(isoDateString) {
        const date = new Date(isoDateString);
        return date.toISOString().substring(0, 10);
    }
}

export default new DateHelper();

