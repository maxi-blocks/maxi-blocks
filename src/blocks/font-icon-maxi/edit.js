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

	componentDidMount() {
		/*
		we have not accessed to the clientId in the save the file,
		so saved it in attributes, in future we should find a better solution :)
		*/
		const { setAttributes, clientId } = this.props;

		setAttributes({
			clientId,
		});
	}

	render() {
		const {
			attributes,
			className,
			deviceType,
			setAttributes,
			clientId,
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			extraClassName,
			fullWidth,
		} = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-font-icon-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			defaultBlockStyle,
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
					'icon',
				],
				'',
				clientId
			),
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				blockStyle={blockStyle}
				{...this.props}
			/>,
			<__experimentalBlock
				key={`maxi-font-icon-block-${uniqueID}`}
				className={classes}
				data-align={fullWidth}
			>
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
