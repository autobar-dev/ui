import { Button, Modal, Radio, Title } from "@mantine/core";
import { IconFilterOff } from "@tabler/icons";
import { useEffect, useState } from "react";
import { SortingOption } from "../../../pages/products";
import { useStyles } from "./styles";

type SortingFilteringModalProps = {
  opened: boolean;
  sortBy: SortingOption;
  onClose: () => void;
  onClear?: () => void;
  onSubmit?: (sortBy: SortingOption) => void;
};

export default function SortingFilteringModal(props: SortingFilteringModalProps) {
  const { classes } = useStyles();

  const [sortingOption, setSortingOption] = useState<SortingOption>("PURCHASES_DESCENDING");

  useEffect(() => {
    setSortingOption(props.sortBy);
  }, [props.sortBy]);

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
    >
      <div className={classes.container}>
        <div className={classes.filteringContainer}>
          <Title size={24}>Sorting</Title>
          <Radio.Group
            orientation="vertical"
            value={sortingOption}
            size={"md"}
            onChange={(newSortingOption: SortingOption) => setSortingOption(newSortingOption)}
          >
            <Radio
              value="PURCHASES_DESCENDING"
              label="Purchases descending"
            />
            <Radio
              value="PURCHASES_ASCENDING"
              label="Purchases ascending"
            />
          </Radio.Group>
        </div>

        <div className={classes.submitAndClearFiltersContainer}>
          <Button
            color={"gray"}
            onClick={() => {
              props.onClear && props.onClear();
              props.onClose();
            }}
          >
            <IconFilterOff size={20} />
          </Button>
          <Button
            onClick={() => {
              props.onSubmit && props.onSubmit(
                sortingOption,
              );
              props.onClose();
            }}
            className={classes.saveButton}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}