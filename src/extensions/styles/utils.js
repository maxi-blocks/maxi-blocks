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
    isNumber
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
 * @param {object} backgroundObject BackgroundControl related object
 * 
 * @return {object}
 */
export const getBackgroundObject = backgroundObject => {
    const response = {
        label: backgroundObject.label,
        general: {}
    }

    if (!isEmpty(backgroundObject.colorOptions.color)) {
        response.general['background-color'] = backgroundObject.colorOptions.color;
    }
    if (!isEmpty(backgroundObject.colorOptions.gradient)) {
        response.general['background'] = backgroundObject.colorOptions.gradient;
    }
    if (!isEmpty(backgroundObject.blendMode)) {
        response.general['background-blend-mode'] = backgroundObject.blendMode;
    }

    backgroundObject.backgroundOptions.map(option => {
        if (isNil(option) || isEmpty(option.imageOptions.mediaURL))
            return;
        // Image
        if (option.sizeSettings.size === 'custom' && !isNil(option.imageOptions.cropOptions)) {
            if (!isNil(response.general['background-image']))
                response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.cropOptions.image.source_url}')`;
            else
                response.general['background-image'] = `url('${option.imageOptions.cropOptions.image.source_url}')`;
            if (!isEmpty(backgroundObject.colorOptions.gradient))
                response.general['background-image'] = `${response.general['background-image']}, ${backgroundObject.colorOptions.gradient}`;
        }
        else if (option.sizeSettings.size === 'custom' && isNil(option.imageOptions.cropOptions) || option.sizeSettings.size != 'custom' && !isNil(option.imageOptions.mediaURL)) {
            if (!isNil(response.general['background-image']))
                response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.mediaURL}')`;
            else
                response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
            if (!isEmpty(backgroundObject.colorOptions.gradient))
                response.general['background-image'] = `${response.general['background-image']}, ${backgroundObject.colorOptions.gradient}`;
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

export const getBoxShadowObject = boxShadowObject => {
    const response = {
        label: boxShadowObject.label,
        general: {}
    }

    let boxShadowString = '';
    isNumber(boxShadowObject.shadowHorizontal) ? boxShadowString += (boxShadowObject.shadowHorizontal + 'px ') : null;
    isNumber(boxShadowObject.shadowVertical) ? boxShadowString += (boxShadowObject.shadowVertical + 'px ') : null;
    isNumber(boxShadowObject.shadowBlur) ? boxShadowString += (boxShadowObject.shadowBlur + 'px ') : null;
    isNumber(boxShadowObject.shadowSpread) ? boxShadowString += (boxShadowObject.shadowSpread + 'px ') : null;
    boxShadowObject.shadowColor ? boxShadowString += (boxShadowObject.shadowColor) : null;

    response.general['box-shadow'] = boxShadowString.trim()

    return response;
}