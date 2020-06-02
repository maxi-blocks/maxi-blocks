/**
 * WordPress dependencies
 */
const { __experimentalBlock } = wp.blockEditor;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { getBoxShadowObject } from '../../extensions/styles/utils';
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
            dividerHeight,
            opacity,
            boxShadow,
            size,
            padding,
            margin,
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            size: { ...JSON.parse(size) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            divider: {
                label: 'Divider',
                general: {}
            }
        };

        if (!isNil(alignment)) {    // Needs to be reviewed
            switch (alignment) {
                case 'left':
                    response.divider.general['margin-left'] = "0px";
                    break;
                case 'center':
                case 'justify':
                    // response.divider.general['margin-left'] = "auto";
                    // response.divider.general['margin-right'] = "auto";
                    null
                    break;
                case 'right':
                    response.divider.general['margin-right'] = "0px";
                    break;
            }
        }
        if (isNumber(opacity))
            response.divider.general['opacity'] = opacity;
        if (!isEmpty(dividerColor))
            response.divider.general['background-color'] = dividerColor;
        if (isNumber(dividerWidth)) {
            response.divider.general['widthUnit'] = dividerWidthUnit;
            response.divider.general['width'] = dividerWidth;
        }
        if (isNumber(dividerHeight)) {
            response.divider.general['heightUnit'] = dividerHeightUnit;
            response.divider.general['height'] = dividerHeight;
        }

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