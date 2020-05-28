/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { dispatch } = wp.data;
const {
    __experimentalBlock,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
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
    isNil,
    isNumber
} from 'lodash';

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
            alignment,
            opacity,
            backgroundColor,
            backgroundGradient
        } = this.props.attributes;

        const response = {
            label: 'Text',
            general: {}
        }

        if (!isNil(alignment)) {
            switch (alignment) {
                case 'left':
                    response.general['margin-right'] = 'auto';
                    break;
                case 'center':
                case 'justify':
                    response.general['margin-right'] = 'auto';
                    response.general['margin-left'] = 'auto';
                    break;
                case 'right':
                    response.general['margin-left'] = 'auto';
                    break;
            }
        }
        if (isNumber(opacity))
            response.general['opacity'] = opacity;
        if (!isEmpty(backgroundColor))
            response.general['background-color'] = backgroundColor;
        if (!isEmpty(backgroundGradient))
            response.general['background'] = backgroundGradient;

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            backgroundColorHover,
            backgroundGradientHover
        } = this.props.attributes;

        const response = {
            label: 'Text',
            general: {}
        }
        if (opacityHover)
            response.general['opacity'] = opacityHover;
        if (!isEmpty(backgroundColorHover))
            response.general['background-color'] = backgroundColorHover;
        if (!isEmpty(backgroundGradientHover))
            response.general['background'] = backgroundGradientHover;
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

    saveMeta(type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(null, type, false),
            },
        });
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