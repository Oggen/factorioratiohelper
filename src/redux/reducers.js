import * as actionTypes from "./actionTypes";
import update from 'immutability-helper';

const initialState = {
    steps: [
        {
            inputs: [],
            outputs: []
        }
    ]
};

export default function reduxApp(state = initialState, action) {
    switch (action.type) {

        case actionTypes.CREATE_STEP:
            return update(state, {steps: {$push: [{inputs: [], outputs: []}]}});

        case actionTypes.DELETE_STEP:
            return update(state, {steps: {$splice: [[action.index, 1]]}});


        case actionTypes.UPDATE_STEP_COUNT:
            return update(state, {steps: {[action.index]: {count: {$set: action.value}}}});

        case actionTypes.UPDATE_STEP_SPEED:
            return update(state, {steps: {[action.index]: {speed: {$set: action.value}}}});

        case actionTypes.UPDATE_STEP_TIME:
            return update(state, {steps: {[action.index]: {time: {$set: action.value}}}});


        case actionTypes.CREATE_STEP_INPUT:
            return update(state, {steps: {[action.stepIndex]: {inputs: {$push: [{}]}}}});

        case actionTypes.UPDATE_STEP_INPUT_COUNT:
            return update(state, {steps: {[action.stepIndex]: {inputs: {[action.inputIndex]: {count: {$set: action.value}}}}}});

        case actionTypes.UPDATE_STEP_INPUT_RESOURCE:
            return update(state, {steps: {[action.stepIndex]: {inputs: {[action.inputIndex]: {resource: {$set: action.value}}}}}});

        case actionTypes.DELETE_STEP_INPUT:
            return update(state, {steps: {[action.stepIndex]: {inputs: {$splice: [[action.inputIndex, 1]]}}}});


        case actionTypes.CREATE_STEP_OUTPUT:
            return update(state, {steps: {[action.stepIndex]: {outputs: {$push: [{}]}}}});

        case actionTypes.UPDATE_STEP_OUTPUT_COUNT:
            return update(state, {steps: {[action.stepIndex]: {outputs: {[action.outputIndex]: {count: {$set: action.value}}}}}});

        case actionTypes.UPDATE_STEP_OUTPUT_RESOURCE:
            return update(state, {steps: {[action.stepIndex]: {outputs: {[action.outputIndex]: {resource: {$set: action.value}}}}}});

        case actionTypes.DELETE_STEP_OUTPUT:
            return update(state, {steps: {[action.stepIndex]: {outputs: {$splice: [[action.outputIndex, 1]]}}}});


        default:
            return state;
    }
}