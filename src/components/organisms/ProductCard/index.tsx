import { useStyles } from './styles';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  product: any;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { classes } = useStyles();

  const prices = JSON.parse(product.prices);

  return (
    <Link href={`/products/${product.id}`}>
      <div className={classes.root}>
        <img
          src={product.image}
          alt={`${product.name} image`}
          className={classes.image}
        />
        <div className={classes.info}>
          <ul>
            <li>{product.name}</li>
            <li>{product.type}</li>
            <li>Prices
              <ul>
                { Object.keys(prices).map((currency: string, index: number) => {
                  return (
                    <li key={`price-${product.id}-${currency}`}>{ currency }: { prices[currency] }</li>
                  );
                }) }
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}