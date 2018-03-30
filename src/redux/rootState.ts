import { Step } from '../datacomponents/index';
import ResourceCount from '../datacomponents/resourceCount';

export default interface RootState {
    readonly steps: Step[];
    readonly inputRatios: ResourceCount[];
    readonly outputRequested: ResourceCount[];
    readonly actualInputs: ResourceCount[];
    readonly extraOutputs: ResourceCount[];
}