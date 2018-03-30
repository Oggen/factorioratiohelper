import ResourceCount from './resourceCount';

export default class Step {
    time: number = 0;
    minimized?: boolean = false;
    name?: string;

    inputs: ResourceCount[] = [new ResourceCount];
    outputs: ResourceCount[] = [new ResourceCount];
}