/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { 
    RawHTML,
    Fragment
} = wp.element;
const {
    Spinner,
    IconButton,
    ResizableBox
} = wp.components;
const {
    __experimentalBlock,
    MediaUpload
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import { getSVGDefaults } from './utils';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getAlignmentFlexObject,
    getTransfromObject,
    getAlignmentTextObject,
    setBackgroundStyles
} from '../../utils';
import {
    MaxiBlock,
    __experimentalToolbar,
    __experimentalBackgroundDisplayer
} from '../../components';

/**
 * External dependencies
 */
import { ReactSVG } from 'react-svg'
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    isObject
} from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
    get getWrapperWidth() {
        const target = document.getElementById(`block-${this.props.clientId}`);
        if (!target)
            return;

        return target.getBoundingClientRect().width;
    }

    get getObject() {
        const {
            uniqueID,
            background,
            backgroundHover
        } = this.props.attributes;

        let response = {
            [uniqueID]: this.getNormalObject,
            [`${uniqueID}:hover`]: this.getHoverObject,
        }

        response = Object.assign(
            response,
            setBackgroundStyles(uniqueID, background, backgroundHover)
        )

        return response;
    }

    get getNormalObject() {
        const {
            alignment,
            opacity,
            boxShadow,
            padding,
            margin,
            zIndex,
            position,
            display,
            transform,
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            opacity: { ...JSON.parse(opacity) },
            zindex: { ...JSON.parse(zIndex) },
            alignment: { ...getAlignmentFlexObject(JSON.parse(alignment)) },
            position: { ...JSON.parse(position) },
            positionOptions: { ...JSON.parse(position).options },
            display: { ...JSON.parse(display) },
            transform: { ...getTransfromObject(JSON.parse(transform)) }
        };

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            boxShadowHover
        } = this.props.attributes;

        const response = {
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            opacityHover: { ...JSON.parse(opacityHover) }
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
                SVGElement,
                fullWidth,
                size,
                background,
            },
            setAttributes,
        } = this.props;

        const classes = classnames(
            'maxi-block maxi-svg-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className,
            fullWidth === 'full' ?
                'alignfull' :
                '',
        );

        const sizeValue = !isObject(size) ?
            JSON.parse(size) :
            size;

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBlock
                className={classes}
                data-maxi_initial_block_class={defaultBlockStyle}
                data-align={fullWidth}
            >
                {
                    !SVGElement &&
                    getSVGDefaults(this.props)
                }
                {
                    !!SVGElement &&
                    <Fragment>
                        <__experimentalBackgroundDisplayer
                            backgroundOptions={background}
                        />
                        <ResizableBox
                            className='maxi-block__resizer maxi-svg-block__resizer'
                            size={{
                                width: `${sizeValue.general.width}%`,
                                height: '100%'
                            }}
                            maxWidth='100%'
                            enable={{
                                top: false,
                                right: false,
                                bottom: false,
                                left: false,
                                topRight: true,
                                bottomRight: true,
                                bottomLeft: true,
                                topLeft: true,
                            }}
                            onResizeStop={(event, direction, elt, delta) => {
                                const newScale = Number(((elt.getBoundingClientRect().width / this.getWrapperWidth) * 100).toFixed());
                                sizeValue.general.width = newScale
                                setAttributes({
                                    size: JSON.stringify(sizeValue),
                                });
                            }}
                        >
                            <RawHTML>
                                {SVGElement}
                            </RawHTML>
                        </ResizableBox>
                    </Fragment>
                }
            </__experimentalBlock>
        ];
    }
}

export default withSelect((select, ownProps) => {
    const {
        SVGMediaID,
        imgMediaID
    } = ownProps.attributes;

    const SVGData = select('core').getMedia(SVGMediaID);
    const imgData = select('core').getMedia(imgMediaID);
    let deviceType = select('core/edit-post').__experimentalGetPreviewDeviceType();
    deviceType = deviceType === 'Desktop' ?
        'general' :
        deviceType;

    return {
        SVGData,
        imgData,
        deviceType
    }
})(edit);