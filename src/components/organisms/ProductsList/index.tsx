import { useStyles } from './styles';
import Product from '../../../types/Product';
import ProductsListRow from '../../molecules/ProductsListRow';
import { useEffect, useState } from 'react';
import { Pagination } from '@mantine/core';

type ProductsListProps = {
  products: Product[];
};

export default function ProductsList(props: ProductsListProps) {
  const { classes } = useStyles();
  const { products } = props;

  const [expandedList, setExpandedList] = useState<boolean[]>([]);

  useEffect(() => {
    setExpandedList(
      new Array(products.length).fill(false)
    );
  }, [products]);

  return (
    <div className={classes.root}>
      <div className={classes.listContainer}>
        {
          products.map((product, index) => (
            <ProductsListRow
              product={product}
              onClick={() => {
                setExpandedList(
                  expandedList.map((isExpanded, expandedIndex) => {
                    if(index == expandedIndex) {
                      return !isExpanded;
                    } else {
                      return false;
                    }
                  })
                );
              }}
              expanded={expandedList[index]}
              style={{
                borderBottom: (index === products.length - 1) ? 'none' : undefined,
                borderRadius: (
                  (index === 0 && index === products.length - 1) && '15px' ||
                  index === 0 && '15px 15px 0 0' ||
                  index === products.length - 1 && '0 0 15px 15px' ||
                  undefined
                ),
              }}
              key={`products-list-row-${index}`}
            />
          ))
        }
      </div>
    </div>
  );
}