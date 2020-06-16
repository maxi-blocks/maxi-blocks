/**
 * Icons
 */
import {
    oneColumn,
    oneOneThree,
    oneOneFour,
    oneThree,
    oneFour,
    oneFourOne,
    twoColumns,
    threeColumns,
    threeOne,
    threeOneOne,
    fourColumns,
    fourOne,
    fourOneOne,
    fiveColumns,
    sixColumns,
} from '../../icons';

/**
 * Templates
 */
const TEMPLATES = [
    {
        name: 'Full size column',
        icon: oneColumn,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 100,
                }
            ],
        ],
        attributes: {
            columnGap: 0,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '2 half columns',
        icon: twoColumns,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 47.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 47.5,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-3',
        icon: oneThree,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 23.7
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 71.3
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3-1',
        icon: threeOne,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 71.3,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 23.7,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-4',
        icon: oneFour,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 19
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 76
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '4-1',
        icon: fourOne,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 76,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 19,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3 columns',
        icon: threeColumns,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 30,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 30,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 30,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-1-3',
        icon: oneOneThree,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 22.5
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 22.5
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 45
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-1-4',
        icon: oneOneFour,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 15
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 15
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 60
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-4-1',
        icon: oneFourOne,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 15
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 60
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 15
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3-1-1',
        icon: threeOneOne,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 45,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 22.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 22.5,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '4-1-1',
        icon: fourOneOne,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 60,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 15,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 15,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: false,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '4 columns',
        icon: fourColumns,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 21.3,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 21.3,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 21.3,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 21.3,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '5 columns',
        icon: fiveColumns,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 16,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 16,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 16,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 16,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 16,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '6 columns',
        icon: sixColumns,
        content: [
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 12.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 12.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 12.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 12.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 12.5,
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: 12.5,
                }
            ],
        ],
        attributes: {
            columnGap: 2.1,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
]

export default TEMPLATES;