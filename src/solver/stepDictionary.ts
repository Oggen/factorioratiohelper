import { Step } from '../datacomponents/index';

export const recipeDictionary: {[name: string]: Step} = {
    'electrolysis': {
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
        time: 1 / 1.5,
        inputs: [
            {resource: 'slag', count: 1},
        ],
        outputs: [
            {resource: 'crushed_stone', count: 2},
        ]
    },
    'mineralize_water': {
        time: 1 / 1.5,
        inputs: [
            {resource: 'crushed_stone', count: 10},
            {resource: 'water', count: 100},
        ],
        outputs: [
            {resource: 'mineralized_water', count: 100},
        ]
    },
    'green_algea_growth': {
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
        time: 3 / 1.5,
        inputs: [
            {resource: 'green_algea', count: 10},
        ],
        outputs: [
            {resource: 'cellulose_fiber', count: 5},
        ]
    },
    'wood_pellet': {
        time: 8,
        inputs: [
            {resource: 'cellulose_fiber', count: 12},
        ],
        outputs: [
            {resource: 'wood_pellets', count: 2},
        ]
    },
    'burn_pellets': {
        time: 2 / 1.5,
        inputs: [
            {resource: 'wood_pellets', count: 1},
        ],
        outputs: [
            {resource: 'carbon_dioxide', count: 70},
        ]
    },
    'slag_slurry': {
        time: 3 / 1.25,
        inputs: [
            {resource: 'slag', count: 5},
            {resource: 'sulfuric_acid', count: 12},
        ],
        outputs: [
            {resource: 'slag_slurry', count: 50},
        ]
    },
    'sulfur_dioxide_to_acid': {
        time: 2 / 1.25,
        inputs: [
            {resource: 'sulfur_dioxide_gas', count: 60},
            {resource: 'purified_water', count: 40},
        ],
        outputs: [
            {resource: 'sulfuric_acid', count: 50},
        ]
    },
    'sulfur_burning': {
        time: 2 / 1.25,
        inputs: [
            {resource: 'sulfur', count: 1},
            {resource: 'oxygen', count: 50},
        ],
        outputs: [
            {resource: 'sulfur_dioxide_gas', count: 50},
        ]
    },
    'water_synthesis': {
        time: 2 / 1.25,
        inputs: [
            {resource: 'oxygen', count: 60},
            {resource: 'hydrogen', count: 90},
        ],
        outputs: [
            {resource: 'purified_water', count: 100},
        ]
    },
    'sulfuric_waste_purification': {
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
        time: 4 / 1.5,
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
        time: 2,
        inputs: [
            {resource: 'coal', count: 1},
            {resource: 'filter_frame', count: 5},
        ],
        outputs: [
            {resource: 'coal_filter', count: 5},
        ]
    },
    'wood_brick_from_pellet': {
        time: 4,
        inputs: [
            {resource: 'wood_pellets', count: 8},
        ],
        outputs: [
            {resource: 'wood_bricks', count: 4},
        ]
    },
    'wood_brick_smelting': {
        time: 3.5,
        inputs: [
            {resource: 'wood_bricks', count: 1},
        ],
        outputs: [
            {resource: 'coal', count: 3},
        ]
    },
    'iron_smelting_from_ore': {
        time: 10.5,
        inputs: [
            {resource: 'iron_ore', count: 4},
        ],
        outputs: [
            {resource: 'iron_plate', count: 3},
        ]
    },
    'gear': {
        time: 1,
        inputs: [
            {resource: 'iron_plate', count: 2},
        ],
        outputs: [
            {resource: 'gear', count: 1},
        ]
    }
};