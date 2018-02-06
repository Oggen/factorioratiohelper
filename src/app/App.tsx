import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import './app.css';

import { Tabs, Tab } from 'material-ui/Tabs';

import { createStep, RootAction } from '../redux/actions';
import RootState from '../redux/rootState';

import RecipesComponent from '../recipes/RecipesComponent';
import { ResourceCount } from '../datacomponents/index';
import ResourceSetupComponent from '../resourceSetup/ResourceSetup';

interface StateProps {
    inputs: ResourceCount[];
    outputs: ResourceCount[];
}
interface DispatchProps {
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

const mapStateToProps = (state: RootState): StateProps => {
    return {
        inputs: state.inputRatios,
        outputs: state.outputRequested
    };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
    return {
        handleAddStep: () => dispatch(createStep())
    };
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);

export default App;
