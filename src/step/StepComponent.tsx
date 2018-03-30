import * as React from 'react';
import './step.css';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import { connect, Dispatch } from 'react-redux';

import { 
    updateStepTime,
    updateStepName,
    toggleStepMinimized,
    updateStepInputCount,
    updateStepInputResource,
    updateStepOutputCount,
    updateStepOutputResource,
    RootAction } from '../redux/actions';
import RootState from '../redux/rootState';

import { Step } from '../datacomponents/index';

let inputResourceInputs: TextField[] = [];
let outputResourceInputs: TextField[] = [];

interface StateProps {
    step: Step;
}
interface DispatchProps {
    handleTimeChange: React.FormEventHandler<HTMLInputElement>;
    handleNameChange: React.FormEventHandler<HTMLInputElement>;
    toggleMinimized: () => void;

    handleInputCountChange: (i: number, e: React.FormEvent<HTMLInputElement>) => void;
    handleInputResourceChange: (i: number, e: React.FormEvent<HTMLInputElement>) => void;
    handleOutputCountChange: (i: number, e: React.FormEvent<HTMLInputElement>) => void;
    handleOutputResourceChange: (i: number, e: React.FormEvent<HTMLInputElement>) => void;
}

type StepProps = StateProps & DispatchProps;

const handleInputCountSpaceKeyPress = (index: number, event: React.KeyboardEvent<TextField>) => {
    if (event.key === ' ') {
        event.preventDefault();
        inputResourceInputs[index].focus();
    }
};

const handleOutputCountSpaceKeyPress = (index: number, event: React.KeyboardEvent<TextField>) => {
    if (event.key === ' ') {
        event.preventDefault();
        outputResourceInputs[index].focus();
    }
};

const StepUI: React.StatelessComponent<StepProps> = (
        {step,
        handleTimeChange,
        handleNameChange,
        toggleMinimized,
        handleInputCountChange,
        handleInputResourceChange,
        handleOutputCountChange,
        handleOutputResourceChange}) => (
    <Paper className="container">
        <TextField
            className="stepInput"
            underlineShow={false}
            name="name"
            type="text"
            value={step.name}
            onChange={handleNameChange}
        />
        <FlatButton
            onClick={toggleMinimized}
            label="-"
        />
        <div
            style={{display: step.minimized ? 'none' : 'flex'}}
        >
            <Paper className="container">
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
                                    onChange={handleInputCountChange.bind({}, i)}
                                    onKeyPress={handleInputCountSpaceKeyPress.bind({}, i)}
                                />
                                <TextField
                                    className="inputOutputField"
                                    hintText="Input Resource"
                                    underlineShow={false}
                                    type="text"
                                    value={step.inputs[i].resource}
                                    onChange={handleInputResourceChange.bind({}, i)}
                                    ref={element => { if (element) {inputResourceInputs[i] = element; } }}
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
                                    onChange={handleOutputCountChange.bind({}, i)}
                                    onKeyPress={handleOutputCountSpaceKeyPress.bind({}, i)}
                                />
                                <TextField
                                    className="inputOutputField"
                                    hintText="Output Resource"
                                    underlineShow={false}
                                    type="text"
                                    value={step.outputs[i].resource}
                                    onChange={handleOutputResourceChange.bind({}, i)}
                                    ref={element => { if (element) {outputResourceInputs[i] = element; } }}
                                />
                                <Divider />
                            </div>
                        );
                    })}
                </Paper>
            </Paper>
        </div>
    </Paper>
);

export interface StepUIOwnProps {
    index: number;
}

const mapStateToProps = (state: RootState, {index}: StepUIOwnProps): StateProps => {
    return { step: state.steps[index] };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, {index}: StepUIOwnProps): DispatchProps => {
    return {
        handleTimeChange: (e) => dispatch(updateStepTime(index, Number(e.currentTarget.value))),
        handleNameChange: (e) => dispatch(updateStepName(index, e.currentTarget.value)),
        toggleMinimized: () => dispatch(toggleStepMinimized(index)),
        handleInputCountChange: (i, e) => dispatch(updateStepInputCount(index, i, Number(e.currentTarget.value))),
        handleInputResourceChange: (i, e) => dispatch(updateStepInputResource(index, i, e.currentTarget.value)),
        handleOutputCountChange: (i, e) => dispatch(updateStepOutputCount(index, i, Number(e.currentTarget.value))),
        handleOutputResourceChange: (i, e) => dispatch(updateStepOutputResource(index, i, e.currentTarget.value))
    };
};

const StepComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(StepUI);

export default StepComponent;
