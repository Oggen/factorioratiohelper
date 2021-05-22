import React from 'react';
import { connect } from 'react-redux';
import styles from './app.css';
import Step from '../step/Step';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import { createStep, finalizeCancelOut, importStep, importSteps, scaleSystem } from '../redux/actions';
import { compressToEncodedURIComponent as compress, decompressFromEncodedURIComponent as decompress } from 'lz-string';

var scaleElement;

const AppUI = ({inputs, outputs, steps, handleAddStep, handleInputClick, handleOutputClick, handleExport, handleImport, handleScale}) => (
    <div className="content">
        {inputs.length > 0 && <Subheader>Inputs</Subheader>}
        <div className="chips">
            {inputs.map((x, i) => {
                return (
                    <Chip key={i} className="chip" onClick={handleInputClick.bind(this, x.resource)}>
                        <Avatar>{+x.count.toFixed(2)}</Avatar>
                        {x.resource}
                    </Chip>
                );
            })}
        </div>

        {outputs.length > 0 && <Subheader>Outputs</Subheader>}
        <div className="chips">
            {outputs.map((x, i) => {
                return (
                    <Chip key={i} className="chip" onClick={handleOutputClick.bind(this, x.resource)}>
                        <Avatar>{+x.count.toFixed(2)}</Avatar>
                        {x.resource}
                    </Chip>
                );
            })}
        </div>

        <div className="steps">
            {steps.map((x, i) => {
                return (
                    <Step key={i} index={i} />
                );
            })}
            <div>
                <FlatButton onClick={handleAddStep} label="Add Step" />
                <FlatButton onClick={handleExport} label="Export All to Clipboard" />
                <FlatButton onClick={handleImport} label="Import from Clipboard" />
                <TextField
                    className="scaleInput"
                    hintText="Scale by..."
                    type="number"
                    ref={element => { scaleElement = element }}
                />
                <FlatButton onClick={handleScale} label="Scale System" />
            </div>
        </div>
    </div>
);

const calculateQuantities = steps => {
    let quantities = [];

    steps.forEach(step => {
        if (step.count === "" || step.speed === "" || step.time === "") return;
        const scale = step.count * step.speed / step.time;

        step.inputs.forEach(input => {
            if (input.resource === "" || input.count === "") return;
            const count = input.count * scale;
            let existing = quantities.find(x => x.resource === input.resource);
            if (existing) {
                existing.count += count;
            }
            else {
                quantities.push({
                    resource: input.resource,
                    count: count
                });
            }
        });
        step.outputs.forEach(output => {
            if (output.resource === "" || output.count === "") return;
            const count = output.count * scale;
            let existing = quantities.find(x => x.resource === output.resource);
            if (existing) {
                existing.count -= count;
            }
            else {
                quantities.push({
                    resource: output.resource,
                    count: -count
                });
            }
        });
    });

    let inputs = quantities.filter(x => x.count > 0);
    let outputs = quantities.filter(x => x.count < 0);

    let resources = inputs.map(x => x.resource);
    outputs.forEach(x => {
        if (!resources.some(y => y === x.resource)) {
            resources.push(x.resource);
        }
    });

    outputs.forEach(x => x.count = Math.abs(x.count));

    return { inputs: inputs, outputs: outputs };
}

const mapStateToProps = state => {
    const { inputs, outputs } = calculateQuantities(state.steps);
    return {
        steps: state.steps,
        inputs: inputs.filter(x => x.count > 0.00001 ),
        outputs: outputs.filter(x => x.count > 0.00001 )
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleAddStep: () => dispatch(createStep()),
        handleInputClick: (x, _) => dispatch(finalizeCancelOut(x)),
        handleOutputClick: (x, _) => dispatch(finalizeCancelOut(x)),
        handleExport: () => dispatch(async (_, getState) => {
            await navigator.clipboard.writeText("a" + compress(JSON.stringify(getState().steps)));
        }),
        handleImport: () => dispatch(async dispatch => {
            const clipped = await navigator.clipboard.readText();
            const mode = clipped[0];
            const data = clipped.slice(1);
            if (mode === "a") {
                dispatch(importSteps(JSON.parse(decompress(data))));
            } else if (mode === "s") {
                dispatch(importStep(JSON.parse(decompress(data))));
            }
        }),
        handleScale: () => {
            if (isNaN(+scaleElement.input.value)) return;
            dispatch(scaleSystem(+scaleElement.input.value));
        }
    };
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);

export default App;
export { calculateQuantities };
