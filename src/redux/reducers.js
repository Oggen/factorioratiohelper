import * as actionTypes from './actionTypes';
import update from 'immutability-helper';
import { calculateQuantities } from '../app/App';

const initialState = {
    steps: [],
    cancelOutWith: null
};

export default function reduxApp(state = initialState, action) {
    switch (action.type) {

        case actionTypes.CREATE_STEP:
            return update(state, {steps: {$push: [{
                count: "", speed: "", time: "", inputs: [{count: "", resource: ""}], outputs: [{count: "", resource: ""}]
            }]}});

        case actionTypes.DELETE_STEP:
            return update(state, {steps: {$splice: [[action.index, 1]]}});


        case actionTypes.UPDATE_STEP_COUNT:
            return update(state, {steps: {[action.index]: {count: {$set: action.value}}}});

        case actionTypes.UPDATE_STEP_SPEED:
            return update(state, {steps: {[action.index]: {speed: {$set: action.value}}}});

        case actionTypes.UPDATE_STEP_TIME:
            return update(state, {steps: {[action.index]: {time: {$set: action.value}}}});


        case actionTypes.CREATE_STEP_INPUT:
            return update(state, {steps: {[action.stepIndex]: {inputs: {$push: [{count: "", resource: ""}]}}}});

        case actionTypes.UPDATE_STEP_INPUT_COUNT:
            return update(state, {steps: {[action.stepIndex]: {inputs: {[action.inputIndex]: {count: {$set: action.value}}}}}});

        case actionTypes.UPDATE_STEP_INPUT_RESOURCE:
            return update(state, {steps: {[action.stepIndex]: {inputs: {[action.inputIndex]: {resource: {$set: action.value}}}}}});

        case actionTypes.DELETE_STEP_INPUT:
            return update(state, {steps: {[action.stepIndex]: {inputs: {$splice: [[action.inputIndex, 1]]}}}});


        case actionTypes.CREATE_STEP_OUTPUT:
            return update(state, {steps: {[action.stepIndex]: {outputs: {$push: [{count: "", resource: ""}]}}}});

        case actionTypes.UPDATE_STEP_OUTPUT_COUNT:
            return update(state, {steps: {[action.stepIndex]: {outputs: {[action.outputIndex]: {count: {$set: action.value}}}}}});

        case actionTypes.UPDATE_STEP_OUTPUT_RESOURCE:
            return update(state, {steps: {[action.stepIndex]: {outputs: {[action.outputIndex]: {resource: {$set: action.value}}}}}});

        case actionTypes.DELETE_STEP_OUTPUT:
            return update(state, {steps: {[action.stepIndex]: {outputs: {$splice: [[action.outputIndex, 1]]}}}});

        case actionTypes.START_CANCEL_OUT:
            return update(state, {cancelOutWith: {$set: action.stepIndex}});

        case actionTypes.FINALIZE_CANCEL_OUT:
            const cancelAmount = calculateCancelOut(state, action.resource);
            return cancelAmount ? update(state, {cancelOutWith: {$set: null}, steps: {[state.cancelOutWith]: {count: {$set: cancelAmount}}}}) : state;

        case actionTypes.CANCEL_CANCEL_OUT:
            return update(state, {cancelOutWith: {$set: null}});

        default:
            return state;
    }
}

function calculateCancelOut(state, resource) {
    if (state.cancelOutWith === null) return null;
    console.log("calculating canceling", state, resource);
    const ioWithoutStep = calculateQuantities(state.steps.filter((_, i) => i !== state.cancelOutWith));
    const normalizedIoOfStep = calculateQuantities(state.steps.filter((_, i) => i === state.cancelOutWith).map(x => ({ ...x, count: 1 })));
    const isInput = ioWithoutStep.inputs.some(x => x.resource === resource);
    if (isInput) {
        if (!ioWithoutStep.inputs.some(x => x.resource === resource) || !normalizedIoOfStep.outputs.some(x => x.resource === resource)) return null;
        return ioWithoutStep.inputs.find(x => x.resource === resource).count / normalizedIoOfStep.outputs.find(x => x.resource === resource).count;
    }
    else {
        if (!ioWithoutStep.outputs.some(x => x.resource === resource) || !normalizedIoOfStep.inputs.some(x => x.resource === resource)) return null;
        return ioWithoutStep.outputs.find(x => x.resource === resource).count / normalizedIoOfStep.inputs.find(x => x.resource === resource).count;
    }
}
