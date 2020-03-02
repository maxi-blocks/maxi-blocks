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
        fontSizeTitleUnit
    } = props.attributes;

    return {
        color: titleColor ? titleColor : undefined,
        fontFamily: titleFontFamily,
        fontSize: fontSizeTitle ? (fontSizeTitle + fontSizeTitleUnit) : undefined,
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

export const setButtonStyles = ( props ) => {
    const {
        buttonColor,
        buttonBgColor
    } = props.attributes;

    return {
        color: buttonColor ? buttonColor : undefined,
        backgroundColor: buttonBgColor ? buttonBgColor : undefined,
    }
}

export const setBlockStyles = ( props ) => {
    const {
        backgroundColor,
        borderWidth,
        borderRadius,
        blockBorderColor,
        borderType,
        lineHeight,
        letterSpacing,
        blockWidth,
        maxWidth,
        minWidth,
        heightUnit,
        blockHeight,
        maxHeight,
        minHeight,
        textTransform
    } = props.attributes;

    return {
        backgroundColor: backgroundColor ? backgroundColor : undefined,
        borderWidth: borderWidth ? borderWidth + 'px' : undefined,
        borderRadius: borderRadius ? borderRadius + 'px' : undefined,
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
        // paddingTop: paddingTop ? (paddingTop + paddingUnit) : undefined,
        // paddingRight: paddingRight ? (paddingRight + paddingUnit) : undefined,
        // paddingBottom: paddingBottom ? (paddingBottom + paddingUnit) : undefined,
        // paddingLeft: paddingLeft ? (paddingLeft + paddingUnit) : undefined,
        // marginTop: marginTop ? (marginTop + marginUnit) : undefined,
        // marginRight: marginRight ? (marginRight + marginUnit) : undefined,
        // marginBottom: marginBottom ? (marginBottom + marginUnit) : undefined,
        // marginLeft: marginLeft ? (marginLeft + marginUnit) : undefined,
        // borderTopLeftRadius: borderRadiusTopLeft ? (borderRadiusTopLeft + borderRadiusUnit) : undefined,
        // borderTopRightRadius: borderRadiusTopRight ? (borderRadiusTopRight + borderRadiusUnit) : undefined,
        // borderBottomRightRadius: borderRadiusBottomRight ? (borderRadiusBottomRight + borderRadiusUnit) : undefined,
        // borderBottomLeftRadius: borderRadiusBottomLeft ? (borderRadiusBottomLeft + borderRadiusUnit) : undefined,
    }

};