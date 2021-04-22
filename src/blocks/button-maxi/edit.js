/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, dispatch } from '@wordpress/data';
import { __experimentalBlock, RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import Inspector from './inspector';
import { MaxiBlock, MotionPreview, Toolbar } from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getPaletteClasses,
	getBlockStyle,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */

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

	componentDidUpdate() {
		const { setAttributes, clientId } = this.props;

		setAttributes({
			parentBlockStyle: getBlockStyle(
				this.props.attributes.blockStyle,
				clientId
			),
		});
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
			extraClassName,
			fullWidth,
			parentBlockStyle,
		} = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			getPaletteClasses(
				attributes,
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
				parentBlockStyle
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
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
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
						>
							{({ value }) => {
								dispatch('maxiBlocks/text').sendFormatValue(
									value
								);
							}}
						</RichText>
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

export default compose(editSelect)(edit);
