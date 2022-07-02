import React from 'react';
import { Provider } from 'react-redux'
import { RouterApp } from '../components/routes/RouterApp.js';
import { store } from '../store/store.js';

export const AppMain = () => {

    return (
        <Provider store={store}>
            <RouterApp />
        </Provider>
    )
}
