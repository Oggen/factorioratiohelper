import * as React from 'react';
import * as ReactDOM from 'react-dom';


import RecipeSolver  from './solver';
import { SolutionModel }  from './solver';
import { Step, ResourceCount, Resource } from '../datacomponents/index';

describe('Recipe Solver', () => {
    it('Solves a trivial linear non-branching crafting chain', () => {
        // Arrange
        var stepsInput: Step[] = [
            {
                count: 0,
                speed: 1,
                time: 1,
                inputs: [
                    {
                        resource: 'iron_ore',
                        count: 1
                    }
                ],
                outputs: [
                    {
                        resource: 'iron_plate',
                        count: 1
                    }
                ]
            },
            {
                count: 0,
                speed: 1,
                time: 1,
                inputs: [
                    {
                        resource: 'iron_plate',
                        count: 2
                    }
                ],
                outputs: [
                    {
                        resource: 'gear',
                        count: 1
                    }
                ]
            },
        ];
        var outputs: ResourceCount[] = [
            {resource: 'gear', count: 1}
        ];
        var inputs: ResourceCount[] = [
            {resource: 'iron_ore', count: 1}
        ];
        var solver = new RecipeSolver(stepsInput, outputs, inputs);
        
        var expectedOutput: SolutionModel = {
            stepMultipliers: [2, 1],
            realInputs: [{resource: 'iron_ore', count: 2}],
            extraOutputs: [],
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