/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { select } = wp.data;
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
    getBoxShadowObject,
    getAlignmentTextObject,
    getOpacityObject
} from '../../extensions/styles/utils';
import {
    MaxiBlock,
    __experimentalToolbar
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
    componentDidUpdate() {
        this.fullWidthSetter();
        this.displayStyles();

        if (!select('core/editor').isSavingPost() && this.state.updating) {
            this.setState({
                updating: false
            })
            this.saveProps();
        }
    }

    fullWidthSetter() {
        if (!!document.getElementById(`block-${this.props.clientId}`))
            document.getElementById(`block-${this.props.clientId}`).setAttribute('data-align', this.props.attributes.fullWidth);
    }

    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject
        }

        return response;
    }

    get getNormalObject() {
        const {
            alignment,
            typography,
            background,
            opacity,
            boxShadow,
            border,
            size,
            margin,
            padding,
            zIndex,
        } = this.props.attributes;

        const response = {
            typography: { ...JSON.parse(typography) },
            alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            opacity: { ...getOpacityObject(JSON.parse(opacity)) },
            zindex: { ...JSON.parse(zIndex) },
        };

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
            opacity: { ...getOpacityObject(JSON.parse(opacityHover)) },
        };

        return response;
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
                textLevel,
                content,
            },
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-text-block',
            blockStyle,
            extraClassName,
            'hover-animation-type-' + hoverAnimation,
            'hover-animation-duration-' + hoverAnimationDuration,
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