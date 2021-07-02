/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

const getPaletteClasses = (attributes, parentBlockStyle) => {
	const typographyClass =
		attributes['palette-color-status-general'] &&
		attributes['palette-color-general']
			? `maxi-sc-${parentBlockStyle}-typography-color-${attributes['palette-color-general']}`
			: null;
	const typographyClassHover =
		attributes['typography-status-hover'] &&
		attributes['palette-color-status-general-hover'] &&
		attributes['palette-color-general-hover']
			? `maxi-sc-${parentBlockStyle}-typography-hover-color-${attributes['palette-color-general-hover']}`
			: null;
	const backgroundClass =
		attributes['background-active-media'] === 'color' &&
		attributes['background-palette-color-status'] &&
		attributes['background-palette-color']
			? `maxi-sc-${parentBlockStyle}-background-color-${attributes['background-palette-color']}`
			: null;
	const backgroundHoverClass =
		attributes['background-status-hover'] &&
		attributes['background-active-media-hover'] === 'color' &&
		attributes['background-palette-color-status-hover'] &&
		attributes['background-palette-color-hover']
			? `maxi-sc-${parentBlockStyle}-background-hover-color-${attributes['background-palette-color-hover']}`
			: null;
	const svgBackgroundClass =
		attributes['background-active-media'] === 'svg' &&
		attributes['background-palette-svg-color-status'] &&
		attributes['background-palette-svg-color'] &&
		`maxi-sc-${parentBlockStyle}-svg-background-color-${attributes['background-palette-svg-color']}`;
	const borderClass =
		attributes['border-style-general'] &&
		attributes['border-style-general'] !== 'none' &&
		attributes['border-palette-color-status-general'] &&
		attributes['border-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-border-color-${attributes['border-palette-color-general']}`
			: null;
	const borderClassHover =
		attributes['border-status-hover'] &&
		attributes['border-style-general-hover'] &&
		attributes['border-style-general-hover'] !== 'none' &&
		attributes['border-palette-color-status-general-hover'] &&
		attributes['border-palette-color-general-hover']
			? `maxi-sc-${parentBlockStyle}-border-hover-color-${attributes['border-palette-color-general-hover']}`
			: null;
	const boxShadowClass =
		!isNil(attributes['box-shadow-blur-general']) &&
		!isNil(attributes['box-shadow-horizontal-general']) &&
		!isNil(attributes['box-shadow-vertical-general']) &&
		!isNil(attributes['box-shadow-spread-general']) &&
		attributes['box-shadow-palette-color-status-general'] &&
		attributes['box-shadow-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-box-shadow-color-${attributes['box-shadow-palette-color-general']}`
			: null;
	const boxShadowClassHover =
		attributes['box-shadow-status-hover'] &&
		!isNil(attributes['box-shadow-blur-general-hover']) &&
		!isNil(attributes['box-shadow-horizontal-general-hover']) &&
		!isNil(attributes['box-shadow-vertical-general-hover']) &&
		!isNil(attributes['box-shadow-spread-general-hover']) &&
		attributes['box-shadow-palette-color-status-general-hover'] &&
		attributes['box-shadow-palette-color-general-hover']
			? `maxi-sc-${parentBlockStyle}-box-shadow-hover-color-${attributes['box-shadow-palette-color-general-hover']}`
			: null;
	const shapeDividerTopClass =
		attributes['shape-divider-top-status'] &&
		attributes['shape-divider-palette-top-color-status'] &&
		attributes['shape-divider-palette-top-color']
			? `maxi-sc-${parentBlockStyle}-shape-divider-top-color-${attributes['shape-divider-palette-top-color']}`
			: null;
	const shapeDividerBottomClass =
		attributes['shape-divider-bottom-status'] &&
		attributes['shape-divider-palette-bottom-color-status'] &&
		attributes['shape-divider-palette-bottom-color']
			? `maxi-sc-${parentBlockStyle}-shape-divider-bottom-color-${attributes['shape-divider-palette-bottom-color']}`
			: null;
	const dividerClass =
		attributes['divider-border-style'] !== 'none' &&
		!isEmpty(attributes['divider-border-style']) &&
		attributes['divider-border-style'] !== 'none' &&
		attributes['divider-palette-border-color-status'] &&
		attributes['divider-palette-border-color']
			? `maxi-sc-${parentBlockStyle}-divider-color-${attributes['divider-palette-border-color']}`
			: null;
	const numberCounterTextClass =
		attributes['number-counter-palette-text-color-status'] &&
		attributes['number-counter-palette-text-color']
			? `maxi-sc-${parentBlockStyle}-typography-color-${attributes['number-counter-palette-text-color']}`
			: null;
	const numberCounterCircleBackgroundClass =
		attributes['number-counter-palette-circle-background-color-status'] &&
		attributes['number-counter-palette-circle-background-color']
			? `maxi-sc-${parentBlockStyle}-circle-background-color-${attributes['number-counter-palette-circle-background-color']}`
			: null;
	const numberCounterBarBackgroundClass =
		attributes['number-counter-palette-circle-bar-color-status'] &&
		attributes['number-counter-palette-circle-bar-color']
			? `maxi-sc-${parentBlockStyle}-circle-bar-background-color-${attributes['number-counter-palette-circle-bar-color']}`
			: null;
	const markerTitleClass =
		attributes['map-marker-palette-text-color-status'] &&
		attributes['map-marker-palette-text-color']
			? `maxi-sc-${parentBlockStyle}-marker-title-color-${attributes['map-marker-palette-text-color']}`
			: null;
	const markerAddressClass =
		attributes['map-marker-palette-address-color-status'] &&
		attributes['map-marker-palette-address-color']
			? `maxi-sc-${parentBlockStyle}-marker-address-color-${attributes['map-marker-palette-address-color']}`
			: null;
	const hoverBackgroundClass =
		attributes['hover-type'] !== 'none' &&
		attributes['hover-background-palette-color-status'] &&
		attributes['hover-background-palette-color']
			? `maxi-sc-${parentBlockStyle}-hover-background-color-${attributes['hover-background-palette-color']}`
			: null;
	const svgFillClass =
		attributes['svg-palette-fill-color-status'] &&
		attributes['svg-palette-fill-color']
			? `maxi-sc-${parentBlockStyle}-svgColorFill-color-${attributes['svg-palette-fill-color']}`
			: null;
	const svgLineClass =
		attributes['svg-palette-line-color-status'] &&
		attributes['svg-palette-line-color']
			? `maxi-sc-${parentBlockStyle}-svgColorLine-color-${attributes['svg-palette-line-color']}`
			: null;
	const shapeFillClass =
		attributes['shape-palette-fill-color-status'] &&
		attributes['shape-palette-fill-color']
			? `maxi-sc-${parentBlockStyle}-shapeColorFill-color-${attributes['shape-palette-fill-color']}`
			: null;
	const linkColorClass =
		attributes['link-palette-color-status-general'] &&
		attributes['link-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-link-color-${attributes['link-palette-color-general']}`
			: null;
	const linkHoverColorClass =
		attributes['link-hover-palette-color-status-general'] &&
		attributes['link-hover-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-link-hover-color-${attributes['link-hover-palette-color-general']}`
			: null;
	const linkActiveColorClass =
		attributes['link-active-palette-color-status-general'] &&
		attributes['link-active-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-link-active-color-${attributes['link-active-palette-color-general']}`
			: null;
	const linkVisitedColorClass =
		attributes['link-visited-palette-color-status-general'] &&
		attributes['link-visited-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-link-visited-color-${attributes['link-visited-palette-color-general']}`
			: null;

	return classnames(
		typographyClass,
		typographyClassHover,
		backgroundClass,
		backgroundHoverClass,
		svgBackgroundClass,
		borderClass,
		borderClassHover,
		boxShadowClass,
		boxShadowClassHover,
		shapeDividerTopClass,
		shapeDividerBottomClass,
		dividerClass,
		numberCounterTextClass,
		numberCounterCircleBackgroundClass,
		numberCounterBarBackgroundClass,
		markerTitleClass,
		markerAddressClass,
		hoverBackgroundClass,
		svgFillClass,
		svgLineClass,
		shapeFillClass,
		linkColorClass,
		linkHoverColorClass,
		linkActiveColorClass,
		linkVisitedColorClass
	);
};

export default getPaletteClasses;
