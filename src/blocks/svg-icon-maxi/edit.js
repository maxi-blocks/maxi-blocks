/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, RawHTML } = wp.element;
const { Placeholder } = wp.components;
const { withSelect } = wp.data;
const { __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import MaxiProvider from './provider';
import MaxiModal from './modal';
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getAlignmentFlexObject,
	getTransformObject,
	setBackgroundStyles,
} from '../../utils';
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalBackgroundDisplayer,
	__experimentalMotionPreview,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
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

	get getHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;

		const response = {
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		if (!isNil(boxShadowHover) && !!JSON.parse(boxShadowHover).status) {
			response.boxShadowHover = {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
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
				background,
				motion,
			},
			clientId,
		} = this.props;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-svg-icon-block',
			blockStyle,
			extraClassName,
			uniqueID,
			className
		);

		return [
			<MaxiProvider>
				<Inspector {...this.props} />
				<__experimentalToolbar {...this.props} />
				<__experimentalMotionPreview motion={motion}>
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
									<__experimentalBackgroundDisplayer
										background={background}
									/>
									<RawHTML>{content}</RawHTML>
								</Fragment>
							)}
						</Fragment>
					</__experimentalBlock>
				</__experimentalMotionPreview>
			</MaxiProvider>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
})(edit);
