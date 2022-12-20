import { useState } from "react";
import Product from "../../../types/Product";
import { useStyles } from "./styles";
import { IconChevronUp, IconChevronDown } from "@tabler/icons";
import Link from "next/link";

type ProductsTableRowProps = {
  product: Product;
  style?: any;
  onClick?: () => void;
  expanded?: boolean;
};

export default function ProductsTableRow({ product, style, onClick, expanded }: ProductsTableRowProps) {
  const { classes } = useStyles();

  return (
    <div
      className={classes.root}
      style={style}
      onClick={() => onClick && onClick()}
    >
      <div className={classes.banner}>
        <div
          className={classes.beerInfoWrapper}
        > 
          <img
            className={classes.image}
            src={product.image}
          />
          <div className={classes.beerNameAndTypeWrapper}>
            <Link
              href={`/products/${product.slug}`}
              passHref
            >
              <a className={classes.beerNameLink}>
                <span className={classes.beerName}>{product.name}</span>
              </a>
            </Link>
            <span className={classes.beerType}>{product.style}</span>
          </div>
        </div>
        {
          expanded ? (
            <IconChevronUp size={32} />
          ) : (
            <IconChevronDown size={32} />
          )
        }
      </div>
      {
        expanded && (
          <div className={classes.details}>
            <p className={classes.beerDescription}>
              {product.description}
            </p>
          </div>
        )
      }
    </div>
  );
}