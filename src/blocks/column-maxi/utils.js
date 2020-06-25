/**
 * External dependencies 
 */
import {
    isEmpty,
    isNil,
} from 'lodash';

/**
 * Functions
 */
export const getBackgroundObject = object => {
    const response = {
        label: object.label,
        general: {}
    }

    if (!isEmpty(object.colorOptions.color)) {
        response.general['background-color'] = object.colorOptions.color;
    }
    if (!isEmpty(object.colorOptions.gradient)) {
        response.general['background'] = object.colorOptions.gradient;
    }
    if (!isEmpty(object.blendMode)) {
        response.general['background-blend-mode'] = object.blendMode;
    }

    object.backgroundOptions.map(option => {
        if (isNil(option) || isEmpty(option.imageOptions.mediaURL))
            return;
        // Image
        if (option.sizeSettings.size === 'custom' && !isNil(option.imageOptions.cropOptions)) {
            if (!isNil(response.general['background-image']))
                response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.cropOptions.image.source_url}')`;
            else
                response.general['background-image'] = `url('${option.imageOptions.cropOptions.image.source_url}')`;
            if (!isEmpty(object.colorOptions.gradient))
                response.general['background-image'] = `${response.general['background-image']}, ${object.colorOptions.gradient}`;
        }
        else if (option.sizeSettings.size === 'custom' && isNil(option.imageOptions.cropOptions) || option.sizeSettings.size != 'custom' && !isNil(option.imageOptions.mediaURL)) {
            if (!isNil(response.general['background-image']))
                response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.mediaURL}')`;
            else
                response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
            if (!isEmpty(object.colorOptions.gradient))
                response.general['background-image'] = `${response.general['background-image']}, ${object.colorOptions.gradient}`;
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

export const getBoxShadowObject = object => {
    let boxShadow = '';
    object.shadowHorizontal ? boxShadow += (object.shadowHorizontal + 'px ') : null;
    object.shadowVertical ? boxShadow += (object.shadowVertical + 'px ') : null;
    object.shadowBlur ? boxShadow += (object.shadowBlur + 'px ') : null;
    object.shadowSpread ? boxShadow += (object.shadowSpread + 'px ') : null;
    object.shadowColor ? boxShadow += (object.shadowColor) : null;
    boxShadow = boxShadow.trim();

    const response = {
        label: object.label,
        general: {
            "box-shadow": boxShadow
        }
    }

    return response;
}