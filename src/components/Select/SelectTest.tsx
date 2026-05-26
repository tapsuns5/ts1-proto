import React from "react";
import ReactSelect from "react-select";

// Simple test to check if react-select works at all
export default function SelectTest() {
  const [value, setValue] = React.useState<string | null>(null);
  
  const options = [
    { value: 'internal', label: 'Internal' },
    { value: 'external', label: 'External' },
  ];

  console.log('SelectTest render, value:', value);

  return (
    <div style={{ padding: '20px' }}>
      <h3>React Select Test</h3>
      <ReactSelect
        value={options.find(opt => opt.value === value)}
        onChange={(selectedOption) => {
          console.log('ReactSelect onChange:', selectedOption);
          setValue(selectedOption?.value || null);
        }}
        options={options}
        placeholder="Select option..."
        onMenuOpen={() => console.log('ReactSelect menu opened')}
        onMenuClose={() => console.log('ReactSelect menu closed')}
      />
      <p>Selected: {value}</p>
    </div>
  );
}
