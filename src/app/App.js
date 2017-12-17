import React, { Component } from 'react';
import styles from './app.css';
import Step from '../step/Step';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: [],
            inputs: [],
            outputs: [],
            resources: []
        };
    }

    addStep() {
        this.setState({steps: this.state.steps.concat({inputs: [], outputs: []})});
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

        let resources = inputs.map(x => x.resource);
        outputs.forEach(x => {
            if (!resources.some(y => y === x.resource)) {
                resources.push(x.resource);
            }
        });

        outputs.forEach(x => x.count = Math.abs(x.count));

        this.setState({steps: steps, inputs: inputs, outputs: outputs, resources: resources});
    }

    render() {

        return (
            <div className="content">
                {this.state.inputs.length > 0 && <Subheader>Inputs</Subheader>}
                <div className="chips">
                    {this.state.inputs.map((x, i) => {
                        return (
                            <Chip key={i} className="chip">
                                <Avatar>{+x.count.toFixed(2)}</Avatar>
                                {x.resource}
                            </Chip>
                        );
                    })}
                </div>

                {this.state.outputs.length > 0 && <Subheader>Outputs</Subheader>}
                <div className="chips">
                    {this.state.outputs.map((x, i) => {
                        return (
                            <Chip key={i} className="chip">
                                <Avatar>{+x.count.toFixed(2)}</Avatar>
                                {x.resource}
                            </Chip>
                        );
                    })}
                </div>

                <div className="steps">
                    {this.state.steps.map((x, i) => {
                        return (
                            <Step key={i} resources={this.state.resources} update={this.updateStepData.bind(this, i)} />
                        );
                    })}
                    <div>
                        <FlatButton onClick={this.addStep.bind(this)} label="Add Step" />   
                    </div>
                </div>
            </div>
        );
    }
}
