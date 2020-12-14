/**
 * WordPress dependencies
 */
const { __experimentalBlock } = wp.blockEditor;
const { withSelect } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getTransformObject,
	setBackgroundStyles,
	getLastBreakpointValue,
	getIconObject,
	getAlignmentTextObject,
} from '../../utils';
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalBackgroundDisplayer,
	__experimentalFontIconPicker,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID} .maxi-font-icon-block__icon`]: this.getWrapperObject,
			[`${uniqueID} .maxi-font-icon-block__icon i`]: this.getIconObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		return response;
	}

	get getIconObject() {
		const { icon } = this.props.attributes;

		const response = {
			icon: getIconObject(icon),
		};
		return response;
	}

	get getWrapperObject() {
		const { alignment } = this.props.attributes;

		const response = {
			alignment: getAlignmentTextObject(alignment),
		};

		return response;
	}

	get getNormalObject() {
		const {
			opacity,
			padding,
			margin,
			zIndex,
			position,
			display,
			transform,
			boxShadow,
			border,
		} = this.props.attributes;

		const response = {
			padding,
			margin,
			opacity,
			border,
			borderWidth: border.borderWidth,
			borderRadius: border.borderRadius,
			boxShadow: { ...getBoxShadowObject(boxShadow) },
			zIndex,
			position,
			positionOptions: position.options,
			display,
			transform: getTransformObject(transform),
		};

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;

		const response = {
			borderWidth: borderHover.borderWidth,
			borderRadius: borderHover.borderRadius,
		};

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = {
				...getBoxShadowObject(boxShadowHover),
			};
		}

		if (!isNil(borderHover) && !!borderHover.status) {
			response.borderHover = {
				...borderHover,
			};
		}

		return response;
	}

	get getCustomData() {
		const { uniqueID, motion } = this.props.attributes;

		const motionStatus =
			!!motion.interaction.interactionStatus || !!motion.parallax.status;

		return {
			[uniqueID]: {
				...(motionStatus && { motion }),
			},
		};
	}

	render() {
		const {
			attributes: {
				uniqueID,
				defaultBlockStyle,
				blockStyle,
				blockStyleBackground,
				extraClassName,
				background,
				display,
			},
			className,
			deviceType,
			setAttributes,
		} = this.props;

		const icon = { ...this.props.attributes.icon };

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-font-icon-block',
			getLastBreakpointValue(display, 'display', deviceType) === 'none' &&
				'maxi-block-display-none',
			defaultBlockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBlock className={classes}>
				<__experimentalBackgroundDisplayer background={background} />
				{(!!icon.icon && (
					<span className='maxi-font-icon-block__icon'>
						<i className={icon.icon} />
					</span>
				)) || (
					<__experimentalFontIconPicker
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
