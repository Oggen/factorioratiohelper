import ResourceCount from './resourceCount';

export default class Step{
    count: number;
    speed: number;
    time: number;

    inputs: ResourceCount[];
    outputs: ResourceCount[];
}