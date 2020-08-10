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
 * Internal dependencies
 */
import { polygonDefaults } from './defaults';
import DefaultStylesControl from '../default-styles-control';
import SettingTabsControl from '../setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isArray,
    isEmpty,
    trim
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ClipPathOption = props => {
    const {
        values,
        onChange,
        number,
        isDouble = false
    } = props;

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
                    isDouble &&
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

    const [hasClipPath, changeHasClipPath] = useState(
        isEmpty(clipPath) ? 0 : 1
    )

    const [customPolygon, changeCustomPolygon] = useState(
        !isEmpty(clipPath) &&
            clipPath.indexOf('polygon') >= 0 &&
            !Object.values(polygonDefaults).includes(clipPath) ?
            1 : 0
    )

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

        if (isEmpty(cp.content)) {
            onChange('');
            return;
        }

        switch (type) {
            case 'polygon':
                newContent = cp.content.reduce((a, b) => {
                    if (isArray(a))
                        return `${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%`;
                    else
                        return `${a}, ${b[0]}% ${b[1]}%`
                });
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

        onChange(newCP);
    }

    const onChangeType = newType => {
        if (newType.toLowerCase() != cp.type)
            switch (newType.toLowerCase()) {
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

        cp.type = newType.toLowerCase();

        return;
    }

    const getPolygonDefaults = () => {
        const polygonsArray = Object.values(polygonDefaults);
        const response = [];

        polygonsArray.map(polygon => {
            response.push(
                {
                    activeItem: polygon === clipPath,
                    content: (
                        <span
                            className='maxi-clip-path-control__defaults__item'
                            style={{
                                clipPath: polygon,
                            }}
                        />
                    ),
                    onChange: () => onChange(polygon)
                }
            )
        })

        return response;
    }

    const getSelectedTab = () => {
        switch (cp.type) {
            case 'polygon':
                return 0;
            case 'circle':
                return 1;
            case 'ellipse':
                return 2;
            case 'ellipse':
                return 3;
            default:
                return 0;
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
                onChange={value => {
                    if (!value)
                        onChange('')

                    changeHasClipPath(Number(value))
                }}
            />
            {
                !!hasClipPath &&
                <SettingTabsControl
                    selectedTab={getSelectedTab()}
                    onChange={type => {
                        onChangeType(type);
                        generateCP();
                    }}
                    items={[
                        {
                            label: __('Polygon', 'maxi-blocks'),
                            content: (
                                <Fragment>
                                    <SelectControl
                                        label={__('Use custom polygon', 'maxi-blocks')}
                                        value={customPolygon}
                                        options={[
                                            { label: __('Yes', 'maxi-blocks'), value: 1 },
                                            { label: __('No', 'maxi-blocks'), value: 0 },
                                        ]}
                                        onChange={value => changeCustomPolygon(Number(value))}
                                    />
                                    {
                                        !customPolygon &&
                                        <DefaultStylesControl
                                            className='maxi-clip-path-control__defaults'
                                            items={getPolygonDefaults()}
                                        />
                                    }
                                    {
                                        !!customPolygon &&
                                        <Fragment>
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
                                                        isDouble
                                                    />
                                                ))
                                            }
                                            {
                                                cp.content.length < 10 &&
                                                <Button
                                                    className='maxi-clip-path-control__handles'
                                                    onClick={() => {
                                                        cp.content.push([0, 0]);
                                                        generateCP();
                                                    }}
                                                >
                                                    {__('Add new point', 'maxi-blocks')}
                                                </Button>
                                            }
                                        </Fragment>
                                    }
                                </Fragment>
                            )
                        },
                        {
                            label: __('Circle', 'maxi-blocks'),
                            content: (
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
                                ))
                            )
                        },
                        {
                            label: __('Ellipse', 'maxi-blocks'),
                            content: (
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
                                ))
                            )
                        },
                        {
                            label: __('Inset', 'maxi-blocks'),
                            content: (
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
                                ))
                            )
                        }
                    ]}
                />
            }
        </div>
    )
}

export default ClipPathControl;