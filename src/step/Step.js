import React, { Component } from 'react';
import styles from './step.css';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

export default class Step extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputs: [{}],
            outputs: [{}]
        };
    }

    dataUpdated() {
        if (this.state.count === undefined || this.state.speed === undefined || !(this.state.time > 0)) {
            return;
        }
        
        const scale = this.state.speed / this.state.time;

        let inputs = [];
        this.state.inputs.forEach(x => {
            if (x.resource && x.count) {
                inputs.push({
                    resource: x.resource.trim().toLowerCase(),
                    count: x.count * scale * this.state.count
                });
            }
        });
        
        let outputs = [];
        this.state.outputs.forEach(x => {
            if (x.resource && x.count) {
                outputs.push({
                    resource: x.resource.trim().toLowerCase(),
                    count: x.count * scale * this.state.count
                });
            }
        });

        this.props.update(inputs, outputs);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value}, this.dataUpdated);
    }

    handleInputChange(property, index, e) {
        let inputs = this.state.inputs.slice();
        inputs[index][property] = e.target.value;
        if (!inputs[index].count && !inputs[index].resource) {
            inputs.splice(index, 1);
        }
        else if (index === inputs.length - 1) {
            inputs.push({});
        }
        this.setState({inputs: inputs}, this.dataUpdated);
    }

    handleOutputChange(property, index, e) {
        let outputs = this.state.outputs.slice();
        outputs[index][property] = e.target.value;
        if (!outputs[index].count && !outputs[index].resource) {
            outputs.splice(index, 1);
        }
        else if (index === outputs.length - 1) {
            outputs.push({});
        }
        this.setState({outputs: outputs}, this.dataUpdated);
    }

    render() {
        return (
            <Paper className="container">
                <TextField
                    className="stepInput"
                    floatingLabelText="Count"
                    name="count"
                    type="number"
                    value={this.state.count}
                    onChange={this.handleChange.bind(this)}
                />

                <TextField
                    className="stepInput"
                    floatingLabelText="Crafting Speed"
                    name="speed"
                    type="number"
                    value={this.state.speed}
                    onChange={this.handleChange.bind(this)}
                />

                <TextField
                    className="stepInput"
                    floatingLabelText="Crafting Time"
                    name="time"
                    type="number"
                    value={this.state.time}
                    onChange={this.handleChange.bind(this)}
                />
                
                <Paper zDepth={2} className="inputOutputContainer">
                    {this.state.inputs.map((x, i) => {
                        return (
                            <div key={i}>
                                <TextField
                                    className="inputOutputField"
                                    hintText="Input Count"
                                    underlineShow={false}
                                    type="number"
                                    value={this.state.inputs[i].count}
                                    onChange={this.handleInputChange.bind(this, "count", i)}
                                />
                                <TextField
                                    className="inputOutputField"
                                    hintText="Input Resource"
                                    underlineShow={false}
                                    type="text"
                                    value={this.state.inputs[i].resource}
                                    onChange={this.handleInputChange.bind(this, "resource", i)}
                                />
                                <Divider />
                            </div>
                        );
                    })}
                </Paper>

                <Paper zDepth={2} className="inputOutputContainer">
                    {this.state.outputs.map((x, i) => {
                        return (
                            <div key={i}>
                                <TextField
                                    className="inputOutputField"
                                    hintText="Output Count"
                                    underlineShow={false}
                                    type="number"
                                    value={this.state.outputs[i].count}
                                    onChange={this.handleOutputChange.bind(this, "count", i)}
                                />
                                <TextField
                                    className="inputOutputField"
                                    hintText="Output Resource"
                                    underlineShow={false}
                                    type="text"
                                    value={this.state.outputs[i].resource}
                                    onChange={this.handleOutputChange.bind(this, "resource", i)}
                                />
                                <Divider />
                            </div>
                        );
                    })}
                </Paper>
            </Paper>
        );
    }
}
