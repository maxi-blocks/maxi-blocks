const { __ } = wp.i18n;

export const buttonShapes = [
	{
		value: 'gx-square',
		label: __('Square')
	},
	{
		value: 'gx-circular',
		label: __('Circular')
	},
];

export const animationsClasses = [
	{
		value: '',
		label: __('None')
	},
	{
		value: 'gx-grow',
		label: __('Grow')
	},
	{
		value: 'gx-shrink',
		label: __('Shrink')
	},
	{
		value: 'gx-pulse',
		label: __('Pulse')
	},
	{
		value: 'gx-pulse-grow',
		label: __('Pulse Grow')
	},
	{
		value: 'gx-pulse-shrink',
		label: __('Pulse Shrink')
	},
	{
		value: 'gx-push',
		label: __('Push')
	},
	{
		value: 'gx-pop',
		label: __('Pop')
	},
	{
		value: 'gx-bounce-in',
		label: __('Bounce In')
	},
	{
		value: 'gx-bounce-out',
		label: __('Bounce Out')
	},
	{
		value: 'gx-rotate',
		label: __('Rotate')
	},
	{
		value: 'gx-float',
		label: __('Float')
	},
	{
		value: 'gx-sink',
		label: __('Sink')
	},
	{
		value: 'gx-bob',
		label: __('Bob')
	},
	{
		value: 'gx-hang',
		label: __('Hang')
	},
	{
		value: 'gx-skew',
		label: __('Skew')
	},
	{
		value: 'gx-skew-forward',
		label: __('Skew Forward')
	},
	{
		value: 'gx-skew-backward',
		label: __('Skew Backward')
	},
	{
		value: 'gx-wobble-horizontal',
		label: __('Wobble Horizontal')
	},
	{
		value: 'gx-wobble-vertical',
		label: __('Wobble Vertical')
	},
	{
		value: 'gx-wobble-to-bottom-right',
		label: __('Wobble Bottom Right')
	},
	{
		value: 'gx-wobble-to-top-right',
		label: __('Wobble Top Right')
	},
	{
		value: 'gx-wobble-top',
		label: __('Wobble Top')
	},
	{
		value: 'gx-wobble-bottom',
		label: __('Wobble Bottom')
	},
	{
		value: 'gx-wobble-skew',
		label: __('Wobble Skew')
	},
	{
		value: 'gx-buzz-out',
		label: __('Buzz Out')
	},
	{
		value: 'gx-forward',
		label: __('Forward')
	},
	{
		value: 'gx-backward',
		label: __('Backward')
	},
	{
		value: 'gx-fade',
		label: __('Fade')
	},
	{
		value: 'gx-back-pulse',
		label: __('Back Pulse')
	},
];

export const buttonSizes = [
	{
		value: 'gx-small',
		label: __('Small')
	},
	{
		value: 'gx-normal',
		label: __('Normal')
	},
	{
		value: 'gx-large',
		label: __('Large')
	},
	{
		value: 'gx-x-large',
		label: __('Extra Large')
	},
];

export const transitionTypes = [
	{
		value: '',
		label: __('None')
	},
	{
		value: 'ease',
		label: __('ease')
	},
	{
		value: 'linear',
		label: __('linear')
	},
	{
		value: 'ease-in',
		label: __('ease-in')
	},
	{
		value: 'ease-in-out',
		label: __('ease-in-out')
	},
];

export const setNameSurnameStyles = ( props ) => {
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

// set up testimonial block styles
export const setBlockStyles = ( props ) => {
	const {
		// backgroundColor,
		// borderWidth,
		// borderRadius,
		// blockBorderColor,
		// borderType,
		// lineHeight,
		// letterSpacing,
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
		// textTransform,
		paddingUnit,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		marginUnit,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		// borderRadiusUnit,
		// borderRadiusTopLeft,
		// borderRadiusTopRight,
		// borderRadiusBottomRight,
		// borderRadiusBottomLeft,
		// borderWidthUnit,
		// borderWidthTop,
		// borderWidthRight,
		// borderWidthBottom,
		// borderWidthLeft,
	} = props.attributes;

	return {
		// backgroundColor: backgroundColor ? backgroundColor : undefined,
		// borderWidth: borderWidth ? borderWidth + 'px' : undefined,
		// borderRadius: borderRadius ? borderRadius + 'px' : undefined,
		// borderColor: blockBorderColor ? blockBorderColor : undefined,
		// borderStyle: borderType ? borderType : undefined,
		// lineHeight: lineHeight ? lineHeight + '%' : undefined,
		// letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
		maxWidth: maxWidth ? (maxWidth + maxWidthUnit) : undefined,
		width: blockWidth ? (blockWidth + widthUnit) : undefined,
		minWidth: minWidth ? (minWidth + minWidthUnit) : undefined,
		maxHeight: maxHeight ? (maxHeight + maxHeightUnit) : undefined,
		height: blockHeight ? (blockHeight + heightUnit) : undefined,
		minHeight: minHeight ? (minHeight + minHeightUnit) : undefined,
		// textTransform: textTransform ? textTransform : undefined,
		paddingTop: paddingTop ? (paddingTop + paddingUnit) : undefined,
		paddingRight: paddingRight ? (paddingRight + paddingUnit) : undefined,
		paddingBottom: paddingBottom ? (paddingBottom + paddingUnit) : undefined,
		paddingLeft: paddingLeft ? (paddingLeft + paddingUnit) : undefined,
		marginTop: marginTop ? (marginTop + marginUnit) : undefined,
		marginRight: marginRight ? (marginRight + marginUnit) : undefined,
		marginBottom: marginBottom ? (marginBottom + marginUnit) : undefined,
		marginLeft: marginLeft ? (marginLeft + marginUnit) : undefined,
		// borderTopLeftRadius: borderRadiusTopLeft ? (borderRadiusTopLeft + borderRadiusUnit) : undefined,
		// borderTopRightRadius: borderRadiusTopRight ? (borderRadiusTopRight + borderRadiusUnit) : undefined,
		// borderBottomRightRadius: borderRadiusBottomRight ? (borderRadiusBottomRight + borderRadiusUnit) : undefined,
		// borderBottomLeftRadius: borderRadiusBottomLeft ? (borderRadiusBottomLeft + borderRadiusUnit) : undefined,
		// borderTopWidth: borderWidthTop ? (borderWidthTop + borderWidthUnit) : undefined,
		// borderRightWidth: borderWidthRight ? (borderWidthRight + borderWidthUnit) : undefined,
		// borderBottomWidth: borderWidthBottom ? (borderWidthBottom + borderWidthUnit) : undefined,
		// borderLeftWidth: borderWidthLeft ? (borderWidthLeft + borderWidthUnit) : undefined,
	}

};