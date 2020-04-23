export const setBlockStyles = ( props ) => {
    const {
        backgroundColor,
        blockBorderColor,
        borderType,
        lineHeight,
        letterSpacing,
        blockWidth,
        widthUnit,
        maxWidthUnit,
        maxWidth,
        minWidthUnit,
        minWidth,
        heightUnit,
        blockHeight,
        maxHeightUnit,
        maxHeight,
        minHeightUnit,
        minHeight,
        textTransform,
    } = props.attributes;

    return {
        background: backgroundColor ? backgroundColor : undefined,
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
