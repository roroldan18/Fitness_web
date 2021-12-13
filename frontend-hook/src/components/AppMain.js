import React from 'react';
import { Provider } from 'react-redux'
import { RouterApp } from '../components/routes/RouterApp';
import { store } from '../store/store';

export const AppMain = () => {

    return (
        <Provider store={store}>
            <RouterApp />
        </Provider>
    )
}
