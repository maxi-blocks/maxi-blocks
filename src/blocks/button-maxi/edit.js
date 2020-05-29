/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { BackEndResponsiveStyles } from '../../extensions/styles';
import {
    GXBlock,
    LinkedButton,
    __experimentalToolbar
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    isNumber
} from 'lodash';
import { typographyHover } from './data';

/**
 * Content
 */
class edit extends GXBlock {

    componentDidUpdate() {
        this.displayStyles();
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        if (this.type === 'wrapper')
            return `${this.props.attributes.uniqueID}`;
        if (this.type === 'normal')
            return `${this.props.attributes.uniqueID} .maxi-buttoneditor-button`;
        if (this.type === 'hover')
            return `${this.props.attributes.uniqueID} .maxi-buttoneditor-button:hover`;
    }

    /**
     * Get object for styling
     */
    get getObject() {
        if (this.type === 'wrapper')
            return this.getWrapperObject;
        if (this.type === 'normal')
            return this.getNormalObject;
        if (this.type === 'hover')
            return this.getHoverObject;
    }

    get getWrapperObject() {
        const response = {
            button: {
                label: 'Button',
                general: {}
            }
        }
        if (!isNil(this.props.attributes.alignment)) {
            switch (this.props.attributes.alignment) {
                case 'left':
                    response.button.general['justify-content'] = 'flex-start';
                    break;
                case 'center':
                    response.button.general['justify-content'] = 'center';
                    break;
                case 'right':
                    response.button.general['justify-content'] = 'flex-end';
                    break;
            }
        }
        return response;
    }

    get getNormalObject() {
        const {
            backgroundColor,
            backgroundGradient,
            opacity,
            typography,
            boxShadow,
            border,
            size,
            padding,
            margin
        } = this.props.attributes;

        const response = {
            typography: { ...JSON.parse(typography) },
            boxShadow: { ...JSON.parse(boxShadow) },
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

        if (!isEmpty(backgroundColor))
            response.button.general['background-color'] = backgroundColor;
        if (!isEmpty(backgroundGradient))
            response.button.general['background'] = backgroundGradient;
        if (isNumber(opacity))
            response.button.general['opacity'] = opacity;

        return response;
    }

    get getHoverObject() {
        const {
            backgroundColorHover,
            backgroundGradientHover,
            opacityHover,
            typographyHover,
            boxShadowHover,
            borderHover,
            paddingHover,
            marginHover
        } = this.props.attributes;

        const response = {
            typographyHover: { ...JSON.parse(typographyHover) },
            boxShadowHover: { ...JSON.parse(boxShadowHover) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidth: { ...JSON.parse(borderHover).borderWidth },
            borderRadius: { ...JSON.parse(borderHover).borderRadius },
            paddingHover: { ...JSON.parse(paddingHover) },
            marginHover: { ...JSON.parse(marginHover) },
            buttonHover: {
                label: 'Button',
                general: {}
            }
        }

        if (!isEmpty(backgroundColorHover))
            response.buttonHover.general['background-color'] = backgroundColorHover;
        if (!isEmpty(backgroundGradientHover))
            response.buttonHover.general['background'] = backgroundGradientHover;
        if (isNumber(opacityHover))
            response.buttonHover.general['opacity'] = opacityHover;

        return response;
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        this.saveMeta('wrapper');
        this.saveMeta('normal');
        this.saveMeta('hover');

        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                linkOptions,
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
            <__experimentalToolbar />,
            <__experimentalBlock
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
            >
                <LinkedButton
                    className="maxi-buttoneditor-button"
                    placeholder={__('Click me', 'maxi-blocks')}
                    buttonText={buttonText}
                    onTextChange={buttonText => setAttributes({ buttonText })}
                    externalLink={JSON.parse(linkOptions)}
                    onLinkChange={value => setAttributes({ linkOptions: JSON.stringify(value) })}
                />
            </__experimentalBlock>
        ];
    }
}

export default edit;