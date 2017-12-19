import * as actions from './actions';
import * as actionTypes from './actionTypes';

export const reconcileInputOuputRows = store => next => action => {
    if (action.type === actionTypes.UPDATE_STEP_INPUT_COUNT
        || action.type === actionTypes.UPDATE_STEP_INPUT_RESOURCE
        || action.type === actionTypes.UPDATE_STEP_OUTPUT_COUNT
        || action.type === actionTypes.UPDATE_STEP_OUTPUT_RESOURCE) {

        const stepIndex = action.stepIndex;

        const result = next(action);
        const state = store.getState();

        let emptyInputIndices = [];
        let emptyOutputIndices = [];
        state.steps[stepIndex].inputs.forEach((input, index) => {
            if (input.count === "" && input.resource === "") {
                emptyInputIndices.push(index);
            }
        })
        state.steps[stepIndex].outputs.forEach((output, index) => {
            if (output.count === "" && output.resource === "") {
                emptyOutputIndices.push(index);
            }
        })

        if (emptyInputIndices.length === 2) {
            store.dispatch(actions.deleteStepInput(stepIndex, emptyInputIndices[1]));
        }
        else if (emptyInputIndices.length === 0) {
            store.dispatch(actions.createStepInput(stepIndex));
        }

        if (emptyOutputIndices.length === 2) {
            store.dispatch(actions.deleteStepOutput(stepIndex, emptyOutputIndices[1]));
        }
        else if (emptyOutputIndices.length === 0) {
            store.dispatch(actions.createStepOutput(stepIndex));
        }

        return result;
    }
    else {
        return next(action);
    }
}
