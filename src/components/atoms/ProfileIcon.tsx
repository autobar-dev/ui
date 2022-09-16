import IconProps from "../../types/IconProps";

export default function MessageIcon(props: IconProps) {
  return (
    <svg className={props.className} style={props.style} viewBox="0 0 15.14003 21.341404" fill="none" stroke={props.color || "inherit"} xmlns="http://www.w3.org/2000/svg">
      <path
        d="m 7.56513,9.62 c -0.1,-0.01 -0.22,-0.01 -0.33,0 C 4.85509,9.54 2.96509,7.59 2.96509,5.19 c 0,-2.45 1.98,-4.44 4.44004,-4.44 2.45,0 4.44,1.99 4.44,4.44 -0.01,2.4 -1.9,4.35 -4.28,4.43 z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
      <path
        d="m 2.565,13.31 c -2.42,1.62 -2.42,4.26 0,5.87 2.75,1.84 7.26003,1.84 10.01003,0 2.42,-1.62 2.42,-4.26 0,-5.87 -2.74,-1.83 -7.25003,-1.83 -10.01003,0 z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  );
}