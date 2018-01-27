import * as glpk from './glpk.min.js';

import { Step, ResourceCount, Resource } from '../datacomponents/index';

export class RecipeModel{
    resources: ResourceCount[];
    constructor(source: Step){
        this.resources = [];

        //the multiple of this recipe that is complete in 1 time unit
        source.inputs.forEach(value => {
            this.resources.push({count: -value.count / source.time , resource: value.resource})
        });
        source.outputs.forEach(value => {
            this.resources.push({count: value.count  / source.time, resource: value.resource})
        });
    }
}

interface ColumnMetadata{
    recipe?: RecipeModel;
    input?: ResourceCount;
    output?:ResourceCount;
}

export class SolutionModel{
    stepMultipliers: number[] = [];
    realInputs: ResourceCount[] = [];
    extraOutputs: ResourceCount[] = [];
}

export default class RecipeSolver{
    private recipeData: RecipeModel[] = [];
    //private allResources: Resource;
    private desiredOutputs: ResourceCount[];
    private inputWeights: ResourceCount[];
    private slackOutputs: ResourceCount[] | undefined;

    private log: (str: string) => void;

    /**
     * 
     * @param allSteps All of the steps involved in this problem. can include steps not necissarily involved in the problem
     * @param desiredOutputs The outputs desired, in both name and amount
     * @param inputRatios All of the inputs that will be accepted; with an accompanying number that indcates the relative cost of the input
     * @param slackOutputs The possible extra output resources, and the prefferential rate that they should be output into.
     *      Similar to inputRations, except for outputs. If left out, then it is assumed all non-input and non-output resources are slack outputs
     *      with a weight of 1,000,000,000
     */
    constructor(allSteps: Step[], desiredOutputs: ResourceCount[], inputRatios: ResourceCount[], slackOutputs?: ResourceCount[], log: (str: string) => void = a=>{}){
        //this.recipeData = allSteps;
        this.desiredOutputs = desiredOutputs;
        this.inputWeights = inputRatios;
        this.slackOutputs = slackOutputs;
        this.log = log;

        allSteps.forEach((step, i) => {
            this.recipeData.push(new RecipeModel(step));
        });

        this.log(JSON.stringify(this.recipeData));
    }

    private allResources: Resource[];

    private addResourcePipeWithWeight(resourceName: string, resourceWeight: number, isInput: boolean, glpkProblem: any){
        var index = this.allResources.indexOf(resourceName) + 1;
        if(index == 0)
            throw "Error: prioritized resource pipe not found in any recipes";
        
        var colIndex = glpk.glp_add_cols(glpkProblem, 1);
        //setup a new "recipe" that does nothing but produce the input item
        glpk.glp_set_mat_col(glpkProblem, colIndex, 1, [0, index], [0, (isInput ? 1 : -1)]);
        //Make sure that the column only has a lower bound
        glpk.glp_set_col_bnds(glpkProblem, colIndex, glpk.GLP_LO, 0, 0);
        //put a cost on the new recipe column, indicating the relative cost of using one input item
        glpk.glp_set_obj_coef(glpkProblem, colIndex, resourceWeight);
    }

    public findSolution(): SolutionModel{
        
        let problem = glpk.glp_create_prob();
        //specify that this is a minimization problem
        glpk.glp_set_obj_dir(problem, glpk.GLP_MIN);
        //every recipe is a column in the solver matrix
        //glpk.glp_add_cols(problem, this.recipeData.length);

        this.allResources = [];
        var colMetadata: ColumnMetadata[] = [];

        this.recipeData.forEach((recipe, i) => {
            var colIndex = glpk.glp_add_cols(problem, 1);
            colMetadata.push({recipe: recipe});
            var rowIndexes: number[] = [];
            var colValues: number[] = [];

            recipe.resources.forEach((resource: ResourceCount) => {
                var index = this.allResources.indexOf(resource.resource) + 1;
                if(index == 0){
                    //if the resource hasn't been added, add it as a row
                    index = glpk.glp_add_rows(problem, 1);
                    this.allResources.push(resource.resource);
                    glpk.glp_set_row_name(problem, index, resource.resource);
                    glpk.glp_set_row_bnds(problem, index, glpk.GLP_FX, 0, 0);
                }
                //set the row weights on the column for this recipe
                rowIndexes.push(index);
                colValues.push(resource.count);
            });
            glpk.glp_set_col_bnds(problem, colIndex, glpk.GLP_LO, 0, 0);
            glpk.glp_set_mat_col(problem, colIndex, rowIndexes.length, [0, ...rowIndexes], [0, ...colValues]);

        });

        this.inputWeights.forEach(resource => {
            this.addResourcePipeWithWeight(resource.resource, resource.count, true, problem);

            colMetadata.push({input: resource})
        });

        this.desiredOutputs.forEach(resource => {
            var index = this.allResources.indexOf(resource.resource) + 1;
            if(index == 0)
                throw "Error: output resource not found in any recipes";
            glpk.glp_set_row_bnds(problem, index, glpk.GLP_FX, resource.count, resource.count);
        });

        if(this.slackOutputs){
            this.slackOutputs.forEach(resource => {
                this.addResourcePipeWithWeight(resource.resource, resource.count, false, problem);

                colMetadata.push({output: resource})
            });
        }else{
            // if slackOutputs are null; assume all resources are slack outputs at very high weight
            this.allResources.forEach((resource, index) => {
                if(this.inputWeights.reduce((pv, current) => pv || (current.resource == resource), false)){
                    // if the resource is already an input
                    return;
                }
                if(this.desiredOutputs.reduce((pv, current) => pv || (current.resource == resource), false)){
                    // if the resource is already an output
                    return;
                }
                
                this.addResourcePipeWithWeight(resource, 1000000000, false, problem);

                colMetadata.push({output: {resource: resource, count: 1000000000}});
            })
        }
        var file = "";
        var callbk = (str: string) => {file += str + "\n"}
        glpk.glp_write_lp(problem, null, callbk);
        this.log(file);

        var result = glpk.glp_simplex(problem);
        if(result != 0){
            throw `Error solving the linear optimization problem: ${result}`;
        }

        let output: SolutionModel = new SolutionModel();

        
        colMetadata.forEach((meta, i) => {
            var value = glpk.glp_get_col_prim(problem, i + 1);
            this.log(value);
            if(value > 0){
                if(meta.input){
                    output.realInputs.push({resource: meta.input.resource, count: value});
                }else if(meta.output){
                    output.extraOutputs.push({resource: meta.output.resource, count: value});
                }else if(meta.recipe){
                    output.stepMultipliers.push(value);
                }
            }
        })

        return output;
    }
}