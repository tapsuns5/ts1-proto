"use client";

import { useState } from "react";

interface SimpleCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function SimpleCheckbox({ checked = false, onChange, disabled = false }: SimpleCheckboxProps) {
  const handleChange = () => {
    if (disabled) return;
    const newChecked = !checked;
    onChange?.(newChecked);
  };

  return (
    <div className="sui-relative sui-inline-flex sui-items-center sui-justify-center sui-cursor-pointer sui-w-3 sui-h-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sui-w-full sui-h-full sui-cursor-pointer sui-opacity-0 sui-absolute sui-z-10"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        aria-hidden="true"
        className="sui-w-full sui-h-full"
      >
        {checked ? (
          <path fill="#0066CC" d="M4.25 17.5q-.73 0-1.24-.51a1.7 1.7 0 0 1-.51-1.24V4.25q0-.73.51-1.24t1.24-.51h11.5q.73 0 1.24.51t.51 1.24v11.5q0 .73-.51 1.24t-1.24.51zm4.625-4.312a.86.86 0 0 0 .625-.271l4.625-4.625a.82.82 0 0 0 .25-.604.9.9 0 0 0-.25-.626.9.9 0 0 0-.625-.25.82.82 0 0 0-.604.25l-4.021 4.021-1.75-1.75a.82.82 0 0 0-.604-.25.82.82 0 0 0-.604.25.86.86 0 0 0-.271.625q0 .354.271.604l2.333 2.355a.855.855 0 0 0 .625.271" />
        ) : (
          <path fill="#666666" d="M4.5 17q-.625 0-1.062-.438A1.44 1.44 0 0 1 3 15.5v-11q0-.625.438-1.062A1.44 1.44 0 0 1 4.5 3h11q.625 0 1.062.438Q17 3.875 17 4.5v11q0 .625-.438 1.062A1.44 1.44 0 0 1 15.5 17zm0-1.5h11v-11h-11z" />
        )}
      </svg>
      <label></label>
    </div>
  );
}
