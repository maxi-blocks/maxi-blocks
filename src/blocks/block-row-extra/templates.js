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
                    sizeDesktop: 100
                }
            ],
        ],
        attributes: {
            columnGap: 0,
            syncColumns: true,
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
                    sizeDesktop: 47.5,
                    sizeTablet: 47.5,
                    sizeMobile: 47.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 47.5,
                    sizeTablet: 47.5,
                    sizeMobile: 47.5
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 23.7
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 71.3
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 71.3,
                    sizeTablet: 71.3,
                    sizeMobile: 71.3
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 23.7,
                    sizeTablet: 23.7,
                    sizeMobile: 23.7
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 19
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 76
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 76,
                    sizeTablet: 76,
                    sizeMobile: 76
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 19,
                    sizeTablet: 19,
                    sizeMobile: 19
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 30,
                    sizeTablet: 30,
                    sizeMobile: 30
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 30,
                    sizeTablet: 30,
                    sizeMobile: 30
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 30,
                    sizeTablet: 30,
                    sizeMobile: 30
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 22.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 22.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 45
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 60
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 60
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 15
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 45,
                    sizeTablet: 45,
                    sizeMobile: 45
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 22.5,
                    sizeTablet: 22.5,
                    sizeMobile: 22.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 22.5,
                    sizeTablet: 22.5,
                    sizeMobile: 22.5
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 60,
                    sizeTablet: 60,
                    sizeMobile: 60
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 15,
                    sizeTablet: 15,
                    sizeMobile: 15
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 15,
                    sizeTablet: 15,
                    sizeMobile: 15
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 21.3,
                    sizeTablet: 21.3,
                    sizeMobile: 21.3
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 21.3,
                    sizeTablet: 21.3,
                    sizeMobile: 21.3
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 21.3,
                    sizeTablet: 21.3,
                    sizeMobile: 21.3
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 21.3,
                    sizeTablet: 21.3,
                    sizeMobile: 21.3
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 16,
                    sizeTablet: 16,
                    sizeMobile: 16
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 16,
                    sizeTablet: 16,
                    sizeMobile: 16
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 16,
                    sizeTablet: 16,
                    sizeMobile: 16
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 16,
                    sizeTablet: 16,
                    sizeMobile: 16
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 16,
                    sizeTablet: 16,
                    sizeMobile: 16
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
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
                    sizeDesktop: 12.5,
                    sizeTablet: 12.5,
                    sizeMobile: 12.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 12.5,
                    sizeTablet: 12.5,
                    sizeMobile: 12.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 12.5,
                    sizeTablet: 12.5,
                    sizeMobile: 12.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 12.5,
                    sizeTablet: 12.5,
                    sizeMobile: 12.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 12.5,
                    sizeTablet: 12.5,
                    sizeMobile: 12.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 12.5,
                    sizeTablet: 12.5,
                    sizeMobile: 12.5
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
]

export default TEMPLATES;