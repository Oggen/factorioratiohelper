import * as glpk from './glpk.min.js';

import { Step, ResourceCount, Resource } from '../datacomponents/index';

class RecipeModel{
    resources: ResourceCount[];
    constructor(source: Step){
        this.resources = [];

        //the multiple of this recipe that is complete in 1 time unit
        var productionRatio = source.time / source.speed;
        source.inputs.forEach(value => {
            this.resources.push({count: -value.count * productionRatio, resource: value.resource})
        });
        source.outputs.forEach(value => {
            this.resources.push({count: value.count * productionRatio, resource: value.resource})
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

    /**
     * 
     * @param allSteps All of the steps involved in this problem. can include steps not necissarily involved in the problem
     * @param desiredOutputs The outputs desired, in both name and amount
     * @param inputRatios All of the inputs that will be accepted; with an accompanying number that indcates the relative cost of the input
     */
    constructor(allSteps: Step[], desiredOutputs: ResourceCount[], inputRatios: ResourceCount[]){
        //this.recipeData = allSteps;
        this.desiredOutputs = desiredOutputs;
        this.inputWeights = inputRatios;

        allSteps.forEach((step, i) => {
            this.recipeData.push(new RecipeModel(step));
        });

        console.log(JSON.stringify(this.recipeData));
    }

    public findSolution(): SolutionModel{
        
        let problem = glpk.glp_create_prob();
        //specify that this is a minimization problem
        glpk.glp_set_obj_dir(problem, glpk.GLP_MIN);
        //every recipe is a column in the solver matrix
        //glpk.glp_add_cols(problem, this.recipeData.length);

        var allResources: Resource[] = [];
        var colMetadata: ColumnMetadata[] = [];

        this.recipeData.forEach((recipe, i) => {
            var colIndex = glpk.glp_add_cols(problem, 1);
            colMetadata.push({recipe: recipe});
            var rowIndexes: number[] = [];
            var colValues: number[] = [];

            recipe.resources.forEach((resource: ResourceCount) => {
                var index = allResources.indexOf(resource.resource) + 1;
                if(index == 0){
                    //if the resource hasn't been added, add it as a row
                    index = glpk.glp_add_rows(problem, 1);
                    allResources.push(resource.resource);
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
            var index = allResources.indexOf(resource.resource) + 1;
            if(index == 0)
                throw "Error: prioritized input resource not found in any recipes";
            
            var colIndex = glpk.glp_add_cols(problem, 1);
            //setup a new "recipe" that does nothing but produce the input item
            glpk.glp_set_mat_col(problem, colIndex, 1, [0, index], [0, 1]);
            //Make sure that the column only has a lower bound
            glpk.glp_set_col_bnds(problem, colIndex, glpk.GLP_LO, 0, 0);
            //put a cost on the new recipe column, indicating the relative cost of using one input item
            glpk.glp_set_obj_coef(problem, colIndex, resource.count);

            colMetadata.push({input: resource})
        });

        this.desiredOutputs.forEach(resource => {
            var index = allResources.indexOf(resource.resource) + 1;
            if(index == 0)
                throw "Error: output resource not found in any recipes";
            glpk.glp_set_row_bnds(problem, index, glpk.GLP_FX, resource.count, resource.count);
        });

        var file = "";
        var callbk = (str: string) => {file = file + str + "\n"}
        glpk.glp_write_lp(problem, null, callbk);
        console.log(file);

        var result = glpk.glp_simplex(problem);
        if(result != 0){
            throw `Error solving the linear optimization problem: ${result}`;
        }

        let output: SolutionModel = new SolutionModel();

        
        colMetadata.forEach((meta, i) => {
            var value = glpk.glp_get_col_prim(problem, i + 1);
            console.log(value);
            if(meta.input){
                output.realInputs.push({resource: meta.input.resource, count: value});
            }else if(meta.output){
                output.extraOutputs.push({resource: meta.output.resource, count: value});
            }else if(meta.recipe){
                output.stepMultipliers.push(value);
            }
        })

        return output;
    }
}