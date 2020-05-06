/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalBlock } = wp.blockEditor;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
    GXBlock,
    LinkedButton,
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

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID, this.displayStyles.bind(this)); // May should go on constructor
    }

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
            return `${this.props.attributes.uniqueID} .gx-buttoneditor-button`;
        if (this.type === 'hover')
        return `${this.props.attributes.uniqueID} .gx-buttoneditor-button:hover`;
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
            label: 'Button',
            general: {}
        }
        if (!isNil(this.props.attributes.alignment)) {
            switch (this.props.attributes.alignment) {
                case 'left':
                    response.general['justify-content'] = 'flex-start';
                    break;
                case 'center':
                    response.general['justify-content'] = 'center';
                    break;
                case 'right':
                    response.general['justify-content'] = 'flex-end';
                    break;
            }
        }
        return response;
    }

    get getNormalObject() {
        const {
            backgroundColor,
            background,
            opacity
        } = this.props.attributes;

        const response = {
            label: 'Button',
            general: {}
        }
        // if (!isEmpty(color))
        //     response.general['color'] = color;
        if (!isEmpty(backgroundColor))
            response.general['background-color'] = backgroundColor;
        if (!isEmpty(background))
            response.general['background'] = background;
        if (isNumber(opacity))
            response.general['opacity'] = opacity;
        // if (!isEmpty(borderSettings.borderColor))
        //     response.general['border-color'] = borderSettings.borderColor;
        // if (!isEmpty(borderSettings.borderType))
        //     response.general['border-style'] = borderSettings.borderType;
        return response;
    }

    get getHoverObject() {
        const {
            backgroundColorHover,
            backgroundHover,
            opacityHover
        } = this.props.attributes;

        const response = {
            label: 'Button',
            general: {}
        }
        // if (!isEmpty(color))
        //     response.general['color'] = color;
        if (!isEmpty(backgroundColorHover))
            response.general['background-color'] = backgroundColorHover;
        if (!isEmpty(backgroundHover))
            response.general['background'] = backgroundHover;
        if (isNumber(opacityHover))
            response.general['opacity'] = opacityHover;
        // if (!isEmpty(borderSettings.borderColor))
        //     response.general['border-color'] = borderSettings.borderColor;
        // if (!isEmpty(borderSettings.borderType))
        //     response.general['border-style'] = borderSettings.borderType;

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
                linkOptions,
                extraClassName,
                buttonText,
            },
            setAttributes,
        } = this.props;

        let classes = classnames(
            'gx-block gx-button-extra',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalBlock
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
            >
                <LinkedButton
                    className="gx-buttoneditor-button"
                    placeholder={__('Click me', 'gutenberg-extra')}
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