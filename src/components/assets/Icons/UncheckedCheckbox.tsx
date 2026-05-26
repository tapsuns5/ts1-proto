import * as React from 'react';
import type { SVGProps } from 'react';
const SvgUncheckedCheckbox = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 20 20'
    width='1em'
    height='1em'
    {...props}
  >
    <path d='M4.5 17q-.625 0-1.062-.438A1.44 1.44 0 0 1 3 15.5v-11q0-.625.438-1.062A1.44 1.44 0 0 1 4.5 3h11q.625 0 1.062.438Q17 3.875 17 4.5v11q0 .625-.438 1.062A1.44 1.44 0 0 1 15.5 17zm0-1.5h11v-11h-11z' />
  </svg>
);
export default SvgUncheckedCheckbox;
