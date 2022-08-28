import styles from '../styles/Products.module.css'
import React from 'react'
import Layout from '../components/organisms/Layout'
import Card from '../components/organisms/Card'
import { gql } from '@apollo/client';
import client from '../apollo-client';

export default function Products() {
  console.log(getData())

  return (
    <Layout>
      <div className={[styles.flexContainer, styles.container].join(' ')}>
        <section>
          <Card
            link='https://browarpinta.pl/produkt/atak-chmielu/'
            image='https://browarpinta.pl/wp-content/uploads/2021/10/PINTA_Atak_Chmielu.png'
            name='ATAK CHMIELU'
            type='AMERICAN IPA'
            extract='15°Blg'
            abv='6.1%'
            description='One of our first beers – Atak Chmielu is an insanely hopped AIPA. Red-copper in color, full-bodied, with a bunch of citrus in taste and aroma. Citrus, floral, resinous, piney, fruity – thanks to the American hops! It has been brewed on 28th of March 2011 for the first time ever and became the very first AIPA brewed in Polish commercial brewery. This is how Polish beer revolution has started!'
          />
        </section>

        <section>
          <Card
            link='https://browarpinta.pl/produkt/atak-chmielu/'
            image='https://browarpinta.pl/wp-content/uploads/2021/10/PINTA_Atak_Chmielu.png'
            name='ATAK CHMIELU'
            type='AMERICAN IPA'
            extract='15°Blg'
            abv='6.1%'
            description='One of our first beers – Atak Chmielu is an insanely hopped AIPA. Red-copper in color, full-bodied, with a bunch of citrus in taste and aroma. Citrus, floral, resinous, piney, fruity – thanks to the American hops! It has been brewed on 28th of March 2011 for the first time ever and became the very first AIPA brewed in Polish commercial brewery. This is how Polish beer revolution has started!'
          />
        </section>

        <section>
          <Card
            link='https://browarpinta.pl/en/product/pierwsza-pomoc/'
            image='https://browarpinta.pl/wp-content/uploads/2021/10/PINTA_Pierwsza_Pomoc-1.png'
            name='PIERWSZA POMOC'
            type='POLISH LIGHT PILSNER'
            extract='10.5°Plato'
            abv='4.1%'
            description='(First aid) – what will you do without it? You don’t have to be injured to use it. Just take it anytime you want – for breakfast, lunch or dinner. We used a lot of really good malts and the finest polish hops. Our First Aid beer will refresh you, feed you and make your humor great. We highly recommend it… for everyday use.'
          />
        </section>

        <section>
          <Card
            link='https://browarpinta.pl/produkt/atak-chmielu/'
            image='https://browarpinta.pl/wp-content/uploads/2021/10/PINTA_Atak_Chmielu.png'
            name='ATAK CHMIELU'
            type='AMERICAN IPA'
            extract='15°Blg'
            abv='6.1%'
            description='One of our first beers – Atak Chmielu is an insanely hopped AIPA. Red-copper in color, full-bodied, with a bunch of citrus in taste and aroma. Citrus, floral, resinous, piney, fruity – thanks to the American hops! It has been brewed on 28th of March 2011 for the first time ever and became the very first AIPA brewed in Polish commercial brewery. This is how Polish beer revolution has started!'
          />
        </section>

        <section className={styles.empty}></section>
        <section className={styles.empty}></section>
      </div>
    </Layout>
  )
}

export async function getData() {
  const { data } = await client.query({
    query: gql`
      query {
        products {
          id
          name
          description
          image
          type
          additionalData
          createdAt
        }
      }
    `,
  });

  return {
    data
};
}