const { __ } = wp.i18n;

export const buttonShapes = [
	{
		value: 'maxi-square',
		label: __('Square')
	},
	{
		value: 'maxi-circular',
		label: __('Circular')
	},
];

export const animationsClasses = [
	{
		value: '',
		label: __('None')
	},
	{
		value: 'maxi-grow',
		label: __('Grow')
	},
	{
		value: 'maxi-shrink',
		label: __('Shrink')
	},
	{
		value: 'maxi-pulse',
		label: __('Pulse')
	},
	{
		value: 'maxi-pulse-grow',
		label: __('Pulse Grow')
	},
	{
		value: 'maxi-pulse-shrink',
		label: __('Pulse Shrink')
	},
	{
		value: 'maxi-push',
		label: __('Push')
	},
	{
		value: 'maxi-pop',
		label: __('Pop')
	},
	{
		value: 'maxi-bounce-in',
		label: __('Bounce In')
	},
	{
		value: 'maxi-bounce-out',
		label: __('Bounce Out')
	},
	{
		value: 'maxi-rotate',
		label: __('Rotate')
	},
	{
		value: 'maxi-float',
		label: __('Float')
	},
	{
		value: 'maxi-sink',
		label: __('Sink')
	},
	{
		value: 'maxi-bob',
		label: __('Bob')
	},
	{
		value: 'maxi-hang',
		label: __('Hang')
	},
	{
		value: 'maxi-skew',
		label: __('Skew')
	},
	{
		value: 'maxi-skew-forward',
		label: __('Skew Forward')
	},
	{
		value: 'maxi-skew-backward',
		label: __('Skew Backward')
	},
	{
		value: 'maxi-wobble-horizontal',
		label: __('Wobble Horizontal')
	},
	{
		value: 'maxi-wobble-vertical',
		label: __('Wobble Vertical')
	},
	{
		value: 'maxi-wobble-to-bottom-right',
		label: __('Wobble Bottom Right')
	},
	{
		value: 'maxi-wobble-to-top-right',
		label: __('Wobble Top Right')
	},
	{
		value: 'maxi-wobble-top',
		label: __('Wobble Top')
	},
	{
		value: 'maxi-wobble-bottom',
		label: __('Wobble Bottom')
	},
	{
		value: 'maxi-wobble-skew',
		label: __('Wobble Skew')
	},
	{
		value: 'maxi-buzz-out',
		label: __('Buzz Out')
	},
	{
		value: 'maxi-forward',
		label: __('Forward')
	},
	{
		value: 'maxi-backward',
		label: __('Backward')
	},
	{
		value: 'maxi-fade',
		label: __('Fade')
	},
	{
		value: 'maxi-back-pulse',
		label: __('Back Pulse')
	},
];

export const buttonSizes = [
	{
		value: 'maxi-small',
		label: __('Small')
	},
	{
		value: 'maxi-normal',
		label: __('Normal')
	},
	{
		value: 'maxi-large',
		label: __('Large')
	},
	{
		value: 'maxi-x-large',
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