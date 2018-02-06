import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import '../app/app.css';

import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { setExtraOutput, setActualInput, RootAction } from '../redux/actions';
import RootState from '../redux/rootState';

import { ResourceCount, Step } from '../datacomponents/index';
import RecipeSolver from '../solver/solver';
import ResourceInputComponent from '../resourceInput/ResourceInputComponent';

interface StateProps {
    realInputs: ResourceCount[];
    extraOutputs: ResourceCount[];
    allSteps: Step[];
    inputWeights: ResourceCount[];
    outputRequested: ResourceCount[];
}
interface DispatchProps {
    handleDoCalc: (steps: Step[], inputWeights: ResourceCount[], desiredOutputs: ResourceCount[]) => void;
}
type ResourceSetupUIProps = StateProps & DispatchProps;

const ResourceSetupUI: React.StatelessComponent<ResourceSetupUIProps> = (
    {
        realInputs, 
        extraOutputs, 
        handleDoCalc, 
        allSteps, 
        inputWeights, 
        outputRequested}) => (
    <div className="content">
        <div>
            <FlatButton onClick={(e) => handleDoCalc(allSteps, inputWeights, outputRequested)} label="Calc" />
        </div>
        <div className="inputs">
            <Paper className="resources">
                <Subheader>Inputs</Subheader>
                <ResourceInputComponent storeName="inputRatios"/>
            </Paper>
            <Paper className="resources">
                <Subheader>Outputs</Subheader>
                <ResourceInputComponent storeName="outputRequested"/>
            </Paper>
        </div>
        <div className="outputs">
            <Paper className="resources">
                <Table>
                    <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                    >
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Amount</TableHeaderColumn>
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {realInputs.map((value, i) => (
                            <TableRow key={i} >
                                <TableRowColumn>{value.resource}</TableRowColumn>
                                <TableRowColumn>{value.count}</TableRowColumn>
                            </TableRow>)
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <Paper className="resources">
                <Table>
                    <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                    >
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Amount</TableHeaderColumn>
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {extraOutputs.map((value, i) => (
                            <TableRow key={i} >
                                <TableRowColumn>{value.resource}</TableRowColumn>
                                <TableRowColumn>{value.count}</TableRowColumn>
                            </TableRow>)
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    </div>
);

const calculateQuantites = (steps: Step[], inputWeights: ResourceCount[], desiredOutputs: ResourceCount[])
        : {inputs: ResourceCount[], outputs: ResourceCount[]} => {
    
    let solver  = new RecipeSolver(
        steps.map(step => ({
            time: step.time,
            inputs: step.inputs.filter(input => input.count > 0 && input.resource !== null && input.resource !== ''),
            outputs: step.outputs.filter(input => input.count > 0 && input.resource !== null && input.resource !== '')
        })), 
        desiredOutputs, 
        inputWeights);

    const solution = solver.findSolution();

    return {
        inputs: solution.realInputs,
        outputs: solution.extraOutputs
    };
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        realInputs: state.actualInputs,
        extraOutputs: state.extraOutputs,
        allSteps: state.steps,
        inputWeights: state.inputRatios,
        outputRequested: state.outputRequested
    };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
    return {
        handleDoCalc: (steps: Step[], inputWeights: ResourceCount[], desiredOutputs: ResourceCount[]) => {
            let output = calculateQuantites(steps, inputWeights, desiredOutputs);

            dispatch(setExtraOutput(output.outputs));
            dispatch(setActualInput(output.inputs));
        }
    };
};

const ResourceSetupComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourceSetupUI);

export default ResourceSetupComponent;
