/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { __experimentalBlock } = wp.blockEditor;

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
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID} > hr.maxi-divider-block__divider-1`]: this.getFirstDividerObject,
            [`${this.props.attributes.uniqueID} > hr.maxi-divider-block__divider-2`]: this.getSecondDividerObject

        }

        return response;
    }

    get getNormalObject() {
        const {
            lineVertical,
            lineHorizontal,
            linesAlign,
            opacity,
            background,
            boxShadow,
            size,
            padding,
            margin,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            size: { ...JSON.parse(size) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            divider: {
                label: 'Divider',
                general: {}
            }
        };

        if (isNumber(opacity))
            response.divider.general['opacity'] = opacity;
        if (!isNil(linesAlign)) {
            response.divider.general['flex-direction'] = linesAlign;
            if (linesAlign === 'row') {
                if (!isNil(lineVertical))
                    response.divider.general['align-items'] = lineVertical;
                if (!isNil(lineHorizontal))
                    response.divider.general['justify-content'] = lineHorizontal;
            }
            else {
                if (!isNil(lineVertical))
                    response.divider.general['justify-content'] = lineVertical;
                if (!isNil(lineHorizontal))
                    response.divider.general['align-items'] = lineHorizontal;
            }
        }

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            backgroundHover,
            boxShadowHover
        } = this.props.attributes;

        const response = {
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            dividerHover: {
                label: 'Divider',
                general: {}
            }
        };

        if (isNumber(opacityHover))
            response.dividerHover.general['opacity'] = opacityHover;

        return response;
    }

    get getFirstDividerObject() {
        const { divider1 } = this.props.attributes;

        const response = {
            divider: { ...JSON.parse(divider1) }
        };

        return response;
    }

    get getSecondDividerObject() {
        const { divider2 } = this.props.attributes;

        const response = {
            divider: { ...JSON.parse(divider2) }
        };

        return response;
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                showLine,
                lineOrientation,
                extraClassName,
                fullWidth
            },
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-divider-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className,
            lineOrientation === 'vertical' ?
                'maxi-divider-block--vertical' :
                'maxi-divider-block--horizontal',
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props}/>,
            <__experimentalBlock
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
                data-align={fullWidth}
            >
                {
                    showLine === 'yes' &&
                    <Fragment>
                        <hr class="maxi-divider-block__divider-1" />
                        <hr class="maxi-divider-block__divider-2" />
                    </Fragment>
                }
            </__experimentalBlock>
        ];
    }
}

export default edit;