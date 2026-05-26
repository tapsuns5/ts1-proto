# DateTimePicker Guide

A flexible date and time picker component that supports both typed input and calendar selection, with smart auto-formatting and enhanced UX features.

## Quick Start

```tsx
import { DateTimePicker } from '@teamsnap/ui-components';

function MyComponent() {
  const [date, setDate] = useState<Date | null>(null);
  
  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      label="Event Date & Time"
    />
  );
}
```

## Key Features

### 🎯 Smart Auto-Formatting
Type dates naturally - the component automatically formats as you type:
- `12252024` → `12/25/2024`
- `1225202414` → `12/25/2024 02`
- `122520241430` → `12/25/2024 02:30`

### 📝 Multiple Input Methods
- **Typed input**: Direct text entry with smart formatting
- **Calendar picker**: Visual date selection with time picker
- **Mobile optimized**: Native picker on mobile devices

### 🔧 Enhanced UX
- Preserves user intent during manual editing
- Graceful error handling and validation
- Clear button for easy value removal
- Full keyboard accessibility

## Common Use Cases

### Basic Date/Time Selection
```tsx
<DateTimePicker
  value={eventDate}
  onChange={setEventDate}
  label="Event Start Time"
  placeholder="Select date and time"
/>
```

### With Validation and Help Text
```tsx
<DateTimePicker
  value={deadline}
  onChange={setDeadline}
  label="Project Deadline"
  required
  helpText="Select a future date for the project deadline"
  errors={errors.deadline ? [errors.deadline] : undefined}
/>
```

### Restricting Date Selection
```tsx
<DateTimePicker
  value={appointmentDate}
  onChange={setAppointmentDate}
  label="Appointment Date"
  calendarProps={{
    minDate: new Date(), // No past dates
    maxDate: new Date(2025, 11, 31), // No dates after Dec 31, 2025
  }}
/>
```

### With Footer Controls
```tsx
<DateTimePicker
  value={scheduledTime}
  onChange={setScheduledTime}
  label="Scheduled Time"
  withFooter
  onCaptureAction={(action) => {
    if (action === 'apply') {
      // Handle apply
    } else {
      // Handle cancel
    }
  }}
/>
```

## React Hook Form Integration

### Basic Controller Usage
```tsx
import { Controller, useForm } from 'react-hook-form';
import { DateTimePicker } from '@teamsnap/ui-components';

interface FormData {
  eventDate: Date | null;
}

function EventForm() {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="eventDate"
        control={control}
        render={({ field, fieldState }) => (
          <DateTimePicker
            value={field.value}
            onChange={field.onChange}
            label="Event Date & Time"
            errors={fieldState.error ? [fieldState.error.message] : undefined}
          />
        )}
      />
    </form>
  );
}
```

### With Validation Rules
```tsx
<Controller
  name="eventDate"
  control={control}
  rules={{
    required: "Event date is required",
    validate: (value) => {
      if (!value) return "Please select a date";
      if (value < new Date()) return "Date must be in the future";
      return true;
    }
  }}
  render={({ field, fieldState }) => (
    <DateTimePicker
      value={field.value}
      onChange={field.onChange}
      label="Event Date & Time"
      required
      errors={fieldState.error ? [fieldState.error.message] : undefined}
    />
  )}
/>
```

