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
import { BackEndResponsiveStyles } from '../../extensions/styles';
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
    isEmpty,
    isNumber
} from 'lodash';

/**
 * Content
 */
class edit extends GXBlock {
    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        if (this.type === 'normal')
            return `${this.props.attributes.uniqueID}`;
        if (this.type === 'hover')
            return `${this.props.attributes.uniqueID}:hover`;
    }

    get getObject() {
        if (this.type === 'normal')
            return this.getNormalObject
        if (this.type === 'hover')
            return this.getHoverObject
    }

    get getNormalObject() {
        const {
            typography,
            background,
            opacity,
            boxShadow,
            border,
            size,
            margin,
            padding,
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
                general: {}
            }
        };

        if (isNumber(opacity))
            response.text.general['opacity'] = opacity;

        return response;
    }

    get getHoverObject() {
        const {
            typographyHover,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
            marginHover,
            paddingHover,
        } = this.props.attributes;

        const response = {
            typographyHover: { ...JSON.parse(typographyHover) },
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidth: { ...JSON.parse(borderHover).borderWidth },
            borderRadius: { ...JSON.parse(borderHover).borderRadius },
            marginHover: { ...JSON.parse(marginHover) },
            paddingHover: { ...JSON.parse(paddingHover) },
            text: {
                label: 'Text',
                general: {}
            }
        };

        if (opacityHover)
            response.text.general['opacity'] = opacityHover;
        return response;
    }

    /** 
    * Refresh the styles on Editor
    */
    displayStyles() {
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
                extraClassName,
                textLevel,
                content
            },
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-text-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar />,
            <RichText
                value={content}
                onChange={content => setAttributes({ content })}
                tagName={__experimentalBlock[textLevel]}
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
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