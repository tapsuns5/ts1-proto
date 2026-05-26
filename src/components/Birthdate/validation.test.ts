import  { isValidDate, getBirthdateErrors, getAgeFromBirthdate } from './validation';

describe('isValidDate', () => {
    it('should return true for valid dates', () => {
        expect(isValidDate('2020-01-01')).toBe(true);
        expect(isValidDate('2020-02-29')).toBe(true);
        expect(isValidDate('2020-12-31')).toBe(true);
    })
    it('should return false for invalid dates', () => {
        expect(isValidDate('2020-00-01')).toBe(false);
        expect(isValidDate('2020-13-01')).toBe(false);
        expect(isValidDate('2020-01-00')).toBe(false);
        expect(isValidDate('2020-01-32')).toBe(false);
        expect(isValidDate('2020-02-30')).toBe(false);
    })
    it('should return false for invalid formats', () => {
        expect(isValidDate('2020-1-1')).toBe(false);
        expect(isValidDate('2020-01-1')).toBe(false);
        expect(isValidDate('2020-1-01')).toBe(false);
        expect(isValidDate('2020-01-')).toBe(false);
        expect(isValidDate('2020-01-1-')).toBe(false);
        expect(isValidDate('')).toBe(false);
        expect(isValidDate(':taco:')).toBe(false);
    })
});

describe('getBirthdateErrors', () => {
    it('should return undefined for valid dates', () => {
        expect(getBirthdateErrors('2020-01-01')).toBe(undefined);
        expect(getBirthdateErrors('2020-02-29')).toBe(undefined);
        expect(getBirthdateErrors('2020-12-31')).toBe(undefined);
    })
    it('should return error message for invalid dates', () => {
        expect(getBirthdateErrors('2020-00-01')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-13-01')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-01-00')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-01-32')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-02-30')).toBe('Add a valid date');
    })
    it('should return error message for invalid formats', () => {
        expect(getBirthdateErrors('2020-1-1')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-01-1')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-1-01')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-01-')).toBe('Add a valid date');
        expect(getBirthdateErrors('2020-01-1-')).toBe('Add a valid date');
        expect(getBirthdateErrors('')).toBe('Add a valid date');
        expect(getBirthdateErrors(':taco:')).toBe('Add a valid date');
    })
    it('should return error message for dates out of range', () => {
        expect(getBirthdateErrors('1800-01-01')).toBe('Birthdate is out of range');
        expect(getBirthdateErrors('0000-01-01')).toBe('Birthdate is out of range');
    })
    it('should return error message for dates below min age', () => {
        expect(getBirthdateErrors('2020-01-01', 130, 13)).toBe('Birthdate does not meet minimum age');
    })
    it('should return custom error messages', () => {
        expect(getBirthdateErrors('2020-00-01', 120, 13, { valid: 'Invalid date', limit: 'Out of range',
            min: 'Too young'})).toBe('Invalid date');
        expect(getBirthdateErrors('1900-01-01', 120, 13, { valid: 'Invalid date', limit: 'Out of range',
            min: 'Too young'})).toBe('Out of range');
        expect(getBirthdateErrors('2020-01-01', 120, 13, { valid: 'Invalid date', limit: 'Out of range',
            min: 'Too young'})).toBe('Too young');
    });
});

describe('getAgeFromBirthdate', () => {
    let originalDate: typeof Date;

    beforeAll(() => {
        originalDate = global.Date;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
  
    it('should return the correct age', () => {
        const mockDate = new Date('2024-09-22T00:00:00Z');

        jest.spyOn(global, 'Date').mockImplementation((arg: string | number | Date) => {
            if (!arg) {
                // mocks the "now" date
                return mockDate;
            }
            // dont mock the passed in date
            return new originalDate(arg);
        });

        expect(getAgeFromBirthdate('2020-01-01')).toBe(4);
        expect(getAgeFromBirthdate('2000-01-01')).toBe(24);
        expect(getAgeFromBirthdate('2000-01-01')).toBe(24);
        expect(getAgeFromBirthdate('1900-01-01')).toBe(124);
        // edge cases around birthday
        expect(getAgeFromBirthdate('2011-09-10')).toBe(13);
        expect(getAgeFromBirthdate('2011-09-20')).toBe(13);
        expect(getAgeFromBirthdate('2011-09-21')).toBe(13);
        expect(getAgeFromBirthdate('2011-09-22')).toBe(12); // birthday is today but utc round down
        expect(getAgeFromBirthdate('2011-09-24')).toBe(12);
        expect(getAgeFromBirthdate('2011-09-25')).toBe(12);
        expect(getAgeFromBirthdate('2011-10-22')).toBe(12);
    })
});
