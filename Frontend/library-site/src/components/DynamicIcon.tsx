import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { Suspense, lazy } from "react";

const iconList: Record<
  string,
  React.LazyExoticComponent<OverridableComponent<SvgIconTypeMap<{}, "svg">>>
> = {
  Login: lazy(() => import("@mui/icons-material/Login")),
  Signup: lazy(() => import("@mui/icons-material/AddBoxOutlined")),
  DarkMode: lazy(() => import("@mui/icons-material/DarkMode")),
  LightMode: lazy(() => import("@mui/icons-material/LightMode")),
  BrowseBooks: lazy(() => import("@mui/icons-material/MenuBook")),
};

type DynamicIconProps = {
  icon: string;
  className?: string;
};

const DynamicIcon = ({ icon, className }: DynamicIconProps) => {
  const Icon = iconList[icon] || iconList["HomeRounded"];
  return (
    <Suspense fallback={null}>
      <Icon className={className} />
    </Suspense>
  );
};

export default DynamicIcon;
