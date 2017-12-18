import update from 'immutability-helper';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

export const reconcileInputOuputRows = store => next => action => {
    const state = store.getState();
    
    switch (action.type) {
        default:
            return next(action);
    }
}