import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react"
import {BrowserRouter as Router} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
    <Provider store={store}>
        <ChakraProvider>
            <Router>
                <App />
            </Router>
        </ChakraProvider>
    </Provider>,
    document.getElementById('root')
);

