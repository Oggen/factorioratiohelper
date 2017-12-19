import React from 'react';
import { connect } from 'react-redux';
import styles from './app.css';
import Step from '../step/Step';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import { createStep } from '../redux/actions';

const AppUI = ({inputs, outputs, steps, handleAddStep}) => (
    <div className="content">
        {inputs.length > 0 && <Subheader>Inputs</Subheader>}
        <div className="chips">
            {inputs.map((x, i) => {
                return (
                    <Chip key={i} className="chip">
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
                    <Chip key={i} className="chip">
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
            </div>
        </div>
    </div>
);

const calculateQuantites = steps => {
    let quantites = [];

    steps.forEach(step => {
        step.inputs.forEach(input => {
            let existing = quantites.find(x => x.resource === input.resource);
            if (existing) {
                existing.count += input.count;
            }
            else {
                quantites.push({
                    resource: input.resource,
                    count: input.count
                });
            }
        });
        step.outputs.forEach(output => {
            let existing = quantites.find(x => x.resource === output.resource);
            if (existing) {
                existing.count -= output.count;
            }
            else {
                quantites.push({
                    resource: output.resource,
                    count: -output.count
                });
            }
        });
    });

    let inputs = quantites.filter(x => x.count > 0);
    let outputs = quantites.filter(x => x.count < 0);

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
        ...calculateQuantites(state.steps)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleAddStep: () => dispatch(createStep())
    };
};

export default App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);


