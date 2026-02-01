import { SVGProps } from "react";

export const VehicleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M27 23H5c-1.1 0-2-.9-2-2v-4c0-2.2 1.8-4 4-4h18c2.2 0 4 1.8 4 4v4c0 1.1-.9 2-2 2z" />
    <path d="M26 13H6l2-4.6C8.6 7 10 6 11.6 6h8.7c1.6 0 3 1 3.7 2.4L26 13z" />
    <path d="M10 23H4v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2z" />
    <path d="M28 23h-6v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2z" />
    <line x1={3} y1={12} x2={6.4} y2={12} />
    <line x1={26} y1={12} x2={29} y2={12} />
    <path d="M21 23H11l1.4-2.9c.3-.7 1-1.1 1.8-1.1h3.5c.8 0 1.5.4 1.8 1.1L21 23z" />
    <line x1={6} y1={18} x2={9} y2={18} />
    <line x1={23} y1={18} x2={26} y2={18} />
  </svg>
);
