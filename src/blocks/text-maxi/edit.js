/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    __experimentalBlock,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject
} from '../../extensions/styles/utils';
import {
    GXBlock,
    __experimentalToolbar
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil,
    isNumber
} from 'lodash';
import transform from "css-to-react-native-transform";

import Scripts from '../../extensions/styles/hoverAnimations.js';

/**
 * Content
 */
class edit extends GXBlock {
    componentDidUpdate() {
        this.fullWidthSetter();
        this.displayStyles();
    }

    fullWidthSetter() {
        if(!!document.getElementById(`block-${this.props.clientId}`))
            document.getElementById(`block-${this.props.clientId}`).setAttribute('data-align', this.props.attributes.fullWidth);
    }

    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
        }

        return response;
    }

    get getNormalObject() {
        const {
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
            typography,
            background,
            opacity,
            boxShadow,
            border,
            size,
            margin,
            padding,
            hoverPadding,
            zIndex
        } = this.props.attributes;

        const response = {
            typography: { ...JSON.parse(typography) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            borderWidth: { ...JSON.parse(border).borderWidth },
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            text: {
                label: 'Text',
                general: {},
                desktop: {},
                tablet: {},
                mobile: {}
            }
        };

        if (!isNil(alignmentDesktop)) {
            switch (alignmentDesktop) {
                case 'left':
                    response.text.desktop['text-align'] = 'left';
                    break;
                case 'center':
                    response.text.desktop['text-align'] = 'center';
                    break;
                case 'right':
                    response.text.desktop['text-align'] = 'right';
                    break;
                case 'justify':
                    response.text.desktop['text-align'] = 'justify';
                    break;
            }
        }
        if (!isNil(alignmentTablet)) {
            switch (alignmentTablet) {
                case 'left':
                    response.text.tablet['text-align'] = 'left';
                    break;
                case 'center':
                    response.text.tablet['text-align'] = 'center';
                    break;
                case 'right':
                    response.text.tablet['text-align'] = 'right';
                    break;
                case 'justify':
                    response.text.tablet['text-align'] = 'justify';
                    break;
            }
        }
        if (!isNil(alignmentMobile)) {
            switch (alignmentMobile) {
                case 'left':
                    response.text.mobile['text-align'] = 'left';
                    break;
                case 'center':
                    response.text.mobile['text-align'] = 'center';
                    break;
                case 'right':
                    response.text.mobile['text-align'] = 'right';
                    break;
                case 'justify':
                    response.text.mobile['text-align'] = 'justify';
                    break;
            }
        }
        if (isNumber(opacity))
            response.text.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.text.general['z-index'] = zIndex;

        return response;
    }

    get getHoverObject() {
        const {
            typographyHover,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
        } = this.props.attributes;

        const response = {
            typographyHover: { ...JSON.parse(typographyHover) },
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidth: { ...JSON.parse(borderHover).borderWidth },
            borderRadius: { ...JSON.parse(borderHover).borderRadius },
            text: {
                label: 'Text',
                general: {}
            }
        };

        if (opacityHover)
            response.text.general['opacity'] = opacityHover;
        return response;
    }

    get getHoverAnimationMainObject() {
        const {
            hoverOpacity,
            hoverBackground,
            hoverBorder,
            hoverPadding,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverBackground)) },
            border: { ...JSON.parse(hoverBorder) },
            borderWidth: { ...JSON.parse(hoverBorder).borderWidth },
            borderRadius: { ...JSON.parse(hoverBorder).borderRadius },
            padding: { ...JSON.parse(hoverPadding) },
            animationHover: {
                label: 'Animation Hover',
                general: {}
            }
        };

        if (hoverOpacity)
            response.animationHover.general['opacity'] = hoverOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityObject() {
        const {
            hoverAnimationTypeOpacity,
        } = this.props.attributes;

        const response = {
            animationTypeOpacityHover: {
                label: 'Animation Type Opacity Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacity)
            response.animationTypeOpacityHover.general['opacity'] = hoverAnimationTypeOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityColorObject() {
        const {
            hoverAnimationTypeOpacityColor,
            hoverAnimationTypeOpacityColorBackground,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverAnimationTypeOpacityColorBackground)) },
            animationTypeOpacityHoverColor: {
                label: 'Animation Type Opacity Color Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacityColor)
            response.animationTypeOpacityHoverColor.general['opacity'] = hoverAnimationTypeOpacityColor;

        return response
    }


    get getHoverAnimationTextTitleObject() {
        const {
            hoverAnimationTitleTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationTitleTypography: { ...JSON.parse(hoverAnimationTitleTypography) }
        };

        return response
    }

    get getHoverAnimationTextContentObject() {
        const {
            hoverAnimationContentTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationContentTypography: { ...JSON.parse(hoverAnimationContentTypography) }
        };

        return response
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
                hoverAnimation,
                hoverAnimationDuration,
                hoverAnimationType,
                hoverAnimationTypeText,
                textLevel,
                content,
                extraStyles,
            },
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-text-block',
            blockStyle,
            extraClassName,
            'hover-animation-'+hoverAnimation,
            'hover-animation-type-'+hoverAnimationType,
            'hover-animation-type-text-'+hoverAnimationTypeText,
            'hover-animation-duration-'+hoverAnimationDuration,
            uniqueID,
            className
        );


        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <RichText
                value={content}
                onChange={content => setAttributes({ content })}
                tagName={__experimentalBlock[textLevel]}
                className={classes}
                placeholder={__('Set your Maxi Text here...', 'maxi-blocks')}
                onSplit={value => {
                    if (!value) {
                        return createBlock('maxi-blocks/text-maxi');
                    }

                    return createBlock('maxi-blocks/text-maxi', {
                        ...attributes,
                        content: value,
                    });
                }}
                keepPlaceholderOnFocus
                formattingControls={[]}
            />
        ];
    }
}

export default edit;