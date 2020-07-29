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
 * Helpers
 */
const generateDefaultColumns = (columns, gap1 = 2.5, gap2 = 2.1) => {
    const total1 = 100 - (gap1 * columns.length - 1);
    const total2 = 100 - (gap2 * columns.length - 1);

    const response = [];

    columns.map((column, i) => {
        response.push([
            'maxi-blocks/column-maxi',
            {
                uniqueID: 'maxi-column-maxi-1',
                columnSize: JSON.stringify(
                    {
                        label: "Column size",
                        general: {
                            "fullwidth": false,
                            "size": total1 * column,
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
                            "size": total2 * column
                        },
                        s: {
                            "fullwidth": false,
                            "size": 100
                        },
                        xs: {
                            "fullwidth": false,
                            "size": 100
                        },
                    }
                ),
                margin: JSON.stringify(
                    {
                        "label": "Margin",
                        "general": {
                            "margin-top": "",
                            "margin-right": "",
                            "margin-bottom": "",
                            "margin-left": "",
                            "sync": true,
                            "unit": "px"
                        },
                        "xxl": {
                            "margin-top": "",
                            "margin-right": "",
                            "margin-bottom": "",
                            "margin-left": "",
                            "sync": true,
                            "unit": ""
                        },
                        "xl": {
                            "margin-top": "",
                            "margin-right": "",
                            "margin-bottom": "",
                            "margin-left": "",
                            "sync": true,
                            "unit": ""
                        },
                        "l": {
                            "margin-top": "",
                            "margin-right": "",
                            "margin-bottom": "",
                            "margin-left": "",
                            "sync": true,
                            "unit": ""
                        },
                        "m": {
                            "margin-top": "",
                            "margin-right": "",
                            "margin-bottom": "",
                            "margin-left": "",
                            "sync": true,
                            "unit": ""
                        },
                        "s": {
                            "margin-top": i != 0 ? .5 : "",
                            "margin-right": "",
                            "margin-bottom": i != columns.length - 1 ? .5 : "",
                            "margin-left": "",
                            "sync": true,
                            "unit": 'em'
                        },
                        "xs": {
                            "margin-top": "",
                            "margin-right": "",
                            "margin-bottom": "",
                            "margin-left": "",
                            "sync": true,
                            "unit": ""
                        }
                    }
                )
            }
        ])
    })

    return response;
}

/**
 * Templates
 */
const TEMPLATES = [
    {
        name: '1',
        icon: oneColumn,
        content: generateDefaultColumns([1]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-1',
        icon: twoColumns,
        content: generateDefaultColumns([1 / 2, 1 / 2]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-3',
        icon: oneThree,
        content: generateDefaultColumns([1 / 4, 3 / 4]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3-1',
        icon: threeOne,
        content: generateDefaultColumns([3 / 4, 1 / 4]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-4',
        icon: oneFour,
        content: generateDefaultColumns([1 / 5, 4 / 5]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '4-1',
        icon: fourOne,
        content: generateDefaultColumns([4 / 5, 1 / 5]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3 columns',
        icon: threeColumns,
        content: generateDefaultColumns([1 / 3, 1 / 3, 1 / 3]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-1-3',
        icon: oneOneThree,
        content: generateDefaultColumns([1 / 5, 1 / 5, 3 / 5]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-1-4',
        icon: oneOneFour,
        content: generateDefaultColumns([1 / 6, 1 / 6, 4 / 6]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '1-4-1',
        icon: oneFourOne,
        content: generateDefaultColumns([1 / 6, 4 / 6, 1 / 6]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3-1-1',
        icon: threeOneOne,
        content: generateDefaultColumns([3 / 5, 1 / 5, 1 / 5]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '4-1-1',
        icon: fourOneOne,
        content: generateDefaultColumns([4 / 6, 1 / 6, 1 / 6]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '4 columns',
        icon: fourColumns,
        content: generateDefaultColumns([1 / 4, 1 / 4, 1 / 4, 1 / 4]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '5 columns',
        icon: fiveColumns,
        content: generateDefaultColumns([1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '6 columns',
        icon: sixColumns,
        content: generateDefaultColumns([1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]),
        attributes: {
            horizontalAlign: 'space-between',
            verticalAlign: 'stretch'
        }
    },
]

export default TEMPLATES;