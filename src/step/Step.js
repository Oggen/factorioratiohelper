import React from 'react';
import styles from './step.css';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { ContentContentCopy, ContentClear } from 'material-ui/svg-icons';
import { compressToEncodedURIComponent as compress } from 'lz-string';
import { connect } from 'react-redux';
import { updateStepCount, updateStepSpeed, updateStepTime, updateStepInputCount, updateStepInputResource, updateStepOutputCount, updateStepOutputResource, startCancelOut, cancelCancelOut, updateStepName, deleteStep } from '../redux/actions';

let inputResourceInputs = [];
let outputResourceInputs = [];

const handleInputCountSpaceKeyPress = (index, event) => {
    if (event.key === " ") {
        event.preventDefault();
        inputResourceInputs[index].focus();
    }
}

const handleOutputCountSpaceKeyPress = (index, event) => {
    if (event.key === " ") {
        event.preventDefault();
        outputResourceInputs[index].focus();
    }
}

const StepUI = ({step, cancelling, handleCountChange, handleSpeedChange, handleTimeChange, handleNameChange, handleInputCountChange, handleInputResourceChange, handleOutputCountChange, handleOutputResourceChange, handleStartCancelOut, handleCancelCancelOut, handleDelete, handleExport}) => (
    <Paper className="container">
        <div className="stepTopRow">
            <TextField
                className="stepName"
                floatingLabelText="Name"
                name="name"
                type="text"
                value={step.name}
                onChange={handleNameChange}
            />
            <FlatButton label={cancelling ? "Cancelling..." : "Cancel out"} onClick={cancelling ? handleCancelCancelOut : handleStartCancelOut} />
            <IconButton tooltip="Export Step" onClick={handleExport}><ContentContentCopy /></IconButton>
            <IconButton tooltip="Delete Step" onClick={handleDelete}><ContentClear /></IconButton>
        </div>

        <TextField
            className="stepInput"
            floatingLabelText="Count"
            name="count"
            type="number"
            value={step.count}
            onChange={handleCountChange}
        />

        <TextField
            className="stepInput"
            floatingLabelText="Crafting Speed"
            name="speed"
            type="number"
            value={step.speed}
            onChange={handleSpeedChange}
        />

        <TextField
            className="stepInput"
            floatingLabelText="Crafting Time"
            name="time"
            type="number"
            value={step.time}
            onChange={handleTimeChange}
        />
        
        <Paper zDepth={2} className="inputOutputContainer">
            {step.inputs.map((x, i) => {
                return (
                    <div key={i}>
                        <TextField
                            className="inputOutputField"
                            hintText="Input Count"
                            underlineShow={false}
                            type="number"
                            value={step.inputs[i].count}
                            onChange={handleInputCountChange.bind(this, i)}
                            onKeyPress={handleInputCountSpaceKeyPress.bind(this, i)}
                        />
                        <TextField
                            className="inputOutputField"
                            hintText="Input Resource"
                            underlineShow={false}
                            type="text"
                            value={step.inputs[i].resource}
                            onChange={handleInputResourceChange.bind(this, i)}
                            ref={element => { inputResourceInputs[i] = element }}
                        />
                        <Divider />
                    </div>
                );
            })}
        </Paper>

        <Paper zDepth={2} className="inputOutputContainer">
            {step.outputs.map((x, i) => {
                return (
                    <div key={i}>
                        <TextField
                            className="inputOutputField"
                            hintText="Output Count"
                            underlineShow={false}
                            type="number"
                            value={step.outputs[i].count}
                            onChange={handleOutputCountChange.bind(this, i)}
                            onKeyPress={handleOutputCountSpaceKeyPress.bind(this, i)}
                        />
                        <TextField
                            className="inputOutputField"
                            hintText="Output Resource"
                            underlineShow={false}
                            type="text"
                            value={step.outputs[i].resource}
                            onChange={handleOutputResourceChange.bind(this, i)}
                            ref={element => { outputResourceInputs[i] = element }}
                        />
                        <Divider />
                    </div>
                );
            })}
        </Paper>
    </Paper>
);

const mapStateToProps = (state, {index}) => {
    return { step: state.steps[index], cancelling: state.cancelOutWith === index }
};

const mapDispatchToProps = (dispatch, {index}) => {
    return {
        handleCountChange: (e) => dispatch(updateStepCount(index, e.target.value)),
        handleSpeedChange: (e) => dispatch(updateStepSpeed(index, e.target.value)),
        handleTimeChange: (e) => dispatch(updateStepTime(index, e.target.value)),
        handleNameChange: (e) => dispatch(updateStepName(index, e.target.value)),
        handleInputCountChange: (i, e) => dispatch(updateStepInputCount(index, i, e.target.value)),
        handleInputResourceChange: (i, e) => dispatch(updateStepInputResource(index, i, e.target.value)),
        handleOutputCountChange: (i, e) => dispatch(updateStepOutputCount(index, i, e.target.value)),
        handleOutputResourceChange: (i, e) => dispatch(updateStepOutputResource(index, i, e.target.value)),
        handleStartCancelOut: () => dispatch(startCancelOut(index)),
        handleCancelCancelOut: () => dispatch(cancelCancelOut()),
        handleDelete: () => dispatch(deleteStep(index)),
        handleExport: () => dispatch(async (_, getState) => {
            await navigator.clipboard.writeText("s" + compress(JSON.stringify(getState().steps[index])));
        })
    };
};

const Step = connect(
    mapStateToProps,
    mapDispatchToProps
)(StepUI);

export default Step;
