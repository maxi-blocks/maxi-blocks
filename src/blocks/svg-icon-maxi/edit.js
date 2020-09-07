/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Placeholder, SandBox } = wp.components;
const { withSelect } = wp.data;
const { __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import MaxiProvider from './provider';
import MaxiModal from './modal';
import Inspector from './inspector';
import {
	getColorBackgroundObject,
	getBoxShadowObject,
	getAlignmentFlexObject,
	getTransformObject,
	setBackgroundStyles,
} from '../../utils';
import { MaxiBlock, __experimentalToolbar } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID} .maxi-hover-details .maxi-hover-details__content h3`]: this
				.getHoverEffectTitleTextObject,
			[`${uniqueID} .maxi-hover-details .maxi-hover-details__content p`]: this
				.getHoverEffectContentTextObject,
			[`${uniqueID} .maxi-hover-details`]: this
				.getHoverEffectDetailsBoxObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		return response;
	}

	get getNormalObject() {
		const {
			alignment,
			opacity,
			boxShadow,
			padding,
			margin,
			zIndex,
			position,
			display,
			transform,
			border,
		} = this.props.attributes;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			padding: { ...JSON.parse(padding) },
			margin: { ...JSON.parse(margin) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			opacity: { ...JSON.parse(opacity) },
			zIndex: { ...JSON.parse(zIndex) },
			alignment: { ...getAlignmentFlexObject(JSON.parse(alignment)) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
		};

		return response;
	}

	get getHoverEffectDetailsBoxObject() {
		const { hover } = this.props.attributes;

		const background = !isObject(JSON.parse(hover).background)
			? JSON.parse(JSON.parse(hover).background)
			: JSON.parse(hover).background;

		const border = !isObject(JSON.parse(hover).border)
			? JSON.parse(JSON.parse(hover).border)
			: JSON.parse(hover).border;

		const padding = !isObject(JSON.parse(hover).padding)
			? JSON.parse(JSON.parse(hover).padding)
			: JSON.parse(hover).padding;

		const margin = !isObject(JSON.parse(hover).margin)
			? JSON.parse(JSON.parse(hover).margin)
			: JSON.parse(hover).margin;

		const response = {
			background: { ...getColorBackgroundObject(background) },
			border: { ...border },
			padding: { ...padding },
			margin: { ...margin },
		};

		return response;
	}

	get getHoverEffectTitleTextObject() {
		const { hover } = this.props.attributes;

		const titleTypography = !isObject(JSON.parse(hover).titleTypography)
			? JSON.parse(JSON.parse(hover).titleTypography)
			: JSON.parse(hover).titleTypography;

		const response = {
			typography: { ...titleTypography },
		};

		return response;
	}

	get getHoverEffectContentTextObject() {
		const { hover } = this.props.attributes;

		const contentTypography = !isObject(JSON.parse(hover).contentTypography)
			? JSON.parse(JSON.parse(hover).contentTypography)
			: JSON.parse(hover).contentTypography;

		const response = {
			typography: { ...contentTypography },
		};

		return response;
	}

	get getHoverObject() {
		const {
			opacityHover,
			boxShadowHover,
			borderHover,
		} = this.props.attributes;

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			opacityHover: { ...JSON.parse(opacityHover) },
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

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
			},
			clientId,
		} = this.props;

		const classes = classnames(
			'maxi-block maxi-svg-icon-block',
			blockStyle,
			extraClassName,
			uniqueID,
			className
		);

		return [
			<MaxiProvider>
				<Inspector {...this.props} />
				<__experimentalToolbar {...this.props} />
				<__experimentalBlock
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					key={clientId}
				>
					<Fragment>
						{isEmpty(content) && (
							<Placeholder
								key='placeholder'
								label={__(
									'SVG Icon Cloud Library Maxi',
									'maxi-blocks'
								)}
								instructions={__(
									'Launch the library to browse pre-designed SVGs.',
									'maxi-blocks'
								)}
								className='maxi-block-library__placeholder'
							>
								<MaxiModal clientId={clientId} />
							</Placeholder>
						)}
						{!isEmpty(content) && (
							<Fragment>
								<SandBox
									html={content}
									className={classes}
									data-maxi_initial_block_class={
										defaultBlockStyle
									}
								/>
								<div className='block-library-html__preview-overlay' />
							</Fragment>
						)}
					</Fragment>
				</__experimentalBlock>
			</MaxiProvider>,
		];
	}
}

export default withSelect((select, ownProps) => {
	let deviceType = select(
		'core/edit-post'
	).__experimentalGetPreviewDeviceType();
	deviceType = deviceType === 'Desktop' ? 'general' : deviceType;

	return {
		deviceType,
	};
})(edit);
