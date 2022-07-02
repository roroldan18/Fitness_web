import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from '../reducers/authReducer.js';
import { idCursoReducer } from '../reducers/idCursoReducer.js';
import { idInstructorReducer } from '../reducers/idInstructorReducer.js';
import { uiReducer } from '../reducers/uiReducers.js';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    idCurso: idCursoReducer,
    idInstructor: idInstructorReducer
});

export const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware( thunk )
    )
    );

