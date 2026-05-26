import * as React from 'react';
import type { SVGProps } from 'react';
const SvgActiveCheckbox = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    {...props}
  >
    <path d='M4.25 17.5q-.73 0-1.24-.51a1.7 1.7 0 0 1-.51-1.24V4.25q0-.73.51-1.24t1.24-.51h11.5q.73 0 1.24.51t.51 1.24v11.5q0 .73-.51 1.24t-1.24.51zm4.625-4.312a.86.86 0 0 0 .625-.271l4.625-4.625a.82.82 0 0 0 .25-.604.9.9 0 0 0-.25-.626.9.9 0 0 0-.625-.25.82.82 0 0 0-.604.25l-4.021 4.021-1.75-1.75a.82.82 0 0 0-.604-.25.82.82 0 0 0-.604.25.86.86 0 0 0-.271.625q0 .354.271.604l2.333 2.355a.855.855 0 0 0 .625.271' />
  </svg>
);
export default SvgActiveCheckbox;
