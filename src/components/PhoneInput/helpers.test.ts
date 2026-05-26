import { formatPhoneNumber, phoneNumberToE164, isValidPhoneNumber} from './helpers';

describe('Input helpers', () => {
    describe('formatPhoneNumber', () => {
        it('should format US phone numbers', () => {
            expect(formatPhoneNumber('8005551234', 'US')).toBe('(800) 555-1234');
            expect(formatPhoneNumber('18005551234', 'US')).toBe('1 (800) 555-1234');
            expect(formatPhoneNumber('+18005551234', 'US')).toBe('+1 800 555 1234');
        });
        it('should format intl phone numbers', () => {
            expect(formatPhoneNumber('+37060112345', 'GB')).toBe('+370 601 12345');
            expect(formatPhoneNumber('+447911123456', "LT")).toBe('+44 7911 123456');
        });
        it('should formatintl phone number when US is default', () => {
            expect(formatPhoneNumber('+37060112345', 'US')).toBe('+370 601 12345');
            expect(formatPhoneNumber('+447911123456', 'US')).toBe('+44 7911 123456');
        });
    });
    
    describe('phoneNumberToE164', () => {
        it('should convert phone number to E164 format', () => {
            expect(phoneNumberToE164('1234567890')).toBe('+11234567890');
            expect(phoneNumberToE164('+370 601 12345')).toBe('+37060112345');
            expect(phoneNumberToE164('+44 7911 123456')).toBe('+447911123456');
        });
    });
    
    describe('isValidPhoneNumber', () => {
        it('should return true for valid phone number', () => {
            expect(isValidPhoneNumber('18005551234')).toBe(true);
        });
    
        it('should return false for invalid phone number', () => {
            expect(isValidPhoneNumber('5')).toBe(false);
        });
    });
});
