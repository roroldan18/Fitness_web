import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from '../reducers/authReducer';
import { idCursoReducer } from '../reducers/idCursoReducer';
import { idInstructorReducer } from '../reducers/idInstructorReducer';
import { uiReducer } from '../reducers/uiReducers';

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

