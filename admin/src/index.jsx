import React, { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';
import BannerStore from './store/BannerStore';

export const Context = createContext(null);

const root = createRoot(document.getElementById('root'));


root.render(
  <Context.Provider value={{
    user: new UserStore(),
    device: new DeviceStore(),
    banner: new BannerStore(),
  }}>
    <App />
  </Context.Provider>
);
