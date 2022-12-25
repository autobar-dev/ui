import { Button } from "@mantine/core";

type CheckboxButtonProps = {
  label: string;
  checked: boolean;
  onChange?: (newValue: boolean) => void;
};

export function CheckboxButton(props: CheckboxButtonProps) {
  return (
    <Button
      variant={props.checked ? "filled" : "outline"}
      
      onClick={() => {
        props.onChange && props.onChange(!props.checked);
      }}
    >
      { props.label }
    </Button>
  );
}