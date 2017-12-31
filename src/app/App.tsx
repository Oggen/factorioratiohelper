import * as React from "react";
import { connect, Dispatch } from "react-redux";
import "./app.css";
import StepComponent from "../step/StepComponent";
import FlatButton from "material-ui/FlatButton";
import Chip from "material-ui/Chip";
import Avatar from "material-ui/Avatar";
import Subheader from "material-ui/Subheader";
import { createStep, RootAction } from "../redux/actions";
import RootState from "../redux/rootState";

import { ResourceCount, Step } from "../datacomponents/index";

interface StateProps {
    inputs: ResourceCount[];
    outputs: ResourceCount[];
    steps: Step[];
}
interface DispatchProps {
    handleAddStep: (event: React.MouseEvent<{}>) => void;
}
type AppUIProps = StateProps & DispatchProps;

const AppUI: React.StatelessComponent<AppUIProps> = ({inputs, outputs, steps, handleAddStep}) => (
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
                    <StepComponent key={i} index={i} />
                );
            })}
            <div>
                <FlatButton onClick={handleAddStep} label="Add Step" />
            </div>
        </div>
    </div>
);

const calculateQuantites = (steps: Step[]) => {
    let quantites: ResourceCount[] = [];

    steps.forEach(step => {
        // this check may not be needed if the step object is typed
        // if (step.count === "" || step.speed === "" || step.time === "") return;
        const scale = step.count * step.speed / step.time;

        step.inputs.forEach(input => {
            if (input.resource === ""/* || input.count === ""*/) { return; }
            const count = input.count * scale;
            let existing = quantites.find(x => x.resource === input.resource);
            if (existing) {
                existing.count += count;
            }
            else {
                quantites.push({
                    resource: input.resource,
                    count: count
                });
            }
        });
        step.outputs.forEach(output => {
            if (output.resource === "" /*|| output.count === ""*/) { return; }
            const count = output.count * scale;
            let existing = quantites.find(x => x.resource === output.resource);
            if (existing) {
                existing.count -= count;
            }
            else {
                quantites.push({
                    resource: output.resource,
                    count: -count
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
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        steps: state.steps,
        ...calculateQuantites(state.steps)
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
