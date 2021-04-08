/**
 * WordPress dependencies
 */
import { __experimentalBlock } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	BackgroundDisplayer,
	FontIconPicker,
	MaxiBlock,
	Toolbar,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
					]),
				}),
			},
		};
	}

	render() {
		const { attributes, className, deviceType, setAttributes } = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			extraClassName,
			fullWidth,
		} = attributes;

		const paletteClasses = classnames(
			// Background Color
			attributes['background-active-media'] === 'color' &&
				!attributes['palette-custom-background-color'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-background-color-${
					attributes['palette-preset-background-color']
				}`,

			attributes['background-active-media-hover'] === 'color' &&
				!attributes['palette-custom-background-hover-color'] &&
				attributes['background-status-hover'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-background-hover-color-${
					attributes['palette-preset-background-hover-color']
				}`,
			// Border Color
			!isEmpty(attributes['border-style-general']) &&
				attributes['border-style-general'] !== 'none' &&
				!attributes['palette-custom-border-color'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-border-color-${attributes['palette-preset-border-color']}`,

			attributes['border-style-general-hover'] !== 'none' &&
				!attributes['palette-custom-border-hover-color'] &&
				attributes['border-status-hover'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-border-hover-color-${
					attributes['palette-preset-border-hover-color']
				}`,
			// Box-Shadow Color
			!isNil(attributes['box-shadow-blur-general']) &&
				!isNil(attributes['box-shadow-horizontal-general']) &&
				!isNil(attributes['box-shadow-vertical-general']) &&
				!isNil(attributes['box-shadow-spread-general']) &&
				!attributes['palette-custom-box-shadow-color'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-box-shadow-color-${
					attributes['palette-preset-box-shadow-color']
				}`,

			!attributes['palette-custom-box-shadow-hover-color'] &&
				attributes['box-shadow-status-hover'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-box-shadow-hover-color-${
					attributes['palette-preset-box-shadow-hover-color']
				}`,
			// Icon Color
			!isEmpty(attributes['icon-name']) &&
				!attributes['palette-custom-icon-color'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-icon-color-${attributes['palette-preset-icon-color']}`
		);

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-font-icon-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			defaultBlockStyle,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			!!attributes['text-highlight'] && 'maxi-highlight--text',
			!!attributes['background-highlight'] &&
				'maxi-highlight--background',
			!!attributes['border-highlight'] && 'maxi-highlight--border',
			paletteClasses,
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<__experimentalBlock
				key={`maxi-font-icon-block-${uniqueID}`}
				className={classes}
				data-align={fullWidth}
			>
				{!attributes['background-highlight'] && (
					<BackgroundDisplayer
						{...getGroupAttributes(attributes, [
							'background',
							'backgroundColor',
							'backgroundGradient',
							'backgroundHover',
							'backgroundColorHover',
							'backgroundGradientHover',
						])}
					/>
				)}
				{(!isEmpty(attributes['icon-name']) && (
					<span className='maxi-font-icon-block__icon'>
						<i className={attributes['icon-name']} />
					</span>
				)) || (
					<FontIconPicker
						onChange={val =>
							setAttributes({
								'icon-name': val,
							})
						}
					/>
				)}
			</__experimentalBlock>,
		];
	}
}

export default withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
})(edit);
