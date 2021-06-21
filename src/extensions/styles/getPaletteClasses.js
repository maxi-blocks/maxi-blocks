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
	const backgroundClass =
		attributes['background-palette-color-status'] &&
		attributes['background-palette-color']
			? `maxi-sc-${parentBlockStyle}-background-color-${attributes['background-palette-color']}`
			: null;
	const borderClass =
		attributes['border-palette-color-status-general'] &&
		attributes['border-palette-color-general']
			? `maxi-sc-${parentBlockStyle}-border-color-${attributes['border-palette-color-general']}`
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
	const shapeDividerTopClass =
		attributes['shape-divider-palette-top-color-status'] &&
		attributes['shape-divider-palette-top-color']
			? `maxi-sc-${parentBlockStyle}-shape-divider-top-color-${attributes['shape-divider-palette-top-color']}`
			: null;
	const shapeDividerBottomClass =
		attributes['shape-divider-palette-bottom-color-status'] &&
		attributes['shape-divider-palette-bottom-color']
			? `maxi-sc-${parentBlockStyle}-shape-divider-bottom-color-${attributes['shape-divider-palette-bottom-color']}`
			: null;
	const dividerClass =
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

	return classnames(
		typographyClass,
		backgroundClass,
		borderClass,
		boxShadowClass,
		shapeDividerTopClass,
		shapeDividerBottomClass,
		dividerClass,
		numberCounterTextClass,
		numberCounterCircleBackgroundClass,
		numberCounterBarBackgroundClass,
		markerTitleClass,
		markerAddressClass
	);
};

export default getPaletteClasses;
