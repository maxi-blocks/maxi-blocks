/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { __experimentalBlock } = wp.blockEditor;
const { ResizableBox } = wp.components;
const { withSelect } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getDefaultProp
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
            [`${this.props.attributes.uniqueID} > hr.maxi-divider-block__divider`]: this.getDividerObject,
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
            zIndex
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
        if (isNumber(zIndex))
            response.divider.general['z-index'] = zIndex;

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

    get getDividerObject() {
        const { divider } = this.props.attributes;

        const response = {
            divider: { ...JSON.parse(divider) }
        };

        return response;
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                showLine,
                lineOrientation,
                extraClassName,
                fullWidth,
                size
            },
            className,
            clientId,
            isSelected,
            setAttributes,
            getLinesQuantity
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

        let value = typeof size != 'object' ?
            JSON.parse(size) :
            size;

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <ResizableBox
                className={classnames(
                    'maxi-block__resizer',
                    'maxi-divider-block__resizer',
                    `maxi-divider-block__resizer__${clientId}`
                )}
                size={{
                    width: '100%',
                    height: value.desktop.height + value.desktop.heightUnit
                }}
                enable={{
                    top: false,
                    right: false,
                    bottom: isSelected,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}
                onResizeStart={() => {
                    value.desktop.heightUnit != 'px' ?
                        (
                            value.desktop.heightUnit = 'px',
                            setAttributes({
                                size: JSON.stringify(value)
                            })
                        ) :
                        null
                }}
                onResizeStop={(event, direction, elt, delta) => {
                    value.desktop.height = elt.getBoundingClientRect().height;
                    setAttributes({
                        size: JSON.stringify(value),
                    });
                }}
            >
                <__experimentalBlock
                    className={classes}
                    data-gx_initial_block_class={defaultBlockStyle}
                    data-align={fullWidth}
                >
                    {
                        showLine === 'yes' &&
                        <Fragment>
                            <hr class="maxi-divider-block__divider" />
                        </Fragment>
                    }
                </__experimentalBlock>
            </ResizableBox>
        ];
    }
}

export default edit;