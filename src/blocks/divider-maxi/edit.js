/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { __experimentalBlock } = wp.blockEditor;
const { ResizableBox } = wp.components;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getTransformObject,
	setBackgroundStyles,
} from '../../utils';
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalBackgroundDisplayer,
} from '../../components';

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
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID} > hr.maxi-divider-block__divider`]: this
				.getDividerObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		return response;
	}

	get getNormalObject() {
		const {
			lineVertical,
			lineHorizontal,
			linesAlign,
			opacity,
			size,
			padding,
			margin,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			size: { ...JSON.parse(size) },
			padding: { ...JSON.parse(padding) },
			margin: { ...JSON.parse(margin) },
			opacity: { ...JSON.parse(opacity) },
			zIndex: { ...JSON.parse(zIndex) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
			divider: {
				label: 'Divider',
				general: {},
			},
		};

		if (!isNil(linesAlign)) {
			response.divider.general['flex-direction'] = linesAlign;
			if (linesAlign === 'row') {
				if (!isNil(lineVertical))
					response.divider.general['align-items'] = lineVertical;
				if (!isNil(lineHorizontal))
					response.divider.general[
						'justify-content'
					] = lineHorizontal;
			} else {
				if (!isNil(lineVertical))
					response.divider.general['justify-content'] = lineVertical;
				if (!isNil(lineHorizontal))
					response.divider.general['align-items'] = lineHorizontal;
			}
		}

		return response;
	}

	get getHoverObject() {
		const { opacityHover, boxShadowHover } = this.props.attributes;

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			opacityHover: { ...JSON.parse(opacityHover) },
		};

		return response;
	}

	get getDividerObject() {
		const { divider, boxShadow } = this.props.attributes;
		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			divider: { ...JSON.parse(divider) },
			opacity: { ...JSON.parse(divider).opacity },
		};

		return response;
	}

	render() {
		const {
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				showLine,
				lineOrientation,
				extraClassName,
				fullWidth,
				size,
				background,
			},
			className,
			isSelected,
			deviceType,
			onDeviceTypeChange,
			setAttributes,
		} = this.props;

		onDeviceTypeChange();

		const classes = classnames(
			'maxi-block maxi-divider-block',
			blockStyle,
			extraClassName,
			uniqueID,
			className,
			lineOrientation === 'vertical'
				? 'maxi-divider-block--vertical'
				: 'maxi-divider-block--horizontal'
		);

		const value = !isObject(size) ? JSON.parse(size) : size;

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<ResizableBox
				className={classnames(
					'maxi-block__resizer',
					'maxi-divider-block__resizer',
					`maxi-divider-block__resizer__${uniqueID}`
				)}
				defaultSize={{
					width: '100%',
					height:
						value[deviceType].height + value[deviceType].heightUnit,
				}}
				enable={{
					top: false,
					right: false,
					bottom: isSelected,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				onResizeStart={() => {
					value[deviceType].heightUnit !== 'px' &&
						(value[deviceType].heightUnit = 'px') &&
						setAttributes({
							size: JSON.stringify(value),
						});
				}}
				onResizeStop={(event, direction, elt) => {
					value[
						deviceType
					].height = elt.getBoundingClientRect().height;
					setAttributes({
						size: JSON.stringify(value),
					});
				}}
			>
				<__experimentalBlock
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					data-align={fullWidth}
				>
					<__experimentalBackgroundDisplayer
						background={background}
					/>
					{!!showLine && (
						<Fragment>
							<hr className='maxi-divider-block__divider' />
						</Fragment>
					)}
				</__experimentalBlock>
			</ResizableBox>,
		];
	}
}

const editSelect = withSelect(select => {
	let deviceType = select(
		'core/edit-post'
	).__experimentalGetPreviewDeviceType();
	deviceType = deviceType === 'Desktop' ? 'general' : deviceType;

	return {
		deviceType,
	};
});

const editDispatch = withDispatch((dispatch, ownProps, { select }) => {
	const {
		attributes: { uniqueID, size },
		deviceType,
	} = ownProps;

	const onDeviceTypeChange = function () {
		let newDeviceType = select(
			'core/edit-post'
		).__experimentalGetPreviewDeviceType();
		newDeviceType = newDeviceType === 'Desktop' ? 'general' : newDeviceType;

		const allowedDeviceTypes = ['general', 'xl', 'l', 'm', 's'];

		if (
			allowedDeviceTypes.includes(newDeviceType) &&
			deviceType !== newDeviceType
		) {
			const node = document.querySelector(
				`.maxi-divider-block__resizer__${uniqueID}`
			);
			if (isNil(node)) return;
			const newSize = JSON.parse(size);
			node.style.height = `${newSize[newDeviceType].height}px`;
		}
	};

	return {
		onDeviceTypeChange,
	};
});

export default compose(editSelect, editDispatch)(edit);
