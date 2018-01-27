import RecipeSolver  from './solver';
import { SolutionModel }  from './solver';
import { Step, ResourceCount } from '../datacomponents/index';
import {recipeDictionary} from './stepDictionary';

describe('Recipe Solver', () => {
    it('Solves iron ore to gear', () => {
        // Arrange
        var stepsInput: Step[] = [
            recipeDictionary['iron_smelting_from_ore'],
            recipeDictionary['gear'],
        ];
        var outputs: ResourceCount[] = [
            {resource: 'gear', count: 1}
        ];
        var inputs: ResourceCount[] = [
            {resource: 'iron_ore', count: 1}
        ];
        var solver = new RecipeSolver(stepsInput, outputs, inputs);
        
        var expectedOutput: SolutionModel = {
            stepMultipliers: [7, 1],
            realInputs: [{resource: 'iron_ore', count: (8/3)}],
            extraOutputs: [],
        }

        // Act
        var result = solver.findSolution();

        //Assert
        //console.log(result);
        expect(JSON.stringify(result) == JSON.stringify(expectedOutput)).toBeTruthy();
    });
    it('Solves water to mineralized water', () => {
        // Arrange
        var stepsInput: Step[] = [
            recipeDictionary['electrolysis'],
            recipeDictionary['slag_crush'],
            recipeDictionary['mineralize_water'],
        ];
        var outputs: ResourceCount[] = [
            {resource: 'mineralized_water', count: 1}
        ];
        var inputs: ResourceCount[] = [
            {resource: 'water', count: 1}
        ];
        var solver = new RecipeSolver(stepsInput, outputs, inputs);
        
        var expectedOutput: SolutionModel = {
            stepMultipliers: [0.1, 1/30, 2/300],
            realInputs: [{resource: 'water', count: 6}],
            extraOutputs: [
                {resource: 'oxygen', count: 1.5},
                {resource: 'hydrogen', count: 2},
            ]
        }

        // Act
        var result = solver.findSolution();

        //Assert
        //console.log(result);
        expect(JSON.stringify(result) == JSON.stringify(expectedOutput)).toBeTruthy();
    });
    it('Solves water to wood pellets', () => {
        // Arrange
        var stepsInput: Step[] = [
            recipeDictionary['electrolysis'],
            recipeDictionary['slag_crush'],
            recipeDictionary['mineralize_water'],
            recipeDictionary['green_algea_growth'],
            recipeDictionary['cellulose_fiber'],
            recipeDictionary['wood_pellet'],
            recipeDictionary['burn_pellets'],
        ];
        var outputs: ResourceCount[] = [
            {resource: 'wood_pellets', count: 1}
        ];
        var inputs: ResourceCount[] = [
            {resource: 'water', count: 1}
        ];
        var solver = new RecipeSolver(stepsInput, outputs, inputs);//, undefined, console.log);
        
        var expectedOutput: SolutionModel = {
            stepMultipliers: [ 5.25, 1.75, 0.35, 10.5, 4.2, 7, 1 ],
            realInputs: [{resource: 'water', count: 315}],
            extraOutputs: [
                {resource: 'oxygen', count: 78.75},
                {resource: 'hydrogen', count: 105},
            ]
        }

        // Act
        var result = solver.findSolution();

        //Assert
        console.log(result);
        expect(JSON.stringify(result) == JSON.stringify(expectedOutput)).toBeTruthy();
    });
    it('Solves water to mineral sludge', () => {
        // Arrange
        var stepsInput: Step[] = [
            //wood pellet loop
            recipeDictionary['electrolysis'],
            recipeDictionary['slag_crush'],
            recipeDictionary['mineralize_water'],
            recipeDictionary['green_algea_growth'],
            recipeDictionary['cellulose_fiber'],
            recipeDictionary['wood_pellet'],
            recipeDictionary['burn_pellets'],

            recipeDictionary['wood_brick_from_pellet'],
            recipeDictionary['wood_brick_smelting'],


            recipeDictionary['slag_slurry'],
            recipeDictionary['sulfur_dioxide_to_acid'],
            recipeDictionary['sulfur_burning'],
            recipeDictionary['water_synthesis'],
            recipeDictionary['sulfuric_waste_purification'],
            recipeDictionary['slurry_coal_filtering'],
            recipeDictionary['coal_filter'],
        ];
        var outputs: ResourceCount[] = [
            {resource: 'mineral_sludge', count: 100}
        ];
        var inputs: ResourceCount[] = [
            {resource: 'water', count: 1}
        ];
        var solver = new RecipeSolver(stepsInput, outputs, inputs);//, undefined, console.log);
        
        var expectedOutput: SolutionModel = {
            stepMultipliers:
             [ 20.2,//electrolysis
               0.06666666666666661,//slag crushers
               0.013333333333333324,//water mineralizers
               2.7999999999999994,//green algea ponds
               1.1199999999999999,//cellulose fiber
               1.8666666666666665,//wood pellet assemblers
               0.2666666666666666,//pellet - to - co2
               0.13333333333333333,// pellet to brick
               0.4666666666666668,// wood brick to coal
               4.8,// slag slurry assemblers
               0.8,// sulfur dioxide to acid
               0.96,// sulfur to sulfur dioxide
               7.1822222222222205,// synthesis of purified water
               0.6000000000000001, // sulfuric waste purifiers
               5.333333333333334, // slag slurry filters
               0.8 // coal filter assemblers
            ],
            realInputs: [ { resource: 'water', count: 1012 } ],
            extraOutputs:
             [ { resource: 'oxygen', count: 3.6666666666666874 },
               { resource: 'sulfuric_acid', count: 1.0000000000000038 },
               { resource: 'purified_water', count: 370.8888888888888 } ]
            }

        // Act
        var result = solver.findSolution();

        //Assert
        console.log(result);
        expect(JSON.stringify(result) == JSON.stringify(expectedOutput)).toBeTruthy();
    });
    it('Does Nothing', () => {

    });
})