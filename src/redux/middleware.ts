import { getReturnOfExpression } from 'react-redux-typescript';

import { actions, RootAction } from './actions';
import * as actionTypes from './actionTypes';
import { Middleware, Action, MiddlewareAPI, Dispatch } from 'redux';
import RootState from './rootState';

const reconcileInputOuputRowsTrueType = 
    (store: MiddlewareAPI<RootState>) => 
    (next: Dispatch<RootAction>) => 
    <A extends Action>(action: A) => {
    if (action.type === actionTypes.UPDATE_STEP_INPUT_COUNT
        || action.type === actionTypes.UPDATE_STEP_INPUT_RESOURCE
        || action.type === actionTypes.UPDATE_STEP_OUTPUT_COUNT
        || action.type === actionTypes.UPDATE_STEP_OUTPUT_RESOURCE) {
        
        let compositeType2 = [
            actions.updateStepInputCount,
            actions.updateStepInputResource,
            actions.updateStepOutputCount,
            actions.updateStepOutputResource
        ].map(getReturnOfExpression);
        type realCompType = typeof compositeType2[number];
        // tslint:disable-next-line:no-any
        let typedAction = action as any as realCompType; // dang-erous
        
        const stepIndex = typedAction.stepIndex;

        const result = next(action);
        const state = store.getState();

        let emptyInputIndices: number[] = [];
        let emptyOutputIndices: number[] = [];
        state.steps[stepIndex].inputs.forEach((input, index) => {
            if (/*input.count === '' &&*/ input.resource === '') {
                emptyInputIndices.push(index);
            }
        });
        state.steps[stepIndex].outputs.forEach((output, index) => {
            if (/*output.count === '' &&*/ output.resource === '') {
                emptyOutputIndices.push(index);
            }
        });

        if (emptyInputIndices.length === 2) {
            store.dispatch(actions.deleteStepInput(stepIndex, emptyInputIndices[1]));
        } else if (emptyInputIndices.length === 0) {
            store.dispatch(actions.createStepInput(stepIndex));
        }

        if (emptyOutputIndices.length === 2) {
            store.dispatch(actions.deleteStepOutput(stepIndex, emptyOutputIndices[1]));
        } else if (emptyOutputIndices.length === 0) {
            store.dispatch(actions.createStepOutput(stepIndex));
        }

        return result;
    } else {
        return next(action);
    }
};

export const reconcileInputOuputRows = reconcileInputOuputRowsTrueType as Middleware; // also a little dang erous