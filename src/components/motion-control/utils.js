/**
 * WordPress dependencies
 */
const { Icon } = wp.components;

/**
 * Styles and icons
 */
import * as motionIcons from '../../icons';

export const verticalPresets = (verticalOptions) => {
    let response = [];
    if(verticalOptions.direction === 'up') {
        response = [
            { label: <Icon icon={motionIcons.motionVerticalTop1} />, value: 'preset_1' },
            { label: <Icon icon={motionIcons.motionVerticalTop2} />, value: 'preset_2' },
            { label: <Icon icon={motionIcons.motionVerticalTop3} />, value: 'preset_3' },
            { label: <Icon icon={motionIcons.motionVerticalTop4} />, value: 'preset_4' },
            { label: <Icon icon={motionIcons.motionVerticalTop5} />, value: 'preset_5' },
        ];
    }
    if(verticalOptions.direction === 'down') {
        response = [
            { label: <Icon icon={motionIcons.motionVerticalDown1} />, value: 'preset_6' },
            { label: <Icon icon={motionIcons.motionVerticalDown2} />, value: 'preset_7' },
            { label: <Icon icon={motionIcons.motionVerticalDown3} />, value: 'preset_8' },
            { label: <Icon icon={motionIcons.motionVerticalDown4} />, value: 'preset_9' },
            { label: <Icon icon={motionIcons.motionVerticalDown5} />, value: 'preset_10' },
        ];
    }

    return response;
}

export const horizontalPresets = (horizontalOptions) => {
    let response = [];
    if(horizontalOptions.direction === 'left') {
        response = [
            { label: <Icon icon={motionIcons.motionHorizontalLeft1} />, value: 'preset_1' },
            { label: <Icon icon={motionIcons.motionHorizontalLeft2} />, value: 'preset_2' },
            { label: <Icon icon={motionIcons.motionHorizontalLeft3} />, value: 'preset_3' },
            { label: <Icon icon={motionIcons.motionHorizontalLeft4} />, value: 'preset_4' },
            { label: <Icon icon={motionIcons.motionHorizontalLeft5} />, value: 'preset_5' },
        ];
    }
    if(horizontalOptions.direction === 'right') {
        response = [
            { label: <Icon icon={motionIcons.motionHorizontalRight1} />, value: 'preset_6' },
            { label: <Icon icon={motionIcons.motionHorizontalRight2} />, value: 'preset_7' },
            { label: <Icon icon={motionIcons.motionHorizontalRight3} />, value: 'preset_8' },
            { label: <Icon icon={motionIcons.motionHorizontalRight4} />, value: 'preset_9' },
            { label: <Icon icon={motionIcons.motionHorizontalRight5} />, value: 'preset_10' },
        ];
    }

    return response;
}

export const scalePresets = (scaleOptions) => {
    let response = [];
    if(scaleOptions.direction === 'up') {
        response = [
            { label: <Icon icon={motionIcons.motionScaleUp1} />, value: 'preset_1' },
            { label: <Icon icon={motionIcons.motionScaleUp2} />, value: 'preset_2' },
            { label: <Icon icon={motionIcons.motionScaleUp3} />, value: 'preset_3' },
            { label: <Icon icon={motionIcons.motionScaleUp4} />, value: 'preset_4' },
            { label: <Icon icon={motionIcons.motionScaleUp5} />, value: 'preset_5' },
        ];
    }
    if(scaleOptions.direction === 'down') {
        response = [
            { label: <Icon icon={motionIcons.motionScaleDown1} />, value: 'preset_6' },
            { label: <Icon icon={motionIcons.motionScaleDown2} />, value: 'preset_7' },
            { label: <Icon icon={motionIcons.motionScaleDown3} />, value: 'preset_8' },
            { label: <Icon icon={motionIcons.motionScaleDown4} />, value: 'preset_9' },
            { label: <Icon icon={motionIcons.motionScaleDown5} />, value: 'preset_10' },
        ];
    }

    return response;
}

export const rotatePresets = (rotateOptions) => {
    let response = [];
    if(rotateOptions.direction === 'left') {
        response = [
            { label: <Icon icon={motionIcons.motionRotateLeft1} />, value: 'preset_1' },
            { label: <Icon icon={motionIcons.motionRotateLeft2} />, value: 'preset_2' },
            { label: <Icon icon={motionIcons.motionRotateLeft3} />, value: 'preset_3' },
            { label: <Icon icon={motionIcons.motionRotateLeft4} />, value: 'preset_4' },
            { label: <Icon icon={motionIcons.motionRotateLeft5} />, value: 'preset_5' },
        ];
    }
    if(rotateOptions.direction === 'right') {
        response = [
            { label: <Icon icon={motionIcons.motionRotateRight1} />, value: 'preset_6' },
            { label: <Icon icon={motionIcons.motionRotateRight2} />, value: 'preset_7' },
            { label: <Icon icon={motionIcons.motionRotateRight3} />, value: 'preset_8' },
            { label: <Icon icon={motionIcons.motionRotateRight4} />, value: 'preset_9' },
            { label: <Icon icon={motionIcons.motionRotateRight5} />, value: 'preset_10' },
        ];
    }

    return response;
}

export const fadePresets = (fadeOptions) => {
    let response = [];
    if(fadeOptions.direction === 'in') {
        response = [
            { label: <Icon icon={motionIcons.motionFadeIn1} />, value: 'preset_1' },
            { label: <Icon icon={motionIcons.motionFadeIn2} />, value: 'preset_2' },
            { label: <Icon icon={motionIcons.motionFadeIn3} />, value: 'preset_3' },
            { label: <Icon icon={motionIcons.motionFadeIn4} />, value: 'preset_4' },
            { label: <Icon icon={motionIcons.motionFadeIn5} />, value: 'preset_5' },
        ];
    }
    if(fadeOptions.direction === 'out') {
        response = [
            { label: <Icon icon={motionIcons.motionFadeOut1} />, value: 'preset_6' },
            { label: <Icon icon={motionIcons.motionFadeOut2} />, value: 'preset_7' },
            { label: <Icon icon={motionIcons.motionFadeOut3} />, value: 'preset_8' },
            { label: <Icon icon={motionIcons.motionFadeOut4} />, value: 'preset_9' },
            { label: <Icon icon={motionIcons.motionFadeOut5} />, value: 'preset_10' },
        ];
    }

    return response;
}

export const blurPresets = (blurOptions) => {
    let response = [];
    if(blurOptions.direction === 'in') {
        response = [
            { label: <Icon icon={motionIcons.motionBlurIn1} />, value: 'preset_1' },
            { label: <Icon icon={motionIcons.motionBlurIn2} />, value: 'preset_2' },
            { label: <Icon icon={motionIcons.motionBlurIn3} />, value: 'preset_3' },
            { label: <Icon icon={motionIcons.motionBlurIn4} />, value: 'preset_4' },
            { label: <Icon icon={motionIcons.motionBlurIn5} />, value: 'preset_5' },
        ];
    }
    if(blurOptions.direction === 'out') {
        response = [
            { label: <Icon icon={motionIcons.motionBlurOut1} />, value: 'preset_6' },
            { label: <Icon icon={motionIcons.motionBlurOut2} />, value: 'preset_7' },
            { label: <Icon icon={motionIcons.motionBlurOut3} />, value: 'preset_8' },
            { label: <Icon icon={motionIcons.motionBlurOut4} />, value: 'preset_9' },
            { label: <Icon icon={motionIcons.motionBlurOut5} />, value: 'preset_10' },
        ];
    }

    return response;
}