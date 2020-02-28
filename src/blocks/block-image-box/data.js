function renderImagePosition(param) {
    switch(param) {
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

export const linkStyles = {
    flexDirection: renderImagePosition(imagePosition),
}

export const titleStyles = {
    color: titleColor ? titleColor : undefined,
    fontFamily: titleFontFamily,
    fontSize: fontSizeTitle ? (fontSizeTitle + fontSizeTitleUnit) : undefined,
}

export const subTitleStyles = {
    color: subTitleColor ? subTitleColor : undefined,
}

export const descriptionStyles = {
    color: descriptionColor ? descriptionColor : undefined,
}

export const buttonStyles = {
    color: buttonColor ? buttonColor : undefined,
    backgroundColor:  buttonBgColor ? buttonBgColor : undefined,
}

export const blockStyles = {
    backgroundColor: backgroundColor ? backgroundColor : undefined,
    borderWidth: borderWidth ? borderWidth + 'px' : undefined,
    borderRadius: borderRadius ? borderRadius + 'px' : undefined,
    borderColor: borderColor ? borderColor : undefined,
    borderStyle: borderType ? borderType : undefined,
    lineHeight: lineHeight ? lineHeight + '%' : undefined,
    letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
    width: blockWidth ? (blockWidth + widthUnit) : undefined,
    maxWidth: maxWidth ? (maxWidth + maxWidthUnit) : undefined,
    minWidth: minWidth ? (minWidth + minWidthUnit) : undefined,
    height: blockHeight ? (blockHeight + heightUnite) : undefined,
    maxHeight: maxHeight ? (maxHeight + maxHeightUnit) : undefined,
    minHeight: minHeight ? (minHeight + minHeightUnit) : undefined,
    textTransform: textTransform ? textTransform: undefined,
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
};

export const blockFonts = [
    titleFontFamily
];