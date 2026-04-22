import { Box, Group, Text } from "@mantine/core";
import React, { useState } from "react";
import { useStyles, LINK_HEIGHT, INDICATOR_OFFSET } from "./styles";

interface TableOfContentsProps {
  label: string;
  links: { label: string; link: string; order: number }[];
}

export function TableOfContents({ label, links }: TableOfContentsProps) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(2);

  const items = links.map((item, index) => (
    <Box<'a'>
      component="a"
      href={item.link}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
      }}
      key={item.label}
      className={cx(classes.link, { [classes.linkActive]: active === index })}
      sx={(theme) => ({ paddingLeft: item.order * theme.spacing.lg })}
    >
      {item.label}
    </Box>
  ));

  return (
    <div>
      <Group mb="md">
        <Text>{ label }</Text>
      </Group>
      <div className={classes.links}>
        <div
          className={classes.indicator}
          style={{ transform: `translateY(${active * LINK_HEIGHT + INDICATOR_OFFSET}px)` }}
        />
        {items}
      </div>
    </div>
  );
}