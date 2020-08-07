/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const {
    Fragment,
    useState
} = wp.element;
const {
    RangeControl,
    SelectControl,
    TextControl,
} = wp.components;

/**
 * Internal dependencies
 */
import SVGDefaults from './defaults';
import {
    getSVGDefaults,
    injectImgSVG,
    generateDataObject
} from './utils';
import { getDefaultProp } from '../../utils'
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    ColorControl,
    FullSizeControl,
    MediaUploaderControl,
    SettingTabsControl,
    __experimentalResponsiveSelector,
    __experimentalZIndexControl,
    __experimentalAxisControl,
    __experimentalResponsiveControl,
    __experimentalOpacityControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
    __experimentalMotionControl,
    __experimentalTransformControl,
    __experimentalClipPath,
    __experimentalEntranceAnimationControl,
} from '../../components';

/**
 * External dependencies
 */
import { ReactSVG } from 'react-svg'
import {
    isNil,
    isObject,
    isArray
} from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            uniqueID,
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            SVGData,
            SVGMediaID,
            SVGMediaURL,
            imgMediaID,
            imgMediaURL,
            colorSVG,
            fullWidth,
            alignment,
            background,
            opacity,
            boxShadow,
            border,
            size,
            padding,
            margin,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
            extraClassName,
            zIndex,
            breakpoints,
            position,
            display,
            motion,
            transform,
            clipPath,
        },
        clientId,
        deviceType,
        setAttributes,
    } = props;

    const [customSVG, changeCustomSVG] = useState(
        !!SVGMediaID ? 0 : 1
    )

    const sizeValue = !isObject(size) ?
        JSON.parse(size) :
        size;

    const SVGValue = !isArray(SVGData) ?
        JSON.parse(SVGData) :
        SVGData

    const getFillItems = () => {
        const response = [];

        SVGValue.map((value, i) => {
            response.push({
                label: i,
                content: getFillItem(value, i)
            })
        })

        return response;
    }

    const getFillItem = (value, i = 0) => (
        <Fragment>
            <SettingTabsControl
                disablePadding
                items={[
                    {
                        label: __('Color', 'maxi-blocks'),
                        content: (
                            <ColorControl
                                label={__('Fill', 'maxi-blocks')}
                                color={value.color}
                                onColorChange={val => {
                                    SVGValue[i].color = val;
                                    setAttributes({
                                        SVGData: JSON.stringify(SVGValue)
                                    })
                                }}
                            />
                        )
                    },
                    {
                        label: __('Image', 'maxi-blocks'),
                        content: (
                            <MediaUploaderControl
                                allowedTypes={['image']}
                                mediaID={value.imageID}
                                onSelectImage={imageData => {
                                    SVGValue[i].imageID = imageData.id;
                                    SVGValue[i].imageURL = imageData.url;
                                    setAttributes({
                                        SVGData: JSON.stringify(SVGValue)
                                    })
                                }}
                                onRemoveImage={() => {
                                    SVGValue[i].imageID = '';
                                    SVGValue[i].imageURL = '';
                                    setAttributes({
                                        SVGData: JSON.stringify(SVGValue)
                                    })
                                }}
                            />
                        )
                    }
                ]}
            />
        </Fragment>
    )

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
                                        onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                                        defaultBlockStyle={defaultBlockStyle}
                                        onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                                        isFirstOnHierarchy={isFirstOnHierarchy}
                                    />
                                </div>
                                <AccordionControl
                                    isSecondary
                                    items={[
                                        {
                                            label: __('SVG', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <SelectControl
                                                        label={__('Custom SVG', 'maxi-blocks')}
                                                        value={customSVG}
                                                        options={[
                                                            { label: __('Yes', 'maxi-blocks'), value: 1 },
                                                            { label: __('No', 'maxi-blocks'), value: 0 }
                                                        ]}
                                                        onChange={value => changeCustomSVG(Number(value))}
                                                    />
                                                    {
                                                        !customSVG &&
                                                        getSVGDefaults(props)
                                                    }
                                                    {
                                                        !!customSVG &&
                                                        <Fragment>
                                                            <MediaUploaderControl
                                                                className='maxi-svg-block__svg-uploader'
                                                                allowedTypes={['image/svg+xml']}
                                                                mediaID={SVGMediaID}
                                                                onSelectImage={imageData => {
                                                                    setAttributes({
                                                                        SVGMediaID: imageData.id,
                                                                        SVGMediaURL: imageData.url
                                                                    });
                                                                }}
                                                                onRemoveImage={() =>
                                                                    setAttributes({
                                                                        SVGMediaID: '',
                                                                        SVGMediaURL: '',
                                                                    })
                                                                }
                                                                placeholder={__('Set SVG', 'maxi-blocks')}
                                                                replaceButton={__('Replace SVG', 'maxi-blocks')}
                                                                removeButton={__('Remove SVG', 'maxi-blocks')}
                                                            />
                                                            <div
                                                                style={{
                                                                    display: 'none',
                                                                    visibility: 'hidden',
                                                                }}
                                                            >
                                                                <ReactSVG
                                                                    src={SVGMediaURL}
                                                                    beforeInjection={svg => {
                                                                        if (!!imgMediaURL)
                                                                            injectImgSVG(svg, uniqueID, imgMediaURL);
                                                                    }}
                                                                    afterInjection={(err, svg) => {
                                                                        if (!!svg) {
                                                                            const resData = generateDataObject(SVGData, svg);

                                                                            setAttributes({
                                                                                SVGElement: svg.outerHTML,
                                                                                SVGData: JSON.stringify(resData)
                                                                            })
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </Fragment>
                                                    }
                                                </Fragment>
                                            )
                                        },
                                        {
                                            label: __('Fill', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    {
                                                        SVGValue.length > 1 &&
                                                        <SettingTabsControl
                                                            items={getFillItems()}
                                                        />
                                                    }
                                                    {
                                                        SVGValue.length === 1 &&
                                                        getFillItem(SVGValue[0])
                                                    }
                                                </Fragment>
                                            )
                                        },
                                        {
                                            label: __('Alignment', 'maxi-blocks'),
                                            content: (
                                                <AlignmentControl
                                                    alignment={alignment}
                                                    onChange={alignment => setAttributes({ alignment })}
                                                    disableJustify
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        function () {
                                            if (deviceType === 'general') {
                                                return {
                                                    label: __('Width / Height', 'maxi-blocks'),
                                                    content: (
                                                        <RangeControl
                                                            label={__('Width', 'maxi-blocks')}
                                                            value={sizeValue.general.width}
                                                            onChange={val => {
                                                                if (isNil(val)) {
                                                                    const defaultSize = getDefaultProp(clientId, 'size');
                                                                    sizeValue.general.width = defaultSize.general.width;
                                                                }
                                                                else {
                                                                    sizeValue.general.width = val;
                                                                }
                                                                setAttributes({ size: JSON.stringify(sizeValue) })
                                                            }}
                                                            allowReset
                                                        />
                                                    )
                                                }
                                            }
                                        }(),
                                        {
                                            label: __('Background', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <Fragment>
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacity}
                                                                        onChange={opacity => setAttributes({ opacity })}
                                                                        breakpoint={deviceType}
                                                                    />
                                                                    <BackgroundControl
                                                                        backgroundOptions={background}
                                                                        onChange={background => setAttributes({ background })}
                                                                        disableImage
                                                                    />
                                                                </Fragment>
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <Fragment>
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacityHover}
                                                                        onChange={opacityHover => setAttributes({ opacityHover })}
                                                                        breakpoint={deviceType}
                                                                    />
                                                                    <BackgroundControl
                                                                        backgroundOptions={backgroundHover}
                                                                        onChange={backgroundHover => setAttributes({ backgroundHover })}
                                                                        disableImage
                                                                    />
                                                                </Fragment>
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Border', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={border}
                                                                    onChange={border => setAttributes({ border })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={borderHover}
                                                                    onChange={borderHover => setAttributes({ borderHover })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Width / Height', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    {
                                                        isFirstOnHierarchy &&
                                                        <SelectControl
                                                            label={__('Full Width', 'maxi-blocks')}
                                                            value={fullWidth}
                                                            options={[
                                                                { label: __('No', 'maxi-blocks'), value: 'normal' },
                                                                { label: __('Yes', 'maxi-blocks'), value: 'full' }
                                                            ]}
                                                            onChange={fullWidth => setAttributes({ fullWidth })}
                                                        />
                                                    }
                                                    <FullSizeControl
                                                        size={size}
                                                        onChange={size => setAttributes({ size })}
                                                        breakpoint={deviceType}
                                                        hideWidth
                                                    />
                                                </Fragment>
                                            )
                                        },
                                        {
                                            label: __('Box Shadow', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadow}
                                                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadowHover}
                                                                    onChange={boxShadowHover => setAttributes({ boxShadowHover })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Padding / Margin', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <__experimentalAxisControl
                                                        values={padding}
                                                        onChange={padding => setAttributes({ padding })}
                                                        breakpoint={deviceType}
                                                        disableAuto
                                                    />
                                                    <__experimentalAxisControl
                                                        values={margin}
                                                        onChange={margin => setAttributes({ margin })}
                                                        breakpoint={deviceType}
                                                    />
                                                </Fragment>
                                            )
                                        }
                                    ]}
                                />
                            </Fragment>
                        )
                    },
                    {
                        label: __('Advanced', 'maxi-blocks'),
                        content: (
                            <Fragment>
                                <div className='maxi-tab-content__box'>
                                    {
                                        deviceType === 'general' &&
                                        <TextControl
                                            label={__('Additional CSS Classes', 'maxi-blocks')}
                                            className='maxi-additional__css-classes'
                                            value={extraClassName}
                                            onChange={extraClassName => setAttributes({ extraClassName })}
                                        />
                                    }
                                    {
                                        deviceType != 'general' &&
                                        <__experimentalResponsiveControl
                                            breakpoints={breakpoints}
                                            onChange={breakpoints => setAttributes({ breakpoints })}
                                            breakpoint={deviceType}
                                        />
                                    }
                                </div>
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Motion Effects', 'maxi-blocks'),
                                            content: (
                                                <__experimentalMotionControl
                                                    motionOptions={motion}
                                                    onChange={motion => setAttributes({ motion })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Entrance Animation', 'maxi-blocks'),
                                            content: (
                                                <__experimentalEntranceAnimationControl
                                                    motionOptions={motion}
                                                    onChange={motion => setAttributes({ motion })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Transform', 'maxi-blocks'),
                                            content: (
                                                <__experimentalTransformControl
                                                    transform={transform}
                                                    onChange={transform => setAttributes({ transform })}
                                                    uniqueID={uniqueID}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Clip path', 'maxi-blocks'),
                                            content: (
                                                <__experimentalClipPath
                                                    clipPath={clipPath}
                                                    onChange={clipPath => setAttributes({ clipPath })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Display', 'maxi-blocks'),
                                            content: (
                                                <__experimentalDisplayControl
                                                    display={display}
                                                    onChange={display => setAttributes({ display })}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Position', 'maxi-blocks'),
                                            content: (
                                                <__experimentalPositionControl
                                                    position={position}
                                                    onChange={position => setAttributes({ position })}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Z-index', 'maxi-blocks'),
                                            content: (
                                                <__experimentalZIndexControl
                                                    zindex={zIndex}
                                                    onChange={zIndex => setAttributes({ zIndex })}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        }
                                    ]}
                                />
                            </Fragment>
                        )
                    }
                ]}
            />
        </InspectorControls >
    )
}

export default Inspector;