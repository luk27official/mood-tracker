export const getDayBefore = (timestamp: number) => {
    const date = new Date(timestamp);
    date.setDate(date.getDate() - 1);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

export const getTodayDate = () => {
    const today = new Date();
    // If it's before 6am, it's still yesterday
    const hours = today.getHours();
    if (hours < 6) {
        return getDayBefore(today.getMilliseconds());
    }

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
};