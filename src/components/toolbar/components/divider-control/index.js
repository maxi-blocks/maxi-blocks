/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Fragment,
    useState,
    useEffect
} = wp.element;
const {
    RangeControl,
    Icon,
    IconButton,
} = wp.components;
const { useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import { DefaultStylesControl } from '../../../../components';
import {
    dividerSolidHorizontal,
    dividerDottedHorizontal,
    dividerDashedHorizontal,
    dividerSolidVertical,
    dividerDottedVertical,
    dividerDashedVertical,
    dividerNone,
} from './defaults';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import {
    styleNone,
    dashed,
    dotted,
    solid,
    toolbarAdvancedSettings,
} from '../../../../icons';

/**
 * Component
 */
const DividerControl = props => {
    const {
        dividerOptions,
        onChange,
        lineOrientation
    } = props;

    const [orientation, changeOrientation] = useState(
        lineOrientation
    )

    const [value, changeValue] = useState(
        typeof dividerOptions != 'object' ?
            JSON.parse(dividerOptions) :
            dividerOptions
    )

    const { openGeneralSidebar } = useDispatch(
        'core/edit-post'
    );

    const onEditImageClick = item => {
        const sidebar = document.querySelector('.maxi-sidebar');
        const wrapperElement = document.querySelector(`.maxi-accordion-control__item[data-name="${item}"]`);
        const button = wrapperElement.querySelector('.maxi-accordion-control__item__button');
        const content = wrapperElement.querySelector('.maxi-accordion-control__item__panel');

        Array.from(document.getElementsByClassName('maxi-accordion-control__item__button')).map(el => {
            if (el.getAttribute('aria-expanded'))
                el.setAttribute('aria-expanded', false)
        })
        Array.from(document.getElementsByClassName('maxi-accordion-control__item__panel')).map(el => {
            if (!el.getAttribute('hidden'))
                el.setAttribute('hidden', '')
        })

        button.setAttribute('aria-expanded', true)
        content.removeAttribute('hidden');

        sidebar.scroll({
            top: wrapperElement.getBoundingClientRect().top,
            behavior: 'smooth'
        })
    }

    useEffect(
        () => {
            if (lineOrientation != orientation) {
                changeOrientation(lineOrientation);
                console.log(!isNil(value.general['border-top-width']))
                if (lineOrientation === 'vertical') {
                    if (!isNil(value.general.width)) {
                        value.general.height = value.general.width;
                        value.general.width = '';
                    }
                    if (!isNil(value.general['border-top-width'])) {
                        value.general['border-right-width'] = value.general['border-top-width'];
                        value.general['border-top-width'] = '';
                    }
                }
                else {
                    if (!isNil(value.general.height)) {
                        value.general.width = value.general.height;
                        value.general.height = '';
                    }
                    if (!isNil(value.general['border-top-width'])) {
                        value.general['border-top-width'] = value.general['border-right-width'];
                        value.general['border-right-width'] = '';
                    }
                }

                changeValue(value);
                onChange(JSON.stringify(value));
            }
        },
        [lineOrientation, orientation, value, onChange]
    );

    return (
        <Fragment>
            <div className='toolbar-item__popover__dropdown-options'>
                <IconButton
                    className='toolbar-item__popover__dropdown-options__advanced-button'
                    icon={toolbarAdvancedSettings}
                    onClick={() =>
                        openGeneralSidebar('edit-post/block')
                            .then(() => onEditImageClick('line'))
                    }
                />
            </div>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: ( value.general['border-name'] === 'none' ),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => {
                            onChange(JSON.stringify(dividerNone));
                            changeValue(dividerNone);
                        }
                    },
                    {
                        activeItem: ( value.general['border-name'] === 'solid' ),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={solid}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal') {
                                onChange(JSON.stringify(dividerSolidHorizontal));
                                changeValue(dividerSolidHorizontal);
                            }
                            else {
                                onChange(JSON.stringify(dividerSolidVertical));
                                changeValue(dividerSolidVertical);
                            }
                        }
                    },
                    {
                        activeItem: ( value.general['border-name'] === 'dashed' ),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dashed}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal') {
                                onChange(JSON.stringify(dividerDashedHorizontal));
                                changeValue(dividerDashedHorizontal);
                            }
                            else {
                                onChange(JSON.stringify(dividerDashedVertical));
                                changeValue(dividerDashedVertical);
                            }
                        }
                    },
                    {
                        activeItem: ( value.general['border-name'] === 'dotted' ),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dotted}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal') {
                                onChange(JSON.stringify(dividerDottedHorizontal));
                                changeValue(dividerDottedHorizontal);
                            }
                            else {
                                onChange(JSON.stringify(dividerDottedVertical));
                                changeValue(dividerDottedVertical);
                            }
                        }
                    },
                ]}
            />
            {
                orientation === 'horizontal' &&
                <Fragment>
                    <RangeControl
                        label={__('Size', 'maxi-blocks')}
                        value={Number(value.general.width)}
                        onChange={val => {
                            if (!!val)
                                value.general.width = Number(val);
                            else
                                value.general.width = '';
                            onChange(JSON.stringify(value));
                        }}
                        allowReset
                    />
                    <RangeControl
                        label={__('Weight', 'maxi-blocks')}
                        value={Number(value.general['border-top-width'])}
                        onChange={val => {
                            if (!!val)
                                value.general['border-top-width'] = Number(val);
                            else
                                value.general['border-top-width'] = '';
                            onChange(JSON.stringify(value));
                        }}
                        allowReset
                    />
                </Fragment>
            }
            {
                orientation === 'vertical' &&
                <Fragment>
                    <RangeControl
                        label={__('Size', 'maxi-blocks')}
                        value={Number(value.general.height)}
                        onChange={val => {
                            if (!!val)
                                value.general.height = Number(val);
                            else
                                value.general.height = '';
                            onChange(JSON.stringify(value));
                        }}
                        max={999}
                        allowReset
                    />
                    <RangeControl
                        label={__('Weight', 'maxi-blocks')}
                        value={Number(value.general['border-right-width'])}
                        onChange={val => {
                            if (!!val)
                                value.general['border-right-width'] = Number(val);
                            else
                                value.general['border-right-width'] = '';
                            onChange(JSON.stringify(value));
                        }}
                        max={999}
                        allowReset
                    />
                </Fragment>
            }
            <RangeControl
                label={__("Opacity", "maxi-blocks")}
                className={"maxi-opacity-control"}
                value={value.general.opacity * 100}
                onChange={val => {
                    if (!!val)
                        value.general.opacity = Number(val) / 100;
                    else
                        value.general.opacity = '';
                    onChange(JSON.stringify(value))
                }}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
        </Fragment>
    )
}

export default DividerControl;