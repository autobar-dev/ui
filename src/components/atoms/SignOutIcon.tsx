import IconProps from "../../types/IconProps";

export default function SignOutIcon(props: IconProps) {
  return (
    <svg className={props.className} style={props.style} fill="none" stroke={props.color} viewBox="0 0 17.739969 17.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 14.43,11.37 16.99,8.81 14.43,6.25"
        stroke="inherit"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round" />
      <path
        d="M 6.75,8.81 H 16.92"
        stroke="inherit"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round" />
      <path
        d="m 8.75,16.75 c -4.42,0 -8,-3 -8,-8 0,-5 3.58,-8 8,-8"
        stroke="inherit"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  );
}