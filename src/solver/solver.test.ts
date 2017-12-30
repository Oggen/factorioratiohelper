import * as React from 'react';
import * as ReactDOM from 'react-dom';


import RecipeSolver  from './solver';
import { SolutionModel }  from './solver';
import { Step, ResourceCount, Resource } from '../datacomponents/index';

const recipeDictionary: {[name: string]: Step} = {
    'electrolysis': {
        count: 0,
        speed: 1,
        time: 2,
        inputs: [
            {resource: 'water', count: 100},
        ],
        outputs: [
            {resource: 'slag', count: 1},
            {resource: 'oxygen', count: 30},
            {resource: 'hydrogen', count: 40},
        ]
    },
    'slag_crush': {
        count: 0,
        speed: 1.5,
        time: 1,
        inputs: [
            {resource: 'slag', count: 1},
        ],
        outputs: [
            {resource: 'crushed_stone', count: 2},
        ]
    },
    'mineralize_water': {
        count: 0,
        speed: 1.5,
        time: 1,
        inputs: [
            {resource: 'crushed_stone', count: 10},
            {resource: 'water', count: 100},
        ],
        outputs: [
            {resource: 'mineralized_water', count: 100},
        ]
    },
    'green_algea_growth': {
        count: 0,
        speed: 1,
        time: 20,
        inputs: [
            {resource: 'carbon_dioxide', count: 100},
            {resource: 'mineralized_water', count: 100},
        ],
        outputs: [
            {resource: 'green_algea', count: 40},
        ]
    },
    'cellulose_fiber': {
        count: 0,
        speed: 1.5,
        time: 3,
        inputs: [
            {resource: 'green_algea', count: 10},
        ],
        outputs: [
            {resource: 'cellulose_fiber', count: 5},
        ]
    },
    'wood_pellet': {
        count: 0,
        speed: 0.5,
        time: 4,
        inputs: [
            {resource: 'cellulose_fiber', count: 12},
        ],
        outputs: [
            {resource: 'wood_pellets', count: 2},
        ]
    },
    'burn_pellets': {
        count: 0,
        speed: 1.5,
        time: 2,
        inputs: [
            {resource: 'wood_pellets', count: 1},
        ],
        outputs: [
            {resource: 'carbon_dioxide', count: 70},
        ]
    },
    'slag_slurry': {
        count: 0,
        speed: 1.25,
        time: 3,
        inputs: [
            {resource: 'slag', count: 5},
            {resource: 'sulfuric_acid', count: 12},
        ],
        outputs: [
            {resource: 'slag_slurry', count: 50},
        ]
    },
    'sulfur_dioxide_to_acid': {
        count: 0,
        speed: 1.25,
        time: 2,
        inputs: [
            {resource: 'sulfur_dioxide_gas', count: 60},
            {resource: 'purified_water', count: 40},
        ],
        outputs: [
            {resource: 'sulfuric_acid', count: 50},
        ]
    },
    'sulfur_burning': {
        count: 0,
        speed: 1.25,
        time: 2,
        inputs: [
            {resource: 'sulfur', count: 1},
            {resource: 'oxygen', count: 50},
        ],
        outputs: [
            {resource: 'sulfur_dioxide_gas', count: 50},
        ]
    },
    'water_synthesis': {
        count: 0,
        speed: 1.25,
        time: 2,
        inputs: [
            {resource: 'oxygen', count: 60},
            {resource: 'hydrogen', count: 90},
        ],
        outputs: [
            {resource: 'purified_water', count: 100},
        ]
    },
    'sulfuric_waste_purification': {
        count: 0,
        speed: 1,
        time: 1,
        inputs: [
            {resource: 'sulfuric_waste_water', count: 100},
        ],
        outputs: [
            {resource: 'sulfur', count: 1},
            {resource: 'mineralized_water', count: 20},
            {resource: 'purified_water', count: 70},
        ]
    },
    'slurry_coal_filtering': {
        count: 0,
        speed: 1.5,
        time: 4,
        inputs: [
            {resource: 'coal_filter', count: 1},
            {resource: 'slag_slurry', count: 50},
            {resource: 'purified_water', count: 50},
        ],
        outputs: [
            {resource: 'filter_frame', count: 1},
            {resource: 'mineral_sludge', count: 50},
            {resource: 'sulfuric_waste_water', count: 30},
        ]
    },
    'coal_filter': {
        count: 0,
        speed: 0.5,
        time: 1,
        inputs: [
            {resource: 'coal', count: 1},
            {resource: 'filter_frame', count: 5},
        ],
        outputs: [
            {resource: 'coal_filter', count: 5},
        ]
    },
    'wood_brick_from_pellet': {
        count: 0,
        speed: 0.5,
        time: 2,
        inputs: [
            {resource: 'wood_pellets', count: 8},
        ],
        outputs: [
            {resource: 'wood_bricks', count: 4},
        ]
    },
    'wood_brick_smelting': {
        count: 0,
        speed: 1,
        time: 3.5,
        inputs: [
            {resource: 'wood_bricks', count: 1},
        ],
        outputs: [
            {resource: 'coal', count: 3},
        ]
    },
    'iron_smelting_from_ore': {
        count: 0,
        speed: 1,
        time: 10.5,
        inputs: [
            {resource: 'iron_ore', count: 4},
        ],
        outputs: [
            {resource: 'iron_plate', count: 3},
        ]
    },
    'gear':{
        count: 0,
        speed: 0.5,
        time: 0.5,
        inputs: [
            {resource: 'iron_plate', count: 2},
        ],
        outputs: [
            {resource: 'gear', count: 1},
        ]
    }
}

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