### TypeScript Integration
```tsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  eventDate: z.date({
    required_error: "Event date is required",
    invalid_type_error: "Please enter a valid date",
  }).refine(
    (date) => date > new Date(),
    { message: "Event date must be in the future" }
  ),
});

type FormData = z.infer<typeof schema>;

const { control } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

## Props Reference

### Core Props
| Prop | Type | Description |
|------|------|-------------|
| `value` | `Date \| null` | Current selected date/time |
| `onChange` | `(date: Date \| null) => void` | Callback when date changes |
| `label` | `string` | Input label text |
| `placeholder` | `string` | Input placeholder (default: "MM/DD/YYYY HH:MM AM") |

### UI Customization
| Prop | Type | Description |
|------|------|-------------|
| `size` | `"small" \| "default" \| "large"` | Input size variant |
| `disabled` | `boolean` | Disable the input |
| `required` | `boolean` | Mark as required field |
| `helpText` | `string` | Help text below input |
| `errors` | `string[]` | Error messages to display |
| `allowClear` | `boolean` | Show clear button when value exists |

### Calendar Configuration
| Prop | Type | Description |
|------|------|-------------|
| `calendarProps` | `CalendarProps` | Props passed to Calendar component |
| `calendarAlign` | `"start" \| "center" \| "end"` | Calendar popover alignment |
| `defaultDate` | `Date` | Default date when picker opens |

### Advanced Features
| Prop | Type | Description |
|------|------|-------------|
| `withFooter` | `boolean` | Show Apply/Cancel buttons |
| `onCaptureAction` | `(action: "apply" \| "cancel") => void` | Footer button callbacks |
| `popoverModalMode` | `boolean` | Use modal mode on mobile |

### Calendar Props (calendarProps)
| Prop | Type | Description |
|------|------|-------------|
| `minDate` | `Date` | Earliest selectable date |
| `maxDate` | `Date` | Latest selectable date |
| `showMonthDropdown` | `boolean` | Show month dropdown |
| `showYearDropdown` | `boolean` | Show year dropdown |
| `scrollableYearDropdown` | `boolean` | Make year dropdown scrollable |
| `yearDropdownItemNumber` | `number` | Number of years in dropdown |

## Examples

### Full-Featured Example
```tsx
function AppointmentScheduler() {
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DateTimePicker
      value={appointmentDate}
      onChange={setAppointmentDate}
      label="Appointment Date & Time"
      helpText="Select a future date and time for your appointment"
      required
      allowClear
      withFooter
      calendarProps={{
        minDate: today,
        showMonthDropdown: true,
        showYearDropdown: true,
        dropdownMode: "select",
      }}
      onCaptureAction={(action) => {
        if (action === 'apply') {
          console.log('Appointment scheduled:', appointmentDate);
        }
      }}
    />
  );
}
```

### Birth Date Picker
```tsx
<DateTimePicker
  value={birthDate}
  onChange={setBirthDate}
  label="Date of Birth"
  calendarProps={{
    maxDate: new Date(), // No future dates
    showMonthDropdown: true,
    showYearDropdown: true,
    scrollableYearDropdown: true,
    yearDropdownItemNumber: 100,
    dropdownMode: "select",
  }}
/>
```

## Tips & Best Practices

### Smart Typing Features
- **Pure numeric input**: Type `12252024` for quick date entry
- **Natural editing**: Edit formatted dates normally - the component won't interfere
- **Multiple formats**: Accepts `MM/DD/YYYY`, `MM/DD/YY`, and various other formats
- **AM/PM handling**: Automatically converts 24-hour to 12-hour format

### Accessibility
- Always provide a descriptive `label`
- Use `helpText` for additional context
- The component includes proper ARIA labels automatically
- Full keyboard navigation support

### Performance
- Use `React.memo` for components that render many DateTimePickers
- Consider `defaultDate` for better UX when no value is selected
- The component handles debouncing internally for optimal performance

### Form Integration
- Works seamlessly with react-hook-form, Formik, and other form libraries
- Use `Controller` component for react-hook-form integration
- Handle validation at the form level for better UX

### Mobile Considerations
- Component automatically uses native picker on mobile devices
- `popoverModalMode` can force modal behavior if needed
- Touch-friendly interface with appropriate sizing

## Common Patterns

### Conditional Date Restrictions
```tsx
const getMinDate = (userRole: string) => {
  const today = new Date();
  if (userRole === 'admin') {
    // Admins can schedule past dates
    return undefined;
  }
  // Regular users can only schedule future dates
  return today;
};

<DateTimePicker
  calendarProps={{ minDate: getMinDate(user.role) }}
  // ... other props
/>
```

### Dynamic Default Times
```tsx
const getDefaultDate = () => {
  const now = new Date();
  // Round to next 30-minute interval
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
  now.setMinutes(roundedMinutes, 0, 0);
  return now;
};

<DateTimePicker
  defaultDate={getDefaultDate()}
  // ... other props
/>
```

This guide covers the essential usage patterns and features of the DateTimePicker component. For detailed implementation information, refer to the component's TypeScript definitions and Storybook examples.
