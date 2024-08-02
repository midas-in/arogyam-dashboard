
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
export const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleString().split(',')[0].replaceAll('/', '-') : ''
}
