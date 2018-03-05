import * as actionTypes from "./actionTypes";
import * as update from "immutability-helper";

import RootState from "./rootState";
import { RootAction } from "./actions";
import { Reducer } from "redux";

import Step from '../datacomponents/step';
import { ResourceCount } from '../datacomponents/index';

import { recipeDictionary } from '../solver/stepDictionary';

const initialState: RootState = {
    steps: [
        recipeDictionary.electrolysis,
        recipeDictionary.slag_crush,
        recipeDictionary.mineralize_water,
        recipeDictionary.green_algea_growth,
        recipeDictionary.cellulose_fiber,
        recipeDictionary.wood_pellet,
        recipeDictionary.burn_pellets,
    ],
    inputRatios: [
        {resource: 'water', count: 1}
    ],
    outputRequested: [
        {resource: 'wood_pellets', count: 1}
    ],
    actualInputs: [],
    extraOutputs: []
};

const reduxApp: Reducer<RootState> = function(state: RootState = initialState, action: RootAction): RootState {
    switch (action.type) {

        case actionTypes.CREATE_STEP:
            return update(state, {steps: {$unshift: [new Step]}});
        case actionTypes.DELETE_STEP:
            return update(state, {steps: {$splice: [[action.index, 1]]}});

        case actionTypes.UPDATE_STEP_TIME:
            return update(
                state, 
                {steps: {[action.index]: 
                    {time: {$set: action.value}}
                }});

        case actionTypes.CREATE_STEP_INPUT:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {inputs: {$push: [new ResourceCount]}}
                }});
        case actionTypes.UPDATE_STEP_INPUT_COUNT:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {inputs: {[action.inputIndex]: 
                        {count: {$set: action.value}}
                    }}
                }});
        case actionTypes.UPDATE_STEP_INPUT_RESOURCE:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {inputs: {[action.inputIndex]: 
                        {resource: {$set: action.value}}
                    }}
                }});
        case actionTypes.DELETE_STEP_INPUT:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {inputs: {$splice: [[action.inputIndex, 1]]}}
                }});

        case actionTypes.CREATE_STEP_OUTPUT:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {outputs: {$push: [new ResourceCount]}}
                }});
        case actionTypes.UPDATE_STEP_OUTPUT_COUNT:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {outputs: {[action.outputIndex]: 
                        {count: {$set: action.value}}
                    }}
                }});
        case actionTypes.UPDATE_STEP_OUTPUT_RESOURCE:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {outputs: {[action.outputIndex]: 
                        {resource: {$set: action.value}}
                    }}
                }});
        case actionTypes.DELETE_STEP_OUTPUT:
            return update(
                state, 
                {steps: {[action.stepIndex]: 
                    {outputs: {$splice: [[action.outputIndex, 1]]
                    }}
                }});
        case actionTypes.ADD_RESOURCE_COUNT:
            return update(
                state, 
                {[action.resourceGroup]: {$unshift: [
                    new ResourceCount
                ]}});
        case actionTypes.DELETE_RESOURCE_COUNT:
            return update(state, {[action.resourceGroup]: {$splice: [[action.resourceIndex, 1]]}});
        case actionTypes.UPDATE_RESOURCE:
            return update(
                state, 
                {[action.resourceGroup]: {[action.resourceIndex]: 
                    {resource: {$set: action.resource}}
                }});
        case actionTypes.UPDATE_COUNT:
            return update(
                state, 
                {[action.resourceGroup]: {[action.resourceIndex]: 
                    {count: {$set: action.count}}
                }});

        case actionTypes.SET_EXTRA_OUTPUT:
            return update(state, {extraOutputs: {$set: action.outputs}});
        case actionTypes.SET_ACTUAL_INPUT:
            return update(state, {actualInputs: {$set: action.inputs}});

        default:
            return state;
    }
};

export default reduxApp;
