import { Analytics } from 'firebase/analytics';
import { FirebaseApp } from 'firebase/app';
import { createContext } from 'react';

interface FirebaseContextType {
  app?: FirebaseApp;
  analytics?: Analytics;
}

export default createContext<FirebaseContextType>({
  app: undefined,
  analytics: undefined,
})