function renderImagePosition(param) {
    switch (param) {
        case 'left':
            return 'row';
        case 'right':
            return 'row-reverse';
        case 'bottom':
            return 'column-reverse';
        case 'top':
            return 'column';
        default:
            return 'column';
    }
}

export const setLinkStyles = ( props ) => {
    const {
        imagePosition
    } = props.attributes;

    return {
        flexDirection: renderImagePosition(imagePosition),
    }
}

export const setTitleStyles = ( props ) => {
    const {
        titleColor,
        titleFontFamily,
        fontSizeTitle,
        fontSizeTitleUnit,
        lineHeightTitleDesktop,
        lineHeightTitleUnit,
        fontWeightTitleDesktop,
        textTransformTitleDesktop,
        fontStyleTitleDesktop,
        textDecorationTitleDesktop,
        letterSpacingTitleDesktop,
    } = props.attributes;

    return {
        color: titleColor ? titleColor : undefined,
        fontFamily: titleFontFamily,
        fontSize: fontSizeTitle ? (fontSizeTitle + fontSizeTitleUnit) : undefined,
        lineHeight: lineHeightTitleDesktop ? (lineHeightTitleDesktop + lineHeightTitleUnit) : undefined,
        fontWeight: fontWeightTitleDesktop ? fontWeightTitleDesktop : undefined,
        textTransform: textTransformTitleDesktop ? textTransformTitleDesktop : undefined,
        fontStyle: fontStyleTitleDesktop ? fontStyleTitleDesktop : undefined,
        textDecoration: textDecorationTitleDesktop ? textDecorationTitleDesktop : undefined,
        letterSpacing: letterSpacingTitleDesktop ? (letterSpacingTitleDesktop + letterSpacingTitleUnit) : undefined,
    }
}

export const setSubTitleStyles = ( props ) => {
    const {
        subTitleColor
    } = props.attributes;

    return {
        color: subTitleColor ? subTitleColor : undefined,
    }
}

export const setDescriptionStyles = ( props ) => {
    const {
        descriptionColor
    } = props.attributes;

    return {
        color: descriptionColor ? descriptionColor : undefined,
    }
}

export const setButtonHoverStyles = ( props ) => {
    const {
        buttonHoverColor,
        buttonHoverBgColor,
    } = props.attributes;

    return {
        color: buttonHoverColor ? buttonHoverColor : undefined,
        backgroundColor: buttonHoverBgColor ? buttonHoverBgColor : undefined,
    }
}

export const setBlockStyles = ( props ) => {
    const {
        backgroundColor,
        backgroundGradient,
        // borderWidth,
        // borderRadius,
        blockBorderColor,
        borderType,
        lineHeight,
        letterSpacing,
        blockWidth,
        widthUnit,
        maxWidthUnit,
        maxWidth,
        minWidth,
        minWidthUnit,
        heightUnit,
        blockHeight,
        maxHeight,
        minHeight,
        maxHeightUnit,
        minHeightUnit,
        backgroundImage,
        textTransform
    } = props.attributes;

    return {
        background: backgroundGradient ? 
            backgroundGradient : 
            backgroundColor ? 
                backgroundColor : backgroundImage ? backgroundImage : undefined,
        borderColor: blockBorderColor ? blockBorderColor : undefined,
        borderStyle: borderType ? borderType : undefined,
        lineHeight: lineHeight ? lineHeight + '%' : undefined,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
        width: blockWidth ? (blockWidth + widthUnit) : undefined,
        maxWidth: maxWidth ? (maxWidth + maxWidthUnit) : undefined,
        minWidth: minWidth ? (minWidth + minWidthUnit) : undefined,
        height: blockHeight ? (blockHeight + heightUnit) : undefined,
        maxHeight: maxHeight ? (maxHeight + maxHeightUnit) : undefined,
        minHeight: minHeight ? (minHeight + minHeightUnit) : undefined,
        textTransform: textTransform ? textTransform : undefined,
    }

};