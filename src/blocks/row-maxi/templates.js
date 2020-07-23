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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": true,
                                "size": 100
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    ),
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 47.5
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 47.5
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 23.7
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 71.3
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 71.3,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 23.7,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 19
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 76
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 76,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 19,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 30,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 30,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 30,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 22.5
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 22.5
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 45
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 15
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 15
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 60
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 15
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 60
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 15
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 45,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 22.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 22.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 60,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 15,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 15,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 21.3,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 21.3,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 21.3,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 21.3,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 16,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 16,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 16,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 16,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 16,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
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
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 12.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 12.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 12.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 12.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 12.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
            [
                'maxi-blocks/column-maxi',
                {
                    uniqueID: 'maxi-column-maxi-1',
                    columnSize: JSON.stringify(
                        {
                            label: "Column size",
                            general: {
                                "fullwidth": false,
                                "size": 12.5,
                            },
                            xxl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xl: {
                                "fullwidth": false,
                                "size": ""
                            },
                            l: {
                                "fullwidth": false,
                                "size": ""
                            },
                            m: {
                                "fullwidth": false,
                                "size": ""
                            },
                            s: {
                                "fullwidth": false,
                                "size": ""
                            },
                            xs: {
                                "fullwidth": false,
                                "size": ""
                            },
                        }
                    )
                }
            ],
        ],
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
]

export default TEMPLATES;