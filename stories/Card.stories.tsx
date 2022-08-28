import Card from '../components/organisms/Card'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Components/Organisms/Card',
  component: Card,
  argTypes: {

  },
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />

export const Primary = Template.bind({})
Primary.args = {
  link: 'https://browarpinta.pl/produkt/atak-chmielu/',
  image: 'https://browarpinta.pl/wp-content/uploads/2021/10/PINTA_Atak_Chmielu.png',
  name: 'ATAK CHMIELU',
  type: 'AMERICAN IPA',
  extract: '15°Blg',
  abv: '6.1%',
  description: 'One of our first beers – Atak Chmielu is an insanely hopped AIPA. Red-copper in color, full-bodied, with a bunch of citrus in taste and aroma. Citrus, floral, resinous, piney, fruity – thanks to the American hops! It has been brewed on 28th of March 2011 for the first time ever and became the very first AIPA brewed in Polish commercial brewery. This is how Polish beer revolution has started!',
}
