import * as actionTypes from './actionTypes';
import { getReturnOfExpression } from 'react-redux-typescript';
import { createAction } from 'typesafe-actions';
import { Resource } from '../datacomponents/resourceCount';
import { ResourceCount } from '../datacomponents/index';

export const createStep = createAction(actionTypes.CREATE_STEP);
export const deleteStep = createAction(
    actionTypes.DELETE_STEP, 
    (index: number) => ({type: actionTypes.DELETE_STEP,
        index
    })
);

export const updateStepTime = createAction(
    actionTypes.UPDATE_STEP_TIME, 
    (index: number, value: number) => ({type: actionTypes.UPDATE_STEP_TIME,
        index, value
    })
);

export const createStepInput = createAction(
    actionTypes.CREATE_STEP_INPUT, 
    (stepIndex: number) => ({type: actionTypes.CREATE_STEP_INPUT,
        stepIndex
    })
);
export const updateStepInputCount = createAction(
    actionTypes.UPDATE_STEP_INPUT_COUNT, 
    (stepIndex: number, inputIndex: number, value: number) => ({type: actionTypes.UPDATE_STEP_INPUT_COUNT,
        stepIndex, inputIndex, value
    })
);
export const updateStepInputResource = createAction(
    actionTypes.UPDATE_STEP_INPUT_RESOURCE, 
    (stepIndex: number, inputIndex: number, value: string) => ({type: actionTypes.UPDATE_STEP_INPUT_RESOURCE,
        stepIndex, inputIndex, value
    })
);
export const deleteStepInput = createAction(
    actionTypes.DELETE_STEP_INPUT, 
    (stepIndex: number, inputIndex: number) => ({type: actionTypes.DELETE_STEP_INPUT,
        stepIndex, inputIndex
    })
);

export const createStepOutput = createAction(
    actionTypes.CREATE_STEP_OUTPUT, 
    (stepIndex: number) => ({type: actionTypes.CREATE_STEP_OUTPUT,
        stepIndex
    })
);
export const updateStepOutputCount = createAction(
    actionTypes.UPDATE_STEP_OUTPUT_COUNT, 
    (stepIndex: number, outputIndex: number, value: number) => ({type: actionTypes.UPDATE_STEP_OUTPUT_COUNT,
        stepIndex, outputIndex, value
    })
);
export const updateStepOutputResource = createAction(
    actionTypes.UPDATE_STEP_OUTPUT_RESOURCE, 
    (stepIndex: number, outputIndex: number, value: string) => ({type: actionTypes.UPDATE_STEP_OUTPUT_RESOURCE,
        stepIndex, outputIndex, value
    })
);
export const deleteStepOutput = createAction(
    actionTypes.DELETE_STEP_OUTPUT, 
    (stepIndex: number, outputIndex: number) => ({type: actionTypes.DELETE_STEP_OUTPUT,
        stepIndex, outputIndex
    })
);

export const createResourceCount = createAction(
    actionTypes.ADD_RESOURCE_COUNT,
    (resourceGroup: string) => ({
        type: actionTypes.ADD_RESOURCE_COUNT,
        resourceGroup
    })
);
export const deleteResourceCount = createAction(
    actionTypes.DELETE_RESOURCE_COUNT,
    (resourceGroup: string, resourceIndex: number) => ({
        type: actionTypes.DELETE_RESOURCE_COUNT,
        resourceGroup,
        resourceIndex
    })
);
export const updateResource = createAction(
    actionTypes.UPDATE_RESOURCE,
    (resourceGroup: string, resourceIndex: number, resource: Resource) => ({
        type: actionTypes.UPDATE_RESOURCE,
        resourceGroup,
        resourceIndex,
        resource
    })
);
export const updateCount = createAction(
    actionTypes.UPDATE_COUNT,
    (resourceGroup: string, resourceIndex: number, count: number) => ({
        type: actionTypes.UPDATE_COUNT,
        resourceGroup,
        resourceIndex,
        count
    })
);


export const setExtraOutput = createAction(
    actionTypes.SET_EXTRA_OUTPUT,
    (outputs: ResourceCount[]) => ({
        type: actionTypes.SET_EXTRA_OUTPUT,
        outputs
    })
);
export const setActualInput = createAction(
    actionTypes.SET_ACTUAL_INPUT,
    (inputs: ResourceCount[]) => ({
        type: actionTypes.SET_ACTUAL_INPUT,
        inputs
    })
);

export const actions = {
    createStep, deleteStep,
    updateStepTime,
    createStepInput, updateStepInputCount, updateStepInputResource, deleteStepInput,
    createStepOutput, updateStepOutputCount, updateStepOutputResource, deleteStepOutput,
    createResourceCount, deleteResourceCount, updateResource, updateCount,
    setExtraOutput, setActualInput
}

const returnOfActions =
  Object.values(actions).map(getReturnOfExpression);
type AppAction = typeof returnOfActions[number];

export type RootAction = AppAction;