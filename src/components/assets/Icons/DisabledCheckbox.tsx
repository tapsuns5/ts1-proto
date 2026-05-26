import * as React from 'react';
import type { SVGProps } from 'react';
const SvgDisabledCheckbox = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    {...props}
  >
    <path d='M4.25 17.5q-.73 0-1.24-.51a1.7 1.7 0 0 1-.51-1.24V4.25q0-.73.51-1.24t1.24-.51h11.5q.73 0 1.24.51t.51 1.24v11.5q0 .73-.51 1.24t-1.24.51z' />
  </svg>
);
export default SvgDisabledCheckbox;
