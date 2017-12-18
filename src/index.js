import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxApp from './redux/reducers';
import { reconcileInputOuputRows } from './redux/middleware';

let store = createStore(reduxApp, applyMiddleware(reconcileInputOuputRows));

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,

  document.getElementById('root')
);

registerServiceWorker();
