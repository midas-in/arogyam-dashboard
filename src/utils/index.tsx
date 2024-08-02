
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
export const formatDate = (date?: Date | string) => {
    return date ? new Date(date).toLocaleString('en-In', { timeZone: 'Asia/Kolkata' }).split(',')[0].replaceAll('/', '-') : ''
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
