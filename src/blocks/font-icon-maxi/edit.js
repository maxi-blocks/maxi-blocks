/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { FontIconPicker, MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
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
class edit extends MaxiBlockComponent {
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
		const { attributes, setAttributes } = this.props;
		const { uniqueID, parentBlockStyle } = attributes;

		const classes = classnames(
			'maxi-font-icon-block',
			getPaletteClasses(
				attributes,
				[
					'background',
					'background-hover',
					'border',
					'border-hover',
					'box-shadow',
					'box-shadow-hover',
					'icon',
					'icon-hover',
				],
				'maxi-blocks/font-icon-maxi',
				parentBlockStyle
			)
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-font-icon--${uniqueID}`}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
				disableMotion
			>
				{(!isEmpty(attributes['icon-name']) && (
					<>
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
					</>
				)) || (
					<FontIconPicker
						onChange={val =>
							setAttributes({
								'icon-name': val,
							})
						}
					/>
				)}
			</MaxiBlock>,
		];
	}
}

export default withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
})(edit);
