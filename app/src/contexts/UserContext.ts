import { createContext } from 'react'
import User from '../types/User'

interface UserContextType {
  user: User | undefined;
  setUser: (user?: User) => any;
  flushUser: () => any;
}

export default createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  flushUser: async () => {},
})