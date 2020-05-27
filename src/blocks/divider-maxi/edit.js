/**
 * WordPress dependencies
 */
const { __experimentalBlock } = wp.blockEditor;
const { dispatch } = wp.data;

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
        return `${this.props.attributes.uniqueID}>hr`;
    }

    get getObject() {
        const {
            alignment,
            dividerColor,
            dividerWidthUnit,
            dividerWidth,
            dividerHeightUnit,
            dividerHeight
        } = this.props.attributes;

        const response = {
            label: 'Divider',
            general: {}
        }

        if (!isNil(alignment)) {
            switch (alignment) {
                case 'left':
                    response.general['margin-left'] = "0px";
                    break;
                case 'center':
                case 'justify':
                    // response.general['margin-left'] = "auto";
                    // response.general['margin-right'] = "auto";
                    null
                    break;
                case 'right':
                    response.general['margin-right'] = "0px";
                    break;
            }
        }
        if (!isEmpty(dividerColor))
            response.general['background-color'] = dividerColor;
        if (isNumber(dividerWidth)) {
            response.general['widthUnit'] = dividerWidthUnit;
            response.general['width'] = dividerWidth;
        }
        if (isNumber(dividerHeight)) {
            response.general['heightUnit'] = dividerHeightUnit;
            response.general['height'] = dividerHeight;
        }

        return response;
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(),
            },
        });
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
                hideDivider,
                verticalDivider,
                roundedDivider
            },
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-divider-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );
        if (verticalDivider)
            classes = classnames(classes, 'is-vertical')
        if (roundedDivider)
            classes = classnames(classes, 'is-rounded')

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar />,
            <__experimentalBlock
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
            >
                {
                    !hideDivider &&
                    <hr
                        className="maxi-divider"
                    />
                }
            </__experimentalBlock>
        ];
    }
}

export default edit;