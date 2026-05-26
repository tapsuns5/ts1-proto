import React from "react";
import * as Icons from "./index";

interface IconProps {
  name: keyof typeof Icons;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = "" }) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <div />;
  }

  const props: any = {};
  if (className) props.className = className;
  
  return <IconComponent {...props} />;
};

export default Icon;
