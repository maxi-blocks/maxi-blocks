/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { getBlockAttributes } = wp.blocks;

/**
 * External dependencies
 */
import {
    isEmpty,
    isNil,
    isNumber,
    isString
} from 'lodash'

/**
 * Returns default property of the block
 *
 * @param {string} clientId Block's client id
 * @param {string} prop Claimed property to return
 */
export const getDefaultProp = (clientId, prop) => {
    const { getBlockName, getSelectedBlockClientId } = select('core/block-editor');
    const blockName = !!clientId ?
        getBlockName(clientId) :
        getBlockName(getSelectedBlockClientId());

    if (prop)
        return getBlockAttributes(blockName)[prop];
    else
        return getBlockAttributes(blockName);
}

/**
 * Clean BackgroundControl object for being delivered for styling
 *
 * @param {object} background BackgroundControl related object
 *
 * @return {object}
 */
export const getBackgroundObject = background => {
    const response = {
        label: background.label,
        general: {}
    }

    if (!isEmpty(background.colorOptions.color)) {
        response.general['background-color'] = background.colorOptions.color;
    }
    if (!isEmpty(background.colorOptions.gradient)) {
        response.general['background'] = background.colorOptions.gradient;
    }
    if (!isEmpty(background.blendMode)) {
        response.general['background-blend-mode'] = background.blendMode;
    }

    background.backgroundOptions.map(option => {
        if (isNil(option) || isEmpty(option.imageOptions.mediaURL))
            return;
        // Image
        if (option.sizeSettings.size === 'custom' && !isNil(option.imageOptions.cropOptions)) {
            if (!isNil(response.general['background-image']))
                response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.cropOptions.image.source_url}')`;
            else
                response.general['background-image'] = `url('${option.imageOptions.cropOptions.image.source_url}')`;
            if (!isEmpty(background.colorOptions.gradient))
                response.general['background-image'] = `${response.general['background-image']}, ${background.colorOptions.gradient}`;
        }
        else if (option.sizeSettings.size === 'custom' && isNil(option.imageOptions.cropOptions) || option.sizeSettings.size != 'custom' && !isNil(option.imageOptions.mediaURL)) {
            if (!isNil(response.general['background-image']))
                response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.mediaURL}')`;
            else
                response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
            if (!isEmpty(background.colorOptions.gradient))
                response.general['background-image'] = `${response.general['background-image']}, ${background.colorOptions.gradient}`;
        }
        // Size
        if (option.sizeSettings.size != 'custom') {
            if (!isNil(response.general['background-size']))
                response.general['background-size'] = `${response.general['background-size']},${option.sizeSettings.size}`;
            else
                response.general['background-size'] = option.sizeSettings.size;
        }
        else {
            if (!isNil(response.general['background-size']))
                response.general['background-size'] = `${response.general['background-size']},cover`;
            else
                response.general['background-size'] = 'cover';
        }
        // Repeat
        if (option.repeat) {
            if (!isNil(response.general['background-repeat']))
                response.general['background-repeat'] = `${response.general['background-repeat']},${option.repeat}`;
            else
                response.general['background-repeat'] = option.repeat;
        }
        // Position
        if (option.positionOptions.position != 'custom') {
            if (!isNil(response.general['background-position']))
                response.general['background-position'] = `${response.general['background-position']},${option.positionOptions.position}`;
            else
                response.general['background-position'] = option.positionOptions.position;
        }
        else {
            if (!isNil(response.general['background-position']))
                response.general['background-position'] = `
                        ${response.general['background-position']},
                        ${option.positionOptions.width + option.positionOptions.widthUnit} ${option.positionOptions.height + option.positionOptions.heightUnit}`;
            else
                response.general['background-position'] = `${option.positionOptions.width + option.positionOptions.widthUnit} ${option.positionOptions.height + option.positionOptions.heightUnit}`;
        }
        // Origin
        if (option.origin) {
            if (!isNil(response.general['background-origin']))
                response.general['background-origin'] = `${response.general['background-origin']},${option.origin}`;
            else
                response.general['background-origin'] = option.origin;
        }
        // Clip
        if (option.clip) {
            if (!isNil(response.general['background-clip']))
                response.general['background-clip'] = `${response.general['background-clip']},${option.clip}`;
            else
                response.general['background-clip'] = option.clip;
        }
        // Attachment
        if (option.attachment) {
            if (!isNil(response.general['background-attachment']))
                response.general['background-attachment'] = `${response.general['background-attachment']},${option.attachment}`;
            else
                response.general['background-attachment'] = option.attachment;
        }
    })

    return response;
}

export const getBoxShadowObject = boxShadow => {
    const response = {
        label: boxShadow.label,
        general: {},
        xxl: {},
        xl: {},
        l: {},
        m: {},
        s: {},
        xs: {}
    }

    for (let [key, value] of Object.entries(boxShadow)) {
        if (key != 'label') {
            let boxShadowString = '';
            isNumber(value.shadowHorizontal) ? boxShadowString += (value.shadowHorizontal + 'px ') : null;
            isNumber(value.shadowVertical) ? boxShadowString += (value.shadowVertical + 'px ') : null;
            isNumber(value.shadowBlur) ? boxShadowString += (value.shadowBlur + 'px ') : null;
            isNumber(value.shadowSpread) ? boxShadowString += (value.shadowSpread + 'px ') : null;
            !isNil(value.shadowColor) ? boxShadowString += (value.shadowColor) : null;

            response[key]['box-shadow'] = boxShadowString.trim();
        }
    }

    return response;
}

