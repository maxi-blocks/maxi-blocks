/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { RangeControl, SelectControl, TextareaControl } = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    SettingTabsControl,
    __experimentalResponsiveSelector,
    __experimentalZIndexControl,
    __experimentalAxisControl,
    __experimentalResponsiveControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
} from '../../components';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            size,
            fullWidth,
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
            width,
            background,
            opacity,
            boxShadow,
            border,
            padding,
            margin,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
            extraClassName,
            extraStyles,
            zIndex,
            breakpoints,
            position,
            display,
        },
        clientId,
        setAttributes,
        deviceType,
    } = props;

    return (
        <InspectorControls>
            <__experimentalResponsiveSelector />
            <SettingTabsControl
                disablePadding
                items={[
                    {
                        label: __('Style', 'maxi-blocks'),
                        content: (
                            <Fragment>
                                <div className='maxi-tab-content__box'>
                                    <BlockStylesControl
                                        blockStyle={blockStyle}
                                        onChangeBlockStyle={blockStyle =>
                                            setAttributes({ blockStyle })
                                        }
                                        defaultBlockStyle={defaultBlockStyle}
                                        onChangeDefaultBlockStyle={defaultBlockStyle =>
                                            setAttributes({ defaultBlockStyle })
                                        }
                                        isFirstOnHierarchy={isFirstOnHierarchy}
                                    />
                                </div>
                                <AccordionControl
                                    isSecondary
                                    items={[
                                        {
                                            label: __(
                                                'Alignment',
                                                'maxi-blocks'
                                            ),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __(
                                                                'Desktop',
                                                                'maxi-blocks'
                                                            ),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={
                                                                        alignmentDesktop
                                                                    }
                                                                    onChange={alignmentDesktop =>
                                                                        setAttributes(
                                                                            {
                                                                                alignmentDesktop,
                                                                            }
                                                                        )
                                                                    }
                                                                    disableJustify
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: __(
                                                                'Tablet',
                                                                'maxi-blocks'
                                                            ),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={
                                                                        alignmentTablet
                                                                    }
                                                                    onChange={alignmentTablet =>
                                                                        setAttributes(
                                                                            {
                                                                                alignmentTablet,
                                                                            }
                                                                        )
                                                                    }
                                                                    disableJustify
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: __(
                                                                'Mobile',
                                                                'maxi-blocks'
                                                            ),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={
                                                                        alignmentMobile
                                                                    }
                                                                    onChange={alignmentMobile =>
                                                                        setAttributes(
                                                                            {
                                                                                alignmentMobile,
                                                                            }
                                                                        )
                                                                    }
                                                                    disableJustify
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            ),
                                        },
                                        {
                                            label: __(
                                                'Background',
                                                'maxi-blocks'
                                            ),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __(
                                                                'Normal',
                                                                'gutenberg-extra'
                                                            ),
                                                            content: (
                                                                <Fragment>
                                                                    <__experimentalOpacityControl
                                                                        opacity={
                                                                            opacity
                                                                        }
                                                                        defaultOpacity={getDefaultProp(
                                                                            clientId,
                                                                            'opacity'
                                                                        )}
                                                                        onChange={opacity =>
                                                                            setAttributes(
                                                                                {
                                                                                    opacity,
                                                                                }
                                                                            )
                                                                        }
                                                                        breakpoint={
                                                                            deviceType
                                                                        }
                                                                    />
                                                                    <BackgroundControl
                                                                        background={
                                                                            background
                                                                        }
                                                                        onChange={background =>
                                                                            setAttributes(
                                                                                {
                                                                                    background,
                                                                                }
                                                                            )
                                                                        }
                                                                        disableImage
                                                                        disableVideo
                                                                    />
                                                                </Fragment>
                                                            ),
                                                        },
                                                        {
                                                            label: __(
                                                                'Hover',
                                                                'gutenberg-extra'
                                                            ),
                                                            content: (
                                                                <Fragment>
                                                                    <__experimentalOpacityControl
                                                                        opacity={
                                                                            opacityHover
                                                                        }
                                                                        defaultOpacity={getDefaultProp(
                                                                            clientId,
                                                                            'opacityHover'
                                                                        )}
                                                                        onChange={opacityHover =>
                                                                            setAttributes(
                                                                                {
                                                                                    opacityHover,
                                                                                }
                                                                            )
                                                                        }
                                                                        breakpoint={
                                                                            deviceType
                                                                        }
                                                                        disableAuto
                                                                    />
                                                                    <BackgroundControl
                                                                        background={
                                                                            backgroundHover
                                                                        }
                                                                        onChange={backgroundHover =>
                                                                            setAttributes(
                                                                                {
                                                                                    backgroundHover,
                                                                                }
                                                                            )
                                                                        }
                                                                        disableImage
                                                                        disableVideo
                                                                    />
                                                                </Fragment>
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            ),
                                        },
                                        {
                                            label: __('Border', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __(
                                                                'Normal',
                                                                'gutenberg-extra'
                                                            ),
                                                            content: (
                                                                <BorderControl
                                                                    border={
                                                                        border
                                                                    }
                                                                    onChange={border =>
                                                                        setAttributes(
                                                                            {
                                                                                border,
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: __(
                                                                'Hover',
                                                                'gutenberg-extra'
                                                            ),
                                                            content: (
                                                                <BorderControl
                                                                    border={
                                                                        borderHover
                                                                    }
                                                                    onChange={borderHover =>
                                                                        setAttributes(
                                                                            {
                                                                                borderHover,
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            ),
                                        },
                                        {
                                            label: __(
                                                'Box Shadow',
                                                'maxi-blocks'
                                            ),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __(
                                                                'Normal',
                                                                'gutenberg-extra'
                                                            ),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadowOptions={
                                                                        boxShadow
                                                                    }
                                                                    onChange={boxShadow =>
                                                                        setAttributes(
                                                                            {
                                                                                boxShadow,
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: __(
                                                                'Hover',
                                                                'gutenberg-extra'
                                                            ),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadowOptions={
                                                                        boxShadowHover
                                                                    }
                                                                    onChange={boxShadowHover =>
                                                                        setAttributes(
                                                                            {
                                                                                boxShadowHover,
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </Fragment>
                        ),
                    },
                    {
                        label: __('Advanced', 'maxi-blocks'),
                        content: (
                            <div className='maxi-tab-content__box'>
                                <__experimentalZIndexControl
                                    zIndex={zIndex}
                                    onChange={zIndex =>
                                        setAttributes({ zIndex })
                                    }
                                    breakpoint={deviceType}
                                />
                                {deviceType !== 'general' && (
                                    <__experimentalResponsiveControl
                                        breakpoints={breakpoints}
                                        onChange={breakpoints =>
                                            setAttributes({ breakpoints })
                                        }
                                        breakpoint={deviceType}
                                    />
                                )}
                                <__experimentalPositionControl
                                    position={position}
                                    onChange={position =>
                                        setAttributes({ position })
                                    }
                                    breakpoint={deviceType}
                                />
                                <__experimentalDisplayControl
                                    display={display}
                                    onChange={display =>
                                        setAttributes({ display })
                                    }
                                    breakpoint={deviceType}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </InspectorControls>
    );
};

export default Inspector;
