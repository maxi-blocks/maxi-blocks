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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 47.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 47.5,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 23.7
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 71.3
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 71.3,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 23.7,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 19
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 76
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 76,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 19,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 30,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 30,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 30,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 22.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 22.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 45
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 60
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 60
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 15
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 45,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 22.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 22.5,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 60,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 15,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 15,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 21.3,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 21.3,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 21.3,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 21.3,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 16,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 16,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 16,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 16,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 16,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
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
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 12.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 12.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 12.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 12.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 12.5,
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    uniqueID: 'gx-block-column-extra-1',
                    columnSize: 12.5,
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncSize: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
]

export default TEMPLATES;