/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { __experimentalBlock } = wp.blockEditor;
const { ResizableBox } = wp.components;
const { dispatch } = wp.data;

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

    get getFirstDividerObject() {
        const { divider1 } = this.props.attributes;

        const response = {
            divider: { ...JSON.parse(divider1) }
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
            setAttributes
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
                defaultSize={{
                    width: '100%',
                    height: value.general.height + value.general.heightUnit
                }}
                enable={{
                    top: true,
                    right: false,
                    bottom: true,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}
                onResizeStart={() => {
                    setTimeout(() => {
                        dispatch('core/editor').selectBlock(clientId)
                    }, 100);
                    value.general.heightUnit != 'px' ?
                        (
                            value.general.heightUnit = 'px',
                            setAttributes({
                                size: JSON.stringify(value)
                            })
                        ) :
                        null
                }}
                onResizeStop={(event, direction, elt, delta) => {
                    value.general.height = elt.getBoundingClientRect().height;
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
                            <hr class="maxi-divider-block__divider-1" />
                            <hr class="maxi-divider-block__divider-2" />
                        </Fragment>
                    }
                </__experimentalBlock>
            </ResizableBox>
        ];
    }
}

export default edit;