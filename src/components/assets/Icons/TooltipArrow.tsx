import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTooltipArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 15 7'
    {...props}
  >
    <path fill='#F2F2F2' d='M5.56.7a2 2 0 0 1 2.999 0L14.118 7H0z' />
  </svg>
);
export default SvgTooltipArrow;
