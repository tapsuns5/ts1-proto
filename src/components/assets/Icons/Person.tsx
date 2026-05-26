import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 40 40'
    {...props}
  >
    <mask
      id='person_svg__a'
      width={40}
      height={40}
      x={0}
      y={0}
      maskUnits='userSpaceOnUse'
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill='#D9D9D9' d='M0 0h40v40H0z' />
    </mask>
    <g mask='url(#person_svg__a)'>
      <path
        fill='#666'
        d='M20 19.972q-2.75 0-4.57-1.82-1.82-1.819-1.82-4.569t1.82-4.57Q17.25 7.195 20 7.195t4.569 1.82 1.82 4.57-1.82 4.569q-1.82 1.82-4.57 1.82M9.443 33.333q-1.154 0-1.965-.812a2.68 2.68 0 0 1-.813-1.966v-1.389q0-1.528.77-2.673a5 5 0 0 1 2.008-1.743q2.722-1.265 5.32-1.896a22 22 0 0 1 5.235-.632q2.64 0 5.223.646 2.583.645 5.305 1.882 1.264.598 2.035 1.743.77 1.146.77 2.674v1.388q0 1.153-.812 1.966a2.68 2.68 0 0 1-1.965.812z'
      />
    </g>
  </svg>
);
export default SvgPerson;
