import React from 'react';
import LogoOnly from '../atoms/LogoOnly';
import LogoText from '../atoms/LogoText';
import LogoWithText from '../atoms/LogoWithText';

type LogoProps = {
  type?: "logo-with-text" | "logo-only" | "text-only";
  iconColor?: string;
  textColor?: string;
  className?: string;
  style?: any;
  size?: any;
};

export default function Logo({ type = "logo-with-text", iconColor = "#f8f8f8", textColor = "#f8f8f8", className, style, size = "min-content" }: LogoProps) {
  return (
    <>
      {
        type == "logo-only" &&
          <LogoOnly
            color={iconColor}
            className={className}
            size={size}
            style={{
              ...style,
            }}
          />
      }
      {
        type == "text-only" &&
          <LogoText
            color={textColor}
            className={className}
            size={size}
            style={{
              ...style,
            }}
          />
      }
      {
        type == "logo-with-text" &&
          <LogoWithText
            iconColor={iconColor}
            textColor={textColor}
            className={className}
            size={size}
            style={{
              ...style,
            }}
          />
      }
    </>
  );
}