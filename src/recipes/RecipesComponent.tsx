import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import '../app/app.css';
import StepComponent from '../step/StepComponent';
import FlatButton from 'material-ui/FlatButton';
import { createStep, RootAction } from '../redux/actions';
import RootState from '../redux/rootState';

import { Step } from '../datacomponents/index';

interface StateProps {
    steps: Step[];
}
interface DispatchProps {
    handleAddStep: (event: React.MouseEvent<{}>) => void;
}
type RecipesComponentUIProps = StateProps & DispatchProps;

const RecipesComponentUI: React.StatelessComponent<RecipesComponentUIProps> = ({steps, handleAddStep}) => (
    <div className="content">
        <div className="steps">
            {steps.map((x, i) => {
                return (
                    <StepComponent key={i} index={i} />
                );
            })}
            <div>
                <FlatButton onClick={handleAddStep} label="Add Step" />   
            </div>
        </div>
    </div>
);

const mapStateToProps = (state: RootState): StateProps => {
    return {
        steps: state.steps
    };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
    return {
        handleAddStep: () => dispatch(createStep())
    };
};

const RecipesComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecipesComponentUI);

export default RecipesComponent;
