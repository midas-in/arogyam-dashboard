
export const getAge = (dateString: string | number | Date) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const getUrlOrigin = (url: string) => {
    if (!url) return '';
    try {
        return new URL(url).origin;
    }
    catch (e) {
        return '';
    }
}
export const formatDate = (date?: Date | string | null, separator: string = '-') => {
    return date ? new Date(date).toLocaleString('en-In', { timeZone: 'Asia/Kolkata' }).split(',')[0].replaceAll('/', separator) : ''
}

export const formatDateTime = (dateTime?: Date | string | null) => {
    if (!dateTime) {
        return '';
    }
    const date = new Date(dateTime);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, set it to 12 (midnight or noon)
    const paddedHours = (hours).toString().padStart(2, '0');

    const formattedTime = `${paddedHours}:${minutes} ${ampm}`;
    const formattedDate = `${day}/${month}/${year} - ${formattedTime}`;

    return formattedDate;
}

/**
 * Subtracts a specified number of days from a given date.
 * @param {Date} date - The date from which to subtract days.
 * @param {number} days - The number of days to subtract.
 * @returns {Date} - The new date after subtracting the specified number of days.
 */
export const subDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

export const capitalizeFirstLetter = (string: string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}
