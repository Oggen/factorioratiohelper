import * as glpk from './glpk.min.js';

import { Step, ResourceCount, Resource } from '../datacomponents/index';

export default class RecipeModel{

    private recipeData: Step[];
    //private allResources: Resource;
    private desiredOutputs: ResourceCount[];
    private inputRatios: ResourceCount[];

    constructor(allSteps: Step[], desiredOutputs: ResourceCount[], inputRatios: ResourceCount[]){
        this.recipeData = allSteps;
        this.desiredOutputs = desiredOutputs;
        this.inputRatios = inputRatios;

        this.recipeData.forEach((rec, i) => {
            rec.inputs.forEach(item => {
                
            })
        });
    }

    public findSolution(): number[]{
        
        let problem = glpk.glp_create_prob();
        //specify that this is a minimization problem
        glpk.glp_set_obj_dir(problem, glpk.GLP_MIN);
        //every recipe is a column in the solver matrix
        glpk.glp_add_cols(problem, this.recipeData.length);

        var allResources: Resource[] = [];

        this.recipeData.forEach((recipe, i) => {
            var addRow = (resource: ResourceCount) => {
                var index = allResources.indexOf(resource.resource);
                if(index == -1){
                    //if the resource hasn't been added, add it
                    index = glpk.glp_add_rows(problem, 1);
                    allResources.push(resource.resource);
                    glpk.glp_set_row_name(problem, index, resource.resource);
                }
                //TODO: set the row weights on the column for this recipe
            }
            recipe.inputs.forEach(addRow);
            recipe.outputs.forEach(addRow);
        });
        return [];
    }
}