import { useStyles } from './styles';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  product: any;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { classes } = useStyles();

  const additionalData = JSON.parse(product.additionalData);

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
                { Object.keys(additionalData).map((key: string) => {
                  return (
                    <li key={`add-data-${product.id}-${key}`}>{ key }: { additionalData[key] }</li>
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