export const getAlignmentTextObject = alignment => {
    const response = {
        label: alignment.label,
        general: {},
        xxl: {},
        xl: {},
        l: {},
        m: {},
        s: {},
        xs: {}
    }

    for (let [key, value] of Object.entries(alignment)) {
        if (!isNil(value.alignment)) {
            switch (value.alignment) {
                case 'left':
                    response[key]['text-align'] = 'left';
                    break;
                case 'center':
                    response[key]['text-align'] = 'center';
                    break;
                case 'right':
                    response[key]['text-align'] = 'right';
                    break;
                case 'justify':
                    response[key]['text-align'] = 'justify';
                    break;
            }
        }
    }

    return response;
}

export const getAlignmentFlexObject = alignment => {
    const response = {
        label: alignment.label,
        general: {},
        xxl: {},
        xl: {},
        l: {},
        m: {},
        s: {},
        xs: {}
    }

    for (let [key, value] of Object.entries(alignment)) {
        if (!isNil(value.alignment)) {
            switch (value.alignment) {
                case 'left':
                    response[key]['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response[key]['align-items'] = 'center';
                    break;
                case 'right':
                    response[key]['align-items'] = 'flex-end';
                    break;
            }
        }
    }

    return response;
}

export const getOpacityObject = opacity => {
    const response = {
        label: opacity.label,
        general: {},
        xxl: {},
        xl: {},
        l: {},
        m: {},
        s: {},
        xs: {}
    }

    for (let [key, value] of Object.entries(opacity)) {
        if (isNumber(value.opacity)) {
            response[key]['opacity'] = value.opacity;
        }
    }

    return response;
}

export const getVideoBackgroundObject = videoOptions => {
    const response = {
        label: 'Video Background',
        general: {}
    }

    if (!isNil(videoOptions.fill))
        response.general['object-fit'] = videoOptions.fill;

    if (!isNil(videoOptions.position))
        response.general['object-position'] = videoOptions.position;

    if (!isNil(videoOptions.width))
        response.general['width'] = `${videoOptions.width}${videoOptions.widthUnit}`;

    if (!isNil(videoOptions.height))
        response.general['height'] = `${videoOptions.height}${videoOptions.heightUnit}`;

    return response;
}

export const getColumnSizeObject = columnSize => {
    const response = {
        label: columnSize.label,
        general: {},
        xxl: {},
        xl: {},
        l: {},
        m: {},
        s: {},
        xs: {}
    }

    for (let [key, value] of Object.entries(columnSize)) {
        if (isNumber(value.size)) {
            response[key]['width'] = `${value.size}%`;
            response[key]['flex-basis'] = `${value.size}%`;
        }
    }

    return response;
}

export const getShapeDividerObject = shapeDivider => {
    const response = {
        label: 'Shape Divider',
        general: {}
    }

    if (!isNil(shapeDivider.opacity))
        response.general['opacity'] = shapeDivider.opacity;

    if (!isNil(shapeDivider.height))
        response.general['height'] = `${shapeDivider.height}${shapeDivider.heightUnit}`;

    return response;
}

export const getShapeDividerSVGObject = shapeDivider => {
    const response = {
        label: 'Shape Divider SVG',
        general: {}
    }

    if (!isEmpty(shapeDivider.colorOptions.color))
        response.general['fill'] = shapeDivider.colorOptions.color;

    return response;
}

export const getTransfromObject = transform => {
    const response = {
        label: 'Transform',
        general: {
            transform: '',
            'transform-origin': ''
        },
        xxl: {
            transform: '',
            'transform-origin': ''
        },
        xl: {
            transform: '',
            'transform-origin': ''
        },
        l: {
            transform: '',
            'transform-origin': ''
        },
        m: {
            transform: '',
            'transform-origin': ''
        },
        s: {
            transform: '',
            'transform-origin': ''
        },
        xs: {
            transform: '',
            'transform-origin': ''
        }
    }

    for (let [key, value] of Object.entries(transform)) {
        if(key === 'label')
            continue;

        if (isNumber(value.scale.scaleX))
            response[key].transform += `scaleX(${value.scale.scaleX / 100}) `;
        if (isNumber(value.scale.scaleY))
            response[key].transform += `scaleY(${value.scale.scaleY / 100}) `;
        if (isNumber(value.translate.translateX))
            response[key].transform += `translateX(${value.translate.translateX}${value.translate.translateXUnit}) `;
        if (isNumber(value.translate.translateY))
            response[key].transform += `translateY(${value.translate.translateY}${value.translate.translateYUnit}) `;
        if (isNumber(value.rotate.rotateX))
            response[key].transform += `rotateX(${value.rotate.rotateX}deg) `;
        if (isNumber(value.rotate.rotateY))
            response[key].transform += `rotateY(${value.rotate.rotateY}deg) `;
        if (isNumber(value.rotate.rotateZ))
            response[key].transform += `rotateZ(${value.rotate.rotateZ}deg) `;
        if (isNumber(value.origin.originX))
            response[key]['transform-origin'] += `${value.origin.originX}% `;
        if (isNumber(value.origin.originY))
            response[key]['transform-origin'] += `${value.origin.originY}% `;
        if (isString(value.origin.originX))
            response[key]['transform-origin'] += `${value.origin.originX} `;
        if (isString(value.origin.originY))
            response[key]['transform-origin'] += `${value.origin.originY} `;
    }

    return response;
}