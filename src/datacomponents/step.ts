import ResourceCount from "./resourceCount";

export default class Step {
    time: number = 0;

    inputs: ResourceCount[] = [new ResourceCount];
    outputs: ResourceCount[] = [new ResourceCount];
}