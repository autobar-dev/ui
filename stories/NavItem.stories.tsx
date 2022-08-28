import NavItem from '../components/atoms/NavItem'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Components/Atoms/NavItem',
  component: NavItem,
  argTypes: {
  },
} as ComponentMeta<typeof NavItem>

const Template: ComponentStory<typeof NavItem> = (args) => <NavItem {...args} />

export const Primary = Template.bind({})
Primary.args = {
  links: [{label: 'Link', link: '/link'}]
}

export const Login = Template.bind({})
Login.args = {
  links: [{label: 'Log In', link: '/login'}],
  login: true
}

export const Register = Template.bind({})
Register.args = {
  links: [{label: 'Sign Up', link: '/signup'}],
  signup: true
}