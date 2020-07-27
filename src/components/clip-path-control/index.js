/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    useState,
    Fragment
} = wp.element;
const {
    SelectControl,
    BaseControl,
    Button,
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isArray,
    isEmpty,
    isNil,
    trim
} from 'lodash';

/**
 * Component
 */
const ClipPathOption = props => {
    const {
        values,
        onChange,
        number
    } = props;

    const optionColors = [
        'red',
        'blue',
        'pink',
        'green',
        'yellow'
    ];

    return (
        <BaseControl
            label={`${__('Point', 'maxi-blocks')} ${number + 1}`}
            className='maxi-clip-path-control__item'
        >
            <div
                className='maxi-clip-path-control__item__options'
            >
                <input
                    type='number'
                    value={trim(Number(values[0]))}
                    onChange={e => {
                        values[0] = Number(e.target.value);
                        onChange(values)
                    }}
                    min={0}
                    max={100}
                />
                {
                    !isNil(values[1]) &&
                    <input
                        type='number'
                        value={trim(Number(values[1]))}
                        onChange={e => {
                            values[1] = Number(e.target.value);
                            onChange(values)
                        }}
                        min={0}
                        max={100}
                    />
                }
                <span
                    className='maxi-clip-path-control__item__options__handle-color'
                    style={{
                        backgroundColor: optionColors[number]
                    }}
                />
            </div>
        </BaseControl>
    )
}

const ClipPathControl = props => {
    const {
        clipPath,
        className,
        onChange,
    } = props;

    const defaultCP = {
        triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        trapezoid: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
        circle: 'circle(50% at 50% 50%)',
        frame: 'polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)'
    };

    const [hasClipPath, changeHasClipPath] = useState(
        isEmpty(clipPath) ? 0 : 1
    )

    const [selectedCP, changeSelectedCP] = useState(() => {
        if (Object.values(defaultCP).includes(clipPath))
            return clipPath;
        else if (!isEmpty(clipPath))
            return 'custom';
        else
            return ''
    })

    const deconstructCP = () => {
        if (isEmpty(clipPath))
            return {
                type: 'polygon',
                content: []
            };

        const cpType = clipPath.match(/^[^\(]+/gi)[0];
        let cpValues = [];
        let cpContent = [];

        switch (cpType) {
            case 'polygon':
                cpContent = clipPath
                    .replace(cpType, '')
                    .replace('(', '')
                    .replace(')', '');

                cpContent.split(', ').map(value => {
                    const newItem = value.replace(/%/g, '').split(' ');
                    newItem.map((item, i) => {
                        newItem[i] = Number(item)
                    })
                    cpValues.push(newItem);
                });
                break;
            case 'circle':
            case 'ellipse':
            case 'inset':
                cpContent = clipPath
                    .replace(cpType, '')
                    .replace('(', '')
                    .replace(')', '')
                    .replace('at ', '');

                cpContent.split(' ').map(value => {
                    cpValues.push([Number(value.replace(/%/g, ''))])
                });
                break;
        }

        return {
            type: cpType,
            content: cpValues
        }
    }

    const generateCP = (type = cp.type) => {
        let newContent = '';

        switch (type) {
            case 'polygon':
                newContent = cp.content.reduce((a, b) => {
                    if (isArray(a))
                        return `${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%`;
                    else
                        return `${a}, ${b[0]}% ${b[1]}%`
                })
                break;
            case 'circle':
                newContent = `${cp.content[0]}% at ${cp.content[1]}% ${cp.content[2]}%`;
                break;
            case 'ellipse':
                newContent = `${cp.content[0]}% ${cp.content[1]}% at ${cp.content[2]}% ${cp.content[3]}%`;
                break;
            case 'inset':
                newContent = `${cp.content[0]}% ${cp.content[1]}% ${cp.content[2]}% ${cp.content[3]}%`;
                break;
        }
        const newCP = `${cp.type}(${newContent})`;

        onChange(newCP)
    }

    const onChangeType = newType => {
        switch (newType) {
            case 'polygon':
                cp.content = [
                    [0, 0],
                    [100, 0],
                    [100, 100],
                    [0, 100]
                ]
                generateCP(newType);
                break;
            case 'circle':
                cp.content = [
                    [50],
                    [50],
                    [50]
                ]
                generateCP(newType);
                break;
            case 'ellipse':
                cp.content = [
                    [50],
                    [50],
                    [50],
                    [50]
                ]
                generateCP(newType);
                break;
            case 'inset':
                cp.content = [
                    [15],
                    [5],
                    [15],
                    [5]
                ]
                generateCP(newType);
                break;
        }
    }

    const cp = deconstructCP();

    const classes = classnames(
        'maxi-clip-path-control',
        className
    )

    return (
        <div
            className={classes}
        >
            <SelectControl
                label={__('Use Clip-path', 'maxi-blocks')}
                value={hasClipPath}
                options={[
                    { label: __('Yes', 'maxi-blocks'), value: 1 },
                    { label: __('No', 'maxi-blocks'), value: 0 },
                ]}
                onChange={value => changeHasClipPath(Number(value))}
            />
            {
                !!hasClipPath &&
                <Fragment>
                    <SelectControl
                        label={__('Clip path', 'maxi-blocks')}
                        value={selectedCP}
                        options={
                            [
                                { label: __('None', 'maxi-blocks'), value: '' },
                                { label: __('Triangle', 'maxi-blocks'), value: defaultCP.triangle },
                                { label: __('Trapezoid', 'maxi-blocks'), value: defaultCP.trapezoid },
                                { label: __('Circle', 'maxi-blocks'), value: defaultCP.circle },
                                { label: __('Frame', 'maxi-blocks'), value: defaultCP.frame },
                                { label: __('Custom', 'maxi-blocks'), value: 'custom' }
                            ]
                        }
                        onChange={value => {
                            changeSelectedCP(value);
                            if (value != 'custom')
                                onChange(value)
                        }}
                    />
                    {
                        selectedCP === 'custom' &&
                        <div
                            className='maxi-clip-path-control__handles'
                        >
                            <SelectControl
                                label={__('Type', 'maxi-blocks')}
                                value={cp.type}
                                options={[
                                    { label: __('Polygon', 'maxi-blocks'), value: 'polygon' },
                                    { label: __('Circle', 'maxi-blocks'), value: 'circle' },
                                    { label: __('Ellipse', 'maxi-blocks'), value: 'ellipse' },
                                    { label: __('Inset', 'maxi-blocks'), value: 'inset' },
                                ]}
                                onChange={value => {
                                    cp.type = value;
                                    onChangeType(value);
                                    generateCP();
                                }}
                            />
                            {
                                cp.content.map((handle, i) => (
                                    <ClipPathOption
                                        key={`maxi-clip-path-control-${i}`}
                                        values={handle}
                                        onChange={value => {
                                            cp.content[i] = value;
                                            generateCP();
                                        }}
                                        number={i}
                                    />
                                )
                                )
                            }
                            {
                                cp.type === 'polygon' &&
                                cp.content.length < 10 &&
                                <Button
                                    className='maxi-clip-path-control__handles'
                                    onClick={() => {
                                        cp.content.push([0, 0]);
                                        generateCP();
                                    }}
                                >
                                    Add new point
                                        </Button>
                            }
                        </div>
                    }
                </Fragment>
            }
        </div>
    )
}

export default ClipPathControl;