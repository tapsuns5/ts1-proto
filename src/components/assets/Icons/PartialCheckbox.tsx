import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPartialCheckbox = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    {...props}
  >
    <path d='M6.875 10.875h6.25a.84.84 0 0 0 .615-.26A.84.84 0 0 0 14 10a.84.84 0 0 0-.26-.615.84.84 0 0 0-.615-.26h-6.25a.84.84 0 0 0-.615.26A.84.84 0 0 0 6 10q0 .354.26.615.261.26.615.26M4.25 17.5q-.73 0-1.24-.51a1.7 1.7 0 0 1-.51-1.24V4.25q0-.73.51-1.24t1.24-.51h11.5q.73 0 1.24.51t.51 1.24v11.5q0 .73-.51 1.24t-1.24.51zm0-1.75h11.5V4.25H4.25z' />
  </svg>
);
export default SvgPartialCheckbox;
