import React, { Component } from 'react';
import Step from './Step';
import FlatButton from 'material-ui/FlatButton';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: [],
            inputs: [],
            outputs: []
        };
    }

    addStep() {
        this.setState({steps: this.state.steps.concat({})});
    }

    updateStepData(i, inputs, outputs) {
        let steps = this.state.steps.slice();
        steps[i].inputs = inputs;
        steps[i].outputs = outputs;
        this.calculateQuantites(steps);
    }

    calculateQuantites(steps) {
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
        outputs.forEach(x => x.count = Math.abs(x.count));

        this.setState({steps: steps, inputs: inputs, outputs: outputs});
    }

    render() {

        return (
            <div>
                <div>inputs</div>
                {this.state.inputs.map((x, i) => {
                    return (
                        <div key={i}>{x.count} {x.resource}</div>
                    );
                })}
                <div>outputs</div>
                {this.state.outputs.map((x, i) => {
                    return (
                        <div key={i}>{x.count} {x.resource}</div>
                    );
                })}
                <FlatButton onClick={this.addStep.bind(this)} label="Add Step" />
                {this.state.steps.map((x, i) => {
                    return (
                        <Step key={i} update={this.updateStepData.bind(this, i)} />
                    );
                })}
            </div>
        );
    }
}