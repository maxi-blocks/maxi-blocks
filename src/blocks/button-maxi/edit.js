/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { __experimentalBlock, RichText } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getColorBackgroundObject,
	getBoxShadowObject,
	getAlignmentFlexObject,
	getTransformObject,
	getAlignmentTextObject,
	setTextCustomFormats,
	getLastBreakpointValue,
	getIconObject,
} from '../../utils';
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalMotionPreview,
} from '../../components';
import { __experimentalGetFormatValue } from '../../extensions/text/formats';

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
		const { uniqueID, typography, typographyHover } = this.props.attributes;

		let response = {
			[this.props.attributes.uniqueID]: this.getWrapperObject,
			[`${this.props.attributes.uniqueID} .maxi-button-extra__button`]: this
				.getNormalObject,
			[`${this.props.attributes.uniqueID} .maxi-button-extra__button:hover`]: this
				.getHoverObject,
			[`${this.props.attributes.uniqueID} .maxi-button-extra__button i`]: this
				.getIconObject,
		};

		response = Object.assign(
			response,
			setTextCustomFormats(
				[
					`${uniqueID} .maxi-button-extra__button`,
					`${uniqueID} .maxi-button-extra__button li`,
				],
				typography,
				typographyHover
			)
		);

		return response;
	}

	get getIconObject() {
		const {
			icon,
			iconPadding,
			iconBorder,
			iconBackground,
		} = this.props.attributes;

		const response = {
			icon: { ...getIconObject(icon) },
			padding: iconPadding,
			border: iconBorder,
			borderWidth: iconBorder.borderWidth,
			borderRadius: iconBorder.borderRadius,
			background: {
				...getColorBackgroundObject(iconBackground.colorOptions),
			},
		};

		return response;
	}

	get getWrapperObject() {
		const { alignment, zIndex, transform, display } = this.props.attributes;

		const response = {
			alignment: { ...getAlignmentFlexObject(alignment) },
			zIndex,
			transform: getTransformObject(transform),
			display,
		};

		return response;
	}

	get getNormalObject() {
		const {
			background,
			alignmentText,
			typography,
			boxShadow,
			border,
			size,
			padding,
			margin,
			zIndex,
			position,
		} = this.props.attributes;

		const response = {
			typography,
			alignmentText: {
				...getAlignmentTextObject(alignmentText),
			},
			background: {
				...getColorBackgroundObject(background.colorOptions),
			},
			boxShadow: { ...getBoxShadowObject(boxShadow) },
			border,
			borderWidth: border.borderWidth,
			borderRadius: border.borderRadius,
			size,
			padding,
			margin,
			zIndex,
			position,
			positionOptions: position.options,
		};

		return response;
	}

	get getHoverObject() {
		const {
			backgroundHover,
			typographyHover,
			boxShadowHover,
			borderHover,
		} = this.props.attributes;

		const response = {
			borderWidth: borderHover.borderWidth,
			borderRadius: borderHover.borderRadius,
		};

		if (!isNil(backgroundHover) && !!backgroundHover.status) {
			response.backgroundHover = {
				...getColorBackgroundObject(backgroundHover),
			};
		}

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = {
				...getBoxShadowObject(boxShadowHover),
			};
		}

		if (!isNil(typographyHover) && !!typographyHover.status) {
			response.typographyHover = {
				...typographyHover,
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
			className,
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				blockStyleBackground,
				extraClassName,
				content,
				display,
				icon,
				motion,
			},
			setAttributes,
			deviceType,
		} = this.props;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-extra',
			getLastBreakpointValue(display, 'display', deviceType) === 'none' &&
				'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			uniqueID,
			className
		);

		const buttonClasses = classnames(
			'maxi-button-extra__button',
			icon.position === 'left' && 'maxi-button-extra__button--icon-left',
			icon.position === 'right' && 'maxi-button-extra__button--icon-right'
		);

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalMotionPreview motion={motion}>
				<__experimentalBlock
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
				>
					<div className={buttonClasses}>
						{icon.icon && <i className={icon.icon} />}
						<RichText
							withoutInteractiveFormatting
							placeholder={__('Set some text…', 'maxi-blocks')}
							value={content}
							onChange={content => setAttributes({ content })}
							identifier='text'
						/>
					</div>
				</__experimentalBlock>
			</__experimentalMotionPreview>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const {
		attributes: { isList, typeOfList },
	} = ownProps;

	const formatElement = {
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: true,
	};
	const formatValue = __experimentalGetFormatValue(formatElement);

	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		formatValue,
		deviceType,
	};
})(edit);
