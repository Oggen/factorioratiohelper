import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import './app.css';

import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';


import { createStep, RootAction } from '../redux/actions';
import RootState from '../redux/rootState';


import RecipesComponent from '../recipes/RecipesComponent';
import { ResourceCount, Step } from '../datacomponents/index';
import RecipeSolver from '../solver/solver';
import ResourceInputComponent from '../resourceInput/ResourceInputComponent';
import ResourceSetupComponent from '../resourceSetup/ResourceSetup';

interface StateProps{
    inputs: ResourceCount[];
    outputs: ResourceCount[];
}
interface DispatchProps{
    handleAddStep: (event: React.MouseEvent<{}>) => void;
}
type AppUIProps = StateProps & DispatchProps;

const AppUI: React.StatelessComponent<AppUIProps> = ({inputs, outputs, handleAddStep}) => (
    <Tabs>
        <Tab label="Resource Counts">
            <ResourceSetupComponent />
        </Tab>
        <Tab label="Recepies">
            <RecipesComponent/>
        </Tab>
    </Tabs>
);

/*
const calculateQuantites = (steps : Step[], inputWeights: ResourceCount[], desiredOutputs: ResourceCount[]): {inputs: ResourceCount[], outputs: ResourceCount[]} => {
    
    let solver  = new RecipeSolver(steps, desiredOutputs, inputWeights);

    const solution = solver.findSolution();

    return {
        inputs: solution.realInputs,
        outputs: solution.extraOutputs
    }
}*/

const mapStateToProps = (state : RootState) : StateProps => {
    return {
        inputs: state.inputRatios,
        outputs: state.outputRequested
    };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) : DispatchProps => {
    return {
        handleAddStep: () => dispatch(createStep())
    };
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);

export default App;
