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

/**
 * Content
 */
class edit extends GXBlock {
    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getWrapperObject,
            [`${this.props.attributes.uniqueID} .maxi-button-extra__button`]: this.getNormalObject,
            [`${this.props.attributes.uniqueID} .maxi-button-extra__button:hover`]: this.getHoverObject
        }

        return response;
    }

    get getWrapperObject() {
        const {
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
            zIndex
        } = this.props.attributes;

        const response = {
            button: {
                label: 'Button',
                general: {},
                desktop: {},
                tablet: {},
                mobile: {}
            }
        };

        if (!isNil(alignmentDesktop)) {
            switch (alignmentDesktop) {
                case 'left':
                    response.button.desktop['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.button.desktop['align-items'] = 'center';
                    break;
                case 'right':
                    response.button.desktop['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!isNil(alignmentTablet)) {
            switch (alignmentTablet) {
                case 'left':
                    response.button.tablet['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.button.tablet['align-items'] = 'center';
                    break;
                case 'right':
                    response.button.tablet['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!isNil(alignmentMobile)) {
            switch (alignmentMobile) {
                case 'left':
                    response.button.mobile['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.button.mobile['align-items'] = 'center';
                    break;
                case 'right':
                    response.button.mobile['align-items'] = 'flex-end';
                    break;
            }
        }
        if (isNumber(zIndex))
            response.button.general['z-index'] = zIndex;

        return response;
    }

    get getNormalObject() {
        const {
            background,
            opacity,
            typography,
            boxShadow,
            border,
            size,
            padding,
            margin,
            zIndex
        } = this.props.attributes;

        const response = {
            typography: { ...JSON.parse(typography) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            button: {
                label: 'Button',
                general: {}
            }
        }

        if (isNumber(opacity))
            response.button.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.button.general['z-index'] = zIndex;

        return response;
    }

    get getHoverObject() {
        const {
            backgroundHover,
            opacityHover,
            typographyHover,
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
            buttonHover: {
                label: 'Button',
                general: {}
            }
        }

        if (isNumber(opacityHover))
            response.buttonHover.general['opacity'] = opacityHover;

        return response;
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                extraClassName,
                buttonText,
            },
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-button-extra',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBlock
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
            >
                <RichText
                    className="maxi-button-extra__button"
                    // tagName="button"
                    withoutInteractiveFormatting
                    placeholder={__('Set some text...', 'maxi-blocks')}
                    // keepPlaceholderOnFocus
                    value={buttonText}
                    onChange={buttonText => setAttributes({ buttonText })}
                    identifier="text"
                />
            </__experimentalBlock>
        ];
    }
}

export default edit;