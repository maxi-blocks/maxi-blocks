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
	getButtonIconObject,
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
import { isObject } from 'lodash';

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
			icon: { ...getButtonIconObject(JSON.parse(icon)) },
		};
		return response;
	}

	get getWrapperObject() {
		const { alignment } = this.props.attributes;

		const response = {
			alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
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
			padding: { ...JSON.parse(padding) },
			margin: { ...JSON.parse(margin) },
			opacity: { ...JSON.parse(opacity) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			zIndex: { ...JSON.parse(zIndex) },
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
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		return response;
	}

	render() {
		const {
			attributes: { uniqueID, extraClassName, background, display, icon },
			className,
			deviceType,
			setAttributes,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-font-icon-block',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBlock className={classes}>
				<__experimentalBackgroundDisplayer background={background} />
				{iconValue.icon ? (
					<span className='maxi-font-icon-block__icon'>
						<i className={iconValue.icon} />
					</span>
				) : (
					<__experimentalFontIconPicker
						onChange={icon => {
							iconValue.icon = icon;
							setAttributes({
								icon: JSON.stringify(iconValue),
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
