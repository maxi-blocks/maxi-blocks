/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { __experimentalBlock, RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlock, MotionPreview, Toolbar } from '../../components';
import { withFormatValue } from '../../extensions/text/formats';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	componentDidMount() {
		this.blockRef.current.focus();
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
		const {
			attributes,
			className,
			deviceType,
			setAttributes,
			formatValue,
		} = this.props;
		const { uniqueID, blockStyle, extraClassName, fullWidth } = attributes;

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
			// Typography Color
			!attributes['palette-custom-typography-color'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-typography-color-${
					attributes['palette-preset-typography-color']
				}`,

			!attributes['palette-custom-typography-hover-color'] &&
				attributes['typography-status-hover'] &&
				`maxi-sc-${
					blockStyle === 'maxi-light' ? 'light' : 'dark'
				}-typography-hover-color-${
					attributes['palette-preset-typography-hover-color']
				}`
		);

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			!!attributes['text-highlight'] && 'maxi-highlight--text',
			!!attributes['background-highlight'] &&
				'maxi-highlight--background',
			!!attributes['border-highlight'] && 'maxi-highlight--border',
			paletteClasses,
			extraClassName,
			uniqueID,
			className
		);

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
		);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				formatValue={formatValue}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				{...this.props}
				formatValue={formatValue}
			/>,
			<MotionPreview
				key={`motion-preview-${uniqueID}`}
				{...getGroupAttributes(attributes, 'motion')}
			>
				<__experimentalBlock className={classes} data-align={fullWidth}>
					<div className={buttonClasses}>
						{!isEmpty(attributes['icon-name']) && (
							<i className={attributes['icon-name']} />
						)}
						<RichText
							ref={this.blockRef}
							withoutInteractiveFormatting
							className='maxi-button-block__content'
							value={attributes.buttonContent}
							identifier='content'
							onChange={buttonContent =>
								setAttributes({ buttonContent })
							}
							placeholder={__('Set some text…', 'maxi-blocks')}
						/>
					</div>
				</__experimentalBlock>
			</MotionPreview>,
		];
	}
}

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect, withFormatValue)(edit);
