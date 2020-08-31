/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    RangeControl,
    SelectControl,
    TextareaControl,
    TextControl,
} = wp.components;
const { useSelect } = wp.data;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../utils'
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    FullSizeControl,
    SettingTabsControl,
    TypographyControl,
    SvgStrokeWidthControl,
    SvgAnimationControl,
    SvgAnimationDurationControl,
    SvgWidthControl,
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
    __experimentalHoverEffectControl,
} from '../../components';

/**
 * External dependencies
 */
import {
    capitalize,
    isEmpty,
    isNil,
    isObject
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
            fullWidth,
            alignment,
            content,
            hoverContent,
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
            hover,
            scale,
            svgColorOrange,
            svgColorBlack,
            svgColorWhite,
            stroke,
            defaultStroke,
            animation,
            duration,
            isHovered,
            width,
        },
        clientId,
        deviceType,
        setAttributes,
    } = props;

    const sizeValue = !isObject(size) ?
        JSON.parse(size) :
        size;

    function isAnimatedSvg() {
        if(wp.data.select( 'core/block-editor' ).getSelectedBlock() !== null) {
            let clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
            let current_content = wp.data.select( 'core/block-editor' ).getSelectedBlock().attributes.content;
            if (current_content.indexOf('<animate') !== -1 || current_content.indexOf('<!--animate') !== -1) {
                let new_content = current_content.replace(/animatetransform'/g, 'animatetransform');
                wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, {content: new_content})
                return true;
            }
            else return false;
        }
        else return false;
    }

    function changeSvgStrokeWidth(width) {

        if(width) {
            let clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
            let current_content = wp.data.select( 'core/block-editor' ).getSelectedBlock().attributes.content;
            let regex_line_to_change = new RegExp('stroke-width=".+?(?= )', 'g');
            let change_to = 'stroke-width="' + width+'"';
            let new_content = current_content.replace(regex_line_to_change, change_to);

            wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, {content: new_content})
        }
    }

    function changeSvgAnimation(animation) {
        let clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
        let current_content = wp.data.select( 'core/block-editor' ).getSelectedBlock().attributes.content;
        let new_content = '';
        let hover_content = '';

        switch(animation){
            case 'loop':
                new_content = current_content.replace(/repeatCount="1"/g,  'repeatCount="indefinite"');
                new_content = new_content.replace(/dur="0"/g, 'dur="3.667s"');
                break;
            case 'load-once':
                new_content = current_content.replace(/repeatCount="indefinite"/g,  'repeatCount="1"');
                new_content = new_content.replace(/dur="0"/g, 'dur="3.667s"');
                break;
            case 'hover-loop':
                new_content = current_content.replace(new RegExp('dur=".+?(?= )', 'g'), 'dur="0"');
               // hover_content = current_content.replace(/repeatCount="1"/g,  'repeatCount="indefinite"');
                //hover_content = hover_content.replace(/dur="0"/g, 'dur="3.667s"');
                break;
            case 'hover-once':
                break;
            case 'hover-off':
                break;
            case 'off':
                new_content = current_content.replace(new RegExp('dur=".+?(?= )', 'g'), 'dur="0"');
                break;
            default:
                return;
        }

        console.log('animation: '+animation);

        if(new_content !== '') wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, {content: new_content})

    }

    function changeSvgAnimationDuration(duration) {
        let clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
        let current_content = wp.data.select( 'core/block-editor' ).getSelectedBlock().attributes.content;
        let new_content = '';

        let regex_line_to_change = new RegExp('dur=".+?(?= )', 'g');
        let change_to = 'dur="' + duration+'s"';
        new_content = current_content.replace(regex_line_to_change, change_to );

        if(new_content !== '') wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, {content: new_content})

    }

    function changeSvgSize(width) {
        let clientId = wp.data.select('core/block-editor').getSelectedBlock().clientId;
        let current_content = wp.data.select( 'core/block-editor' ).getSelectedBlock().attributes.content;
        let new_content = '';

        let regex_line_to_change = new RegExp('width=".+?(?=")');
        let change_to = 'width="' +width;

        let regex_line_to_change2 = new RegExp('height=".+?(?=")');
        let change_to2 = 'height="' +width;

        new_content = current_content.replace(regex_line_to_change, change_to );
        new_content = new_content.replace(regex_line_to_change2, change_to2 );

        if (new_content.indexOf('viewBox') !== -1) {
            // let regex_line_to_change3 = new RegExp('viewBox=".+?(?=")');
            // let change_to3 = 'viewBox="0 0 ' +width+' '+ width;

            // new_content = new_content.replace(regex_line_to_change3, change_to3 );
        }
        else {
            let change_to3 = ' viewBox="0 0 64 64"><defs>';
            new_content = new_content.replace(/><defs>/, change_to3 );
        }

        if(new_content !== '') wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, {content: new_content})

    }

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
                                                                        defaultOpacity={getDefaultProp(clientId, 'opacity')}
                                                                        onChange={opacity => setAttributes({ opacity })}
                                                                        breakpoint={deviceType}
                                                                    />
                                                                    <BackgroundControl
                                                                        background={background}
                                                                        defaultBackground={getDefaultProp(clientId, 'background')}
                                                                        onChange={background => setAttributes({ background })}
                                                                        disableImage
                                                                        disableVideo
                                                                        disableGradient
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
                                                                        defaultOpacity={getDefaultProp(clientId, 'opacityHover')}
                                                                        onChange={opacityHover => setAttributes({ opacityHover })}
                                                                        breakpoint={deviceType}
                                                                    />
                                                                    <BackgroundControl
                                                                        background={backgroundHover}
                                                                        defaultBackground={getDefaultProp(clientId, 'backgroundHover')}
                                                                        onChange={backgroundHover => setAttributes({ backgroundHover })}
                                                                        disableImage
                                                                        disableVideo
                                                                        disableGradient
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
                                                                    defaultBorder={getDefaultProp(clientId, 'border')}
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
                                                                    defaultBorder={getDefaultProp(clientId, 'borderHover')}
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
                                            label: __('Line Width', 'maxi-blocks'),
                                            content: (
                                                <SvgStrokeWidthControl
                                                    stroke={stroke}
                                                    defaultStroke={defaultStroke}
                                                    onChange={stroke => {setAttributes({ stroke }); changeSvgStrokeWidth(stroke)}}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Width / Height', 'maxi-blocks'),
                                            content: (
                                                <FullSizeControl
                                                    size={size}
                                                    defaultSize={getDefaultProp(clientId, 'size')}
                                                    onChange={size => {setAttributes({ size }); changeSvgSize(size)}}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Width', 'maxi-blocks'),
                                            content: (
                                                <SvgWidthControl
                                                    width={width}
                                                    onChange={width => {setAttributes({ width }); changeSvgSize(width)}}
                                                    breakpoint={deviceType}
                                                />
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
                                                                    defaultBoxShadow={getDefaultProp(clientId, 'boxShadow')}
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
                                                                    defaultBoxShadow={getDefaultProp(clientId, 'boxShadowHover')}
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
                                                        defaultValues={getDefaultProp(clientId, 'padding')}
                                                        onChange={padding => setAttributes({ padding })}
                                                        breakpoint={deviceType}
                                                        disableAuto
                                                    />
                                                    <__experimentalAxisControl
                                                        values={margin}
                                                        defaultValues={getDefaultProp(clientId, 'margin')}
                                                        onChange={margin => setAttributes({ margin })}
                                                        breakpoint={deviceType}
                                                    />
                                                </Fragment>
                                            )
                                        },
                                        isAnimatedSvg() &&
                                            {
                                                label: __('SVG Animation', 'maxi-blocks'),
                                                content: (
                                                    <Fragment>
                                                    <SvgAnimationControl
                                                        animation={animation}
                                                        onChange={animation => {setAttributes({ animation }); changeSvgAnimation(animation)}}

                                                    />
                                                    <SvgAnimationDurationControl
                                                        duration={duration}
                                                        onChange={duration =>{setAttributes({ duration }); changeSvgAnimationDuration(duration)} }

                                                    />
                                                    </Fragment>
                                                )
                                            },
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
                                        <Fragment>
                                            <TextControl
                                                label={__('Additional CSS Classes', 'maxi-blocks')}
                                                className='maxi-additional__css-classes'
                                                value={extraClassName}
                                                onChange={extraClassName => setAttributes({ extraClassName })}
                                            />
                                        </Fragment>
                                    }
                                    <__experimentalZIndexControl
                                        zIndex={zIndex}
                                        defaultZIndex={getDefaultProp(clientId, 'zIndex')}
                                        onChange={zIndex => setAttributes({ zIndex })}
                                        breakpoint={deviceType}
                                    />
                                    {
                                        deviceType != 'general' &&
                                        <__experimentalResponsiveControl
                                            breakpoints={breakpoints}
                                            defaultBreakpoints={getDefaultProp(clientId, 'breakpoints')}
                                            onChange={breakpoints => setAttributes({ breakpoints })}
                                            breakpoint={deviceType}
                                        />
                                    }
                                    <__experimentalPositionControl
                                        position={position}
                                        defaultPosition={getDefaultProp(clientId, 'position')}
                                        onChange={position => setAttributes({ position })}
                                        breakpoint={deviceType}
                                    />
                                    <__experimentalDisplayControl
                                        display={display}
                                        onChange={display => setAttributes({ display })}
                                        breakpoint={deviceType}
                                        defaultDisplay='flex'
                                    />
                                    <__experimentalClipPath
                                        clipPath={clipPath}
                                        onChange={clipPath => setAttributes({ clipPath })}
                                    />
                                </div>
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Motion Effects', 'maxi-blocks'),
                                            content: (
                                                <__experimentalMotionControl
                                                    motion={motion}
                                                    onChange={motion => setAttributes({ motion })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Hover Effects', 'maxi-blocks'),
                                            content: (
                                                <__experimentalHoverEffectControl
                                                    hover={hover}
                                                    defaultHover={getDefaultProp(clientId, 'hover')}
                                                    onChange={hover => setAttributes({ hover })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Entrance Animation', 'maxi-blocks'),
                                            content: (
                                                <__experimentalEntranceAnimationControl
                                                    motion={motion}
                                                    defaultMotion={getDefaultProp(clientId, 'motion')}
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