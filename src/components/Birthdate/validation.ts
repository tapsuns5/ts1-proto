export const isValidDate = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return false;
    }
    const [year, month, day] = date.split('-').map(Number);
    const isValidMonth = month >= 1 && month <= 12;
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth = [
        31,
        isLeapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];
    const isValidDay = day >= 1 && day <= daysInMonth[month - 1];
    return isValidMonth && isValidDay;
};

export const getAgeFromBirthdate = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the birthdate hasn't occurred yet this year, subtract 1 from the age
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() <= birthDate.getDate())) {
        age--;
    }
    
    return age;
}

export const getBirthdateErrors = (birthdate: string, limit = 130, min = 0, errorText = { valid: 'Add a valid date', limit: 'Birthdate is out of range', min: 'Birthdate does not meet minimum age'}): string | undefined => {
    if (!birthdate || !isValidDate(birthdate)) {
        return errorText.valid;
    }
    const age = getAgeFromBirthdate(birthdate);
    if (age < 0) {
        return errorText.valid;
    }
    if (age > limit) {
        return errorText.limit;
    }
    if (age < min) {
        return errorText.min;
    }
    return;
}
