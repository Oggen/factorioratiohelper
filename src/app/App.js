import React from 'react';
import { connect } from 'react-redux';
import styles from './app.css';
import Step from '../step/Step';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import { createStep, finalizeCancelOut, importSteps } from '../redux/actions';
import { compressToEncodedURIComponent as compress, decompressFromEncodedURIComponent as decompress } from 'lz-string';

const AppUI = ({inputs, outputs, steps, handleAddStep, handleInputClick, handleOutputClick, handleExport, handleImport}) => (
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
                <FlatButton onClick={handleImport} label="Import All from Clipboard" />
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
    return {
        steps: state.steps,
        ...calculateQuantities(state.steps)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleAddStep: () => dispatch(createStep()),
        handleInputClick: (x, _) => dispatch(finalizeCancelOut(x)),
        handleOutputClick: (x, _) => dispatch(finalizeCancelOut(x)),
        handleExport: () => dispatch(async (_, getState) => {
            await navigator.clipboard.writeText(getState().steps.map(x => compress(JSON.stringify(x))).join())
        }),
        handleImport: () => dispatch(async dispatch => {
            const clipped = await navigator.clipboard.readText();
            const steps = clipped.split(",").map(x => JSON.parse(decompress(x)));
            dispatch(importSteps(steps));
        })
    };
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);

export default App;
export { calculateQuantities };
