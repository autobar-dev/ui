// import { ArrowSmallRightTinySolid } from "@graywolfai/react-heroicons";
import { Button } from "@tremor/react";

export function DashboardLightButton(props: {
  label: string,
}) {
  return (
    <Button
      variant="light"
      className="font-bold"
    >{props.label}</Button>
  );
  // return (
  //   <Button
  //     variant="light"
  //     className="font-bold"
  //   >{props.label}<ArrowSmallRightTinySolid className="ml-0 mb-0.5 h-6 inline-block" /></Button>
  // );
}
