/**
 * WordPress dependencies
 */
const { __experimentalBlock } = wp.blockEditor;
const { withSelect } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlock, Toolbar } from '../../components';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import FontIconPicker from '../../components/font-icon-picker/newFontIconPicker';
import getStyles from './styles';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

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
					...getGroupAttributes(this.props.attributes, 'motion'),
					...getGroupAttributes(this.props.attributes, 'entrance'),
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
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			extraClassName,
		} = attributes;
		const icon = { ...this.props.attributes.icon };

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
			<Inspector {...this.props} />,
			<Toolbar {...this.props} />,
			<__experimentalBlock
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
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
				{(!!icon.icon && (
					<span className='maxi-font-icon-block__icon'>
						<i className={icon.icon} />
					</span>
				)) || (
					<FontIconPicker
						onChange={newIcon => {
							icon.icon = newIcon;
							setAttributes({
								icon,
							});
						}}
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
