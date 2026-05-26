import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimePicker from './DateTimePicker';

describe('DateTimePicker Enhanced UX', () => {
  const user = userEvent.setup();

  describe('Smart Input Formatting', () => {
    it('should auto-format numeric input as user types', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Type digits and expect auto-formatting
      await user.type(input, '12');
      expect(input).toHaveValue('12');
      
      await user.type(input, '25');
      expect(input).toHaveValue('12/25');
      
      await user.type(input, '2024');
      expect(input).toHaveValue('12/25/2024');
      
      await user.type(input, '02');
      expect(input).toHaveValue('12/25/2024 02');
      
      await user.type(input, '30');
      expect(input).toHaveValue('12/25/2024 02:30');
    });

    it('should not interfere with manual editing of formatted dates', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      // Type a complete formatted date
      await user.type(input, '12/25/2024 2:30 PM');
      expect(input).toHaveValue('12/25/2024 2:30 PM');
      
      // Clear and type a different date to test that properly formatted dates are preserved
      await user.clear(input);
      await user.type(input, '12/31/2024 2:30 PM');
      expect(input).toHaveValue('12/31/2024 2:30 PM');
    });

    it('should preserve user intent when editing', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker value={new Date('2024-12-25T14:30:00')} onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Should show formatted value
      expect(input).toHaveValue('12/25/2024 02:30 PM');
      
      // Clear and type new value
      await user.clear(input);
      await user.type(input, '01/15/2025 10:45 AM');
      
      // Should not auto-format since it's already properly formatted
      expect(input).toHaveValue('01/15/2025 10:45 AM');
    });
  });

  describe('Enhanced Date Parsing', () => {
    it('should parse various date formats on blur', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Test MM/DD/YYYY HH:MM AM/PM format
      await user.type(input, '12/25/2024 2:30 PM');
      await user.tab(); // Trigger blur
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            getFullYear: expect.any(Function),
            getMonth: expect.any(Function),
            getDate: expect.any(Function),
          })
        );
      });
      
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(2024);
      expect(calledDate.getMonth()).toBe(11); // December (0-indexed)
      expect(calledDate.getDate()).toBe(25);
      expect(calledDate.getHours()).toBe(14); // 2 PM in 24-hour format
      expect(calledDate.getMinutes()).toBe(30);
    });

    it('should handle 2-digit years correctly', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      await user.type(input, '12/25/24 2:30 PM');
      await user.tab();
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
      
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(2024);
    });

    it('should handle AM/PM conversion correctly', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Test 12 AM (should be 0 hours)
      await user.type(input, '12/25/2024 12:00 AM');
      await user.tab();
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
      
      let calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getHours()).toBe(0);
      
      // Clear and test 12 PM (should be 12 hours)
      onChange.mockClear();
      await user.clear(input);
      await user.type(input, '12/25/2024 12:00 PM');
      await user.tab();
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
      
      calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getHours()).toBe(12);
    });

    it('should revert to previous value on invalid input', async () => {
      const initialDate = new Date('2024-12-25T14:30:00');
      const onChange = jest.fn();
      render(<DateTimePicker value={initialDate} onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Type invalid date
      await user.clear(input);
      await user.type(input, 'invalid date');
      await user.tab();
      
      // Should revert to original formatted value
      expect(input).toHaveValue('12/25/2024 02:30 PM');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should handle empty input correctly', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Type something then clear it
      await user.type(input, '12/25/2024');
      await user.clear(input);
      await user.tab();
      
      // Should call onChange with null
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  describe('User Experience Improvements', () => {
    it('should show helpful placeholder text', () => {
      render(<DateTimePicker />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY HH:MM AM');
    });

    it('should maintain cursor position during formatting', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      // Type partial date
      await user.type(input, '1225');
      expect(input).toHaveValue('12/25');
      
      // Cursor should be at the end
      expect(input.selectionStart).toBe(5);
      expect(input.selectionEnd).toBe(5);
    });

    it('should handle clear functionality', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker value={new Date()} onChange={onChange} allowClear />);
      
      const clearButton = screen.getByTestId('datetimepicker-clear-icon');
      await user.click(clearButton);
      
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('should prevent popover from opening when clicking clear', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker value={new Date()} onChange={onChange} allowClear />);
      
      const clearButton = screen.getByTestId('datetimepicker-clear-icon');
      await user.click(clearButton);
      
      // Popover should not be open
      expect(screen.queryByTestId('datetimepicker-popover-content')).not.toBeInTheDocument();
    });

    it('should open popover when clicking calendar icon', async () => {
      render(<DateTimePicker />);
      
      const calendarIcon = screen.getByTestId('datetimepicker-calendar-icon');
      await user.click(calendarIcon);
      
      // Popover should be open
      expect(screen.getByTestId('datetimepicker-popover-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(<DateTimePicker label="Event Date" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Event Date');
    });

    it('should have default aria-label when no label provided', () => {
      render(<DateTimePicker />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Select date and time');
    });

    it('should be keyboard navigable', async () => {
      render(<DateTimePicker />);
      const input = screen.getByRole('textbox');
      
      // Should be focusable
      await user.tab();
      expect(input).toHaveFocus();
      
      // Should be able to type
      await user.type(input, '12/25/2024');
      expect(input).toHaveValue('12/25/2024');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid typing without interference', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Simulate rapid typing
      await user.type(input, '12252024');
      
      // Should format correctly even with rapid input
      expect(input).toHaveValue('12/25/2024');
    });

    it('should handle backspacing through formatted characters', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      await user.type(input, '12/25/2024');
      
      // Backspace should work naturally
      await user.type(input, '{backspace}{backspace}{backspace}{backspace}{backspace}');
      expect(input).toHaveValue('12/25');
    });

    it('should handle pasting formatted dates', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Simulate pasting a formatted date
      await user.click(input);
      await user.paste('12/25/2024 2:30 PM');
      
      expect(input).toHaveValue('12/25/2024 2:30 PM');
    });

    it('should allow editing AM/PM portion without interference', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      // Type a complete formatted date with AM
      await user.type(input, '12/25/2024 2:30 AM');
      expect(input).toHaveValue('12/25/2024 2:30 AM');
      
      // Clear the input and type a new value with PM to test manual editing
      await user.clear(input);
      await user.type(input, '12/25/2024 2:30 PM');
      
      expect(input).toHaveValue('12/25/2024 2:30 PM');
    });

    it('should allow deleting AM/PM portion', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      // Type a complete formatted date with PM
      await user.type(input, '12/25/2024 2:30 PM');
      expect(input).toHaveValue('12/25/2024 2:30 PM');
      
      // Clear and type without AM/PM to test partial input
      await user.clear(input);
      await user.type(input, '12/25/2024 2:30');
      
      expect(input).toHaveValue('12/25/2024 2:30');
    });

    it('should allow typing partial AM/PM values', async () => {
      const onChange = jest.fn();
      render(<DateTimePicker onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Type a date with time but no AM/PM
      await user.type(input, '12/25/2024 2:30 ');
      expect(input).toHaveValue('12/25/2024 2:30 ');
      
      // Add just "A" (partial AM)
      await user.type(input, 'A');
      expect(input).toHaveValue('12/25/2024 2:30 A');
      
      // Complete with "M"
      await user.type(input, 'M');
      expect(input).toHaveValue('12/25/2024 2:30 AM');
    });
  });
});
