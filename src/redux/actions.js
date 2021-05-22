import * as actionTypes from './actionTypes';

export function createStep() {
    return { type: actionTypes.CREATE_STEP };
}
export function deleteStep(index) {
    return { index, type: actionTypes.DELETE_STEP };
}


export function updateStepCount(index, value) {
    return { index, value, type: actionTypes.UPDATE_STEP_COUNT };
}
export function updateStepSpeed(index, value) {
    return { index, value, type: actionTypes.UPDATE_STEP_SPEED };
}
export function updateStepTime(index, value) {
    return { index, value, type: actionTypes.UPDATE_STEP_TIME };
}
export function updateStepName(index, value) {
    return { index, value, type: actionTypes.UPDATE_STEP_NAME };
}


export function createStepInput(stepIndex) {
    return { stepIndex, type: actionTypes.CREATE_STEP_INPUT };
}
export function updateStepInputCount(stepIndex, inputIndex, value) {
    return { stepIndex, inputIndex, value, type: actionTypes.UPDATE_STEP_INPUT_COUNT };
}
export function updateStepInputResource(stepIndex, inputIndex, value) {
    return { stepIndex, inputIndex, value, type: actionTypes.UPDATE_STEP_INPUT_RESOURCE };
}
export function deleteStepInput(stepIndex, inputIndex) {
    return { stepIndex, inputIndex, type: actionTypes.DELETE_STEP_INPUT };
}


export function createStepOutput(stepIndex) {
    return { stepIndex, type: actionTypes.CREATE_STEP_OUTPUT };
}
export function updateStepOutputCount(stepIndex, outputIndex, value) {
    return { stepIndex, outputIndex, value, type: actionTypes.UPDATE_STEP_OUTPUT_COUNT };
}
export function updateStepOutputResource(stepIndex, outputIndex, value) {
    return { stepIndex, outputIndex, value, type: actionTypes.UPDATE_STEP_OUTPUT_RESOURCE };
}
export function deleteStepOutput(stepIndex, outputIndex) {
    return { stepIndex, outputIndex, type: actionTypes.DELETE_STEP_OUTPUT };
}

export function startCancelOut(stepIndex) {
    return { stepIndex, type: actionTypes.START_CANCEL_OUT };
}
export function finalizeCancelOut(resource) {
    return { resource, type: actionTypes.FINALIZE_CANCEL_OUT };
}
export function cancelCancelOut() {
    return { type: actionTypes.CANCEL_CANCEL_OUT };
}

export function importSteps(steps) {
    return { steps, type: actionTypes.IMPORT_STEPS };
}

export function importStep(step) {
    return { step, type: actionTypes.IMPORT_STEP };
}

export function scaleSystem(scale) {
    return { scale, type: actionTypes.SCALE_SYSTEM };
}
