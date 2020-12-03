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
import { isNil, isObject } from 'lodash';

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
			icon: { ...getIconObject(JSON.parse(icon)) },
			padding: { ...JSON.parse(iconPadding) },
			border: { ...JSON.parse(iconBorder) },
			borderWidth: { ...JSON.parse(iconBorder).borderWidth },
			borderRadius: { ...JSON.parse(iconBorder).borderRadius },
			background: {
				...getColorBackgroundObject(
					JSON.parse(iconBackground).colorOptions
				),
			},
		};

		return response;
	}

	get getWrapperObject() {
		const { alignment, zIndex, transform, display } = this.props.attributes;

		const response = {
			alignment: { ...getAlignmentFlexObject(JSON.parse(alignment)) },
			zIndex: { ...JSON.parse(zIndex) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
			display: { ...JSON.parse(display) },
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
			typography: { ...JSON.parse(typography) },
			alignmentText: {
				...getAlignmentTextObject(JSON.parse(alignmentText)),
			},
			background: {
				...getColorBackgroundObject(
					JSON.parse(background).colorOptions
				),
			},
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			size: { ...JSON.parse(size) },
			padding: { ...JSON.parse(padding) },
			margin: { ...JSON.parse(margin) },
			zIndex: { ...JSON.parse(zIndex) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
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
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		if (!isNil(backgroundHover) && !!JSON.parse(backgroundHover).status) {
			response.backgroundHover = {
				...getColorBackgroundObject(JSON.parse(backgroundHover)),
			};
		}

		if (!isNil(boxShadowHover) && !!JSON.parse(boxShadowHover).status) {
			response.boxShadowHover = {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			};
		}

		if (!isNil(typographyHover) && !!JSON.parse(typographyHover).status) {
			response.typographyHover = {
				...JSON.parse(typographyHover),
			};
		}

		if (!isNil(borderHover) && !!JSON.parse(borderHover).status) {
			response.borderHover = {
				...JSON.parse(borderHover),
			};
		}

		return response;
	}

	render() {
		const {
			className,
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				extraClassName,
				content,
				display,
				icon,
				motion,
			},
			setAttributes,
			deviceType,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-extra',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			extraClassName,
			uniqueID,
			className
		);

		const buttonClasses = classnames(
			'maxi-button-extra__button',
			iconValue.position === 'left' &&
				'maxi-button-extra__button--icon-left',
			iconValue.position === 'right' &&
				'maxi-button-extra__button--icon-right'
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
						{iconValue.icon && <i className={iconValue.icon} />}
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
