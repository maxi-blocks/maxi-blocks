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
} from '../../utils';
import { MaxiBlock, __experimentalToolbar } from '../../components';
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
			background: { ...getColorBackgroundObject(JSON.parse(background)) },
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
			typographyHover: { ...JSON.parse(typographyHover) },
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		if (!isNil(backgroundHover) && !!JSON.parse(backgroundHover).status) {
			response.backgroundHover = {
				...getColorBackgroundObject(JSON.parse(backgroundHover)),
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
			},
			setAttributes,
			deviceType,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const classes = classnames(
			'maxi-block maxi-button-extra',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBlock
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
			>
				<RichText
					className='maxi-button-extra__button'
					withoutInteractiveFormatting
					placeholder={__('Set some text…', 'maxi-blocks')}
					value={content}
					onChange={content => setAttributes({ content })}
					identifier='text'
				/>
			</__experimentalBlock>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const {
		attributes: { content, isList, typeOfList },
		clientId,
	} = ownProps;

	const node = document.getElementById(`block-${clientId}`);

	const formatElement = {
		element: node,
		html: content,
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
