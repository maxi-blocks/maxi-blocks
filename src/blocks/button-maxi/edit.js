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
	getPaletteClasses,
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
			clientId,
		} = this.props;
		const { uniqueID, blockStyle, extraClassName, fullWidth } = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			getPaletteClasses(
				attributes,
				blockStyle,
				[
					'background',
					'background-hover',
					'border',
					'border-hover',
					'box-shadow',
					'box-shadow-hover',
					'typography',
					'typography-hover',
					'icon',
				],
				'maxi-blocks/button-maxi',
				clientId
			),
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
				blockStyle={blockStyle}
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
