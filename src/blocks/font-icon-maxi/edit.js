/**
 * WordPress dependencies
 */
import { __experimentalBlock } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Icon } from '@wordpress/components';

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
import MaxiModalIcon from '../../components/font-icon-picker/modal';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { toolbarReplaceImage } from '../../icons';

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
					<Fragment>
						<div className='maxi-font-icon-block__icon__replace'>
							<MaxiModalIcon
								icon={attributes['icon-name']}
								onChange={val =>
									setAttributes({
										'icon-name': val,
									})
								}
								btnText=''
								btnIcon={toolbarReplaceImage}
							/>
						</div>

						<span className='maxi-font-icon-block__icon'>
							<i className={attributes['icon-name']} />
						</span>
					</Fragment>
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
