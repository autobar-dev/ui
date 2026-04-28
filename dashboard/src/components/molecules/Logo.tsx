import DashboardLogoWithText from "../atoms/DashboardLogoWithText";

export default function Logo(props: {
  withTextClassName?: string,
}) {
  return (
    <DashboardLogoWithText className={props.withTextClassName} />
  );
}
