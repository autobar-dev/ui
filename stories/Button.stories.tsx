import Button from '../components/atoms/Button'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Components/Atoms/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  login: false,
  label: 'Primary',
  justifyContent: 'center'
}

export const Login = Template.bind({})
Login.args = {
  login: true,
  label: 'Log In',
  justifyContent: 'flex-end'
}
