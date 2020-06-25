/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Placeholder, PlainText } = wp.components;
const { withSelect } = wp.data;
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
import MaxiModalIcon from './modal';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add( fas, fab, far );

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
} from 'lodash';

/**
 * Icons
 */
import {
    toolbarReplaceImage,
    placeholderImage
} from '../../icons';

/**
 * Content
 */
class edit extends GXBlock {
    componentDidUpdate() {
        this.displayStyles();
    }

    get getWrapperWidth() {
        const target = document.getElementById(`block-${this.props.clientId}`);
        if (!target)
            return;

        return target.getBoundingClientRect().width;
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        if (this.type === 'normal')
            return `${this.props.attributes.uniqueID}`;
        if (this.type === 'hover')
            return `${this.props.attributes.uniqueID}:hover`;
        if (this.type === 'image')
            return `${this.props.attributes.uniqueID}>img`;
        if (this.type === 'figcaption')
            return `${this.props.attributes.uniqueID}>figcaption`;
    }

    get getObject() {
        if (this.type === 'normal')
            return this.getNormalObject;
        if (this.type === 'hover')
            return this.getHoverObject;
        if (this.type === 'image')
            return this.getImageObject;
        if (this.type === 'figcaption')
            return this.getFigcaptionObject;
    }

    get getNormalObject() {
        const {
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
            opacity,
            background,
            boxShadow,
            border,
            padding,
            margin
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
        };

        if (!isNil(alignmentDesktop)) {
            switch (alignmentDesktop) {
                case 'left':
                    response.image.desktop['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.desktop['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.desktop['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!isNil(alignmentTablet)) {
            switch (alignmentTablet) {
                case 'left':
                    response.image.tablet['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.tablet['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.tablet['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!isNil(alignmentMobile)) {
            switch (alignmentMobile) {
                case 'left':
                    response.image.mobile['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.mobile['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.mobile['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!!opacity)
            response.image.general['opacity'] = opacity;

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            backgroundHover,
            boxShadowHover
        } = this.props.attributes;

        const response = {
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            imageHover: {
                label: 'Image Hover',
                general: {}
            }
        }
        if (opacityHover)
            response.imageHover.general['opacity'] = opacityHover;

        return response;
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        this.saveMeta('normal');
        this.saveMeta('hover');
        this.saveMeta('image');
        this.saveMeta('figcaption')

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
                fullWidth,
                size,
                width,
                content
            },
            setAttributes,
            clientId,
            attributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-icon-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );

        return [
        <Fragment>
            <Fragment><FontAwesomeIcon icon={['fab', 'google']} /></Fragment>
            <Fragment><FontAwesomeIcon icon={['fab', '500px']} /></Fragment>
            <Fragment><FontAwesomeIcon icon={['fab', 'android']} /></Fragment>
            </Fragment>
        ];
    }
}

export default edit;