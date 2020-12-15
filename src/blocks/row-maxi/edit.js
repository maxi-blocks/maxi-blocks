/**
 * WordPress dependencies
 */
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { forwardRef } = wp.element;
const { compose, withInstanceId } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { Button, Icon, withFocusOutside } = wp.components;
const { InnerBlocks, __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
	MaxiBlock,
	Toolbar,
	Breadcrumbs,
	BackgroundDisplayer,
} from '../../components';
import Inspector from './inspector';
import {
	getTemplates,
	getTemplateObject,
} from '../../extensions/defaults/column-templates';
import {
	getBoxShadowObject,
	getOpacityObject,
	getTransformObject,
	setBackgroundStyles,
	getLastBreakpointValue,
} from '../../utils';
import RowContext from './context';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, uniqueId, isObject } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const { children, background, className, maxiBlockClass } = props;

	return (
		<__experimentalBlock.div
			ref={ref}
			className={className}
			data-gx_initial_block_class={maxiBlockClass}
		>
			<BackgroundDisplayer background={background} />
			{children}
		</__experimentalBlock.div>
	);
});

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

class edit extends MaxiBlock {
	state = {
		styles: {},
		updating: false,
		breakpoints: this.getBreakpoints,
		displayHandlers: false,
	};

	handleFocusOutside() {
		if (this.state.displayHandlers) {
			this.setState({
				displayHandlers: false,
			});
		}
	}

	get getObject() {
		const {
			uniqueID,
			background,
			backgroundHover,
			overlay,
			overlayHover,
			border,
			borderHover,
		} = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(
				uniqueID,
				background,
				backgroundHover,
				overlay,
				overlayHover,
				border,
				borderHover
			)
		);

		return response;
	}

	get getNormalObject() {
		const {
			horizontalAlign,
			verticalAlign,
			opacity,
			border,
			size,
			boxShadow,
			margin,
			padding,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			size: { ...JSON.parse(size) },
			margin: { ...JSON.parse(margin) },
			padding: { ...JSON.parse(padding) },
			opacity: { ...getOpacityObject(JSON.parse(opacity)) },
			zIndex: { ...JSON.parse(zIndex) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
			row: {
				label: 'Row',
				general: {},
			},
		};

		if (!isNil(horizontalAlign))
			response.row.general['justify-content'] = horizontalAlign;
		if (!isNil(verticalAlign))
			response.row.general['align-items'] = verticalAlign;

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;

		const response = {
			borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
			borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
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
			attributes: {
				uniqueID,
				blockStyle,
				extraClassName,
				defaultBlockStyle,
				blockStyleBackground,
				background,
				rowPattern,
				display,
			},
			clientId,
			loadTemplate,
			selectOnClick,
			hasInnerBlock,
			className,
			instanceId,
			setAttributes,
			deviceType,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-row-block',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			className
		);

		const rowPatternObject = JSON.parse(rowPattern);

		return [
			<Inspector {...this.props} />,
			<Toolbar
				toggleHandlers={() => {
					this.setState({
						displayHandlers: !this.state.displayHandlers,
					});
				}}
				{...this.props}
			/>,
			<Breadcrumbs />,

			<RowContext.Provider
				value={{
					displayHandlers: this.state.displayHandlers,
					rowPattern,
				}}
			>
				<InnerBlocks
					// templateLock={'insert'}
					__experimentalTagName={ContainerInnerBlocks}
					__experimentalPassedProps={{
						className: classes,
						maxiBlockClass: defaultBlockStyle,
						background,
					}}
					allowedBlocks={ALLOWED_BLOCKS}
					orientation='horizontal'
					renderAppender={
						!hasInnerBlock
							? () => (
									<div
										className='maxi-row-block__template'
										onClick={() => selectOnClick(clientId)}
										key={`maxi-row-block--${instanceId}`}
									>
										{getTemplates().map(template => {
											return (
												<Button
													key={uniqueId(
														`maxi-row-block--${instanceId}--`
													)}
													className='maxi-row-block__template__button'
													onClick={() => {
														rowPatternObject.general.rowPattern =
															template.name;
														rowPatternObject.m.rowPattern =
															template.responsiveLayout;

														setAttributes({
															rowPattern: JSON.stringify(
																rowPatternObject
															),
														});
														loadTemplate(
															template.name
														);
													}}
												>
													<Icon
														className='maxi-row-block__template__icon'
														icon={template.icon}
													/>
												</Button>
											);
										})}
									</div>
							  )
							: false
					}
				/>
			</RowContext.Provider>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const selectedBlockId = select(
		'core/block-editor'
	).getSelectedBlockClientId();
	const originalNestedBlocks = select('core/block-editor').getBlockParents(
		selectedBlockId
	);
	const hasInnerBlock = !isEmpty(
		select('core/block-editor').getBlockOrder(clientId)
	);
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		selectedBlockId,
		originalNestedBlocks,
		hasInnerBlock,
		deviceType,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const { clientId } = ownProps;

	/**
	 * Creates uniqueID for columns on loading templates
	 */
	const uniqueIdCreator = () => {
		const newID = uniqueId('maxi-column-maxi-');
		if (
			!isEmpty(document.getElementsByClassName(newID)) ||
			!isNil(document.getElementById(newID))
		)
			uniqueIdCreator();

		return newID;
	};

	/**
	 * Loads template into InnerBlocks
	 *
	 * @param {integer} i Element of object TEMPLATES
	 * @param {Function} callback
	 */
	const loadTemplate = templateName => {
		const template = getTemplateObject(templateName);
		template.content.forEach(column => {
			column[1].uniqueID = uniqueIdCreator();
		});

		const newAttributes = template.attributes;
		dispatch('core/block-editor').updateBlockAttributes(
			clientId,
			newAttributes
		);

		const newTemplate = synchronizeBlocksWithTemplate([], template.content);
		dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate);
	};

	/**
	 * Block selector
	 *
	 * @param {string} id Block id to select
	 */
	const selectOnClick = id => {
		dispatch('core/editor').selectBlock(id);
	};

	return {
		loadTemplate,
		selectOnClick,
	};
});

export default compose(
	editSelect,
	editDispatch,
	withInstanceId
)(withFocusOutside(edit));
