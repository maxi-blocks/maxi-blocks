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
import { isEmpty, isNil, uniqueId } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const { children, background, className, maxiBlockClass, dataAlign } = props;

	return (
		<__experimentalBlock.div
			ref={ref}
			className={className}
			data-align={dataAlign}
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
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[uniqueID]: this.getContainerSizeObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles({
				target: uniqueID,
				background: { ...background },
				backgroundHover: { ...backgroundHover },
			})
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
			boxShadow: { ...getBoxShadowObject(boxShadow) },
			border,
			borderWidth: border.borderWidth,
			borderRadius: border.borderRadius,
			size,
			margin,
			padding,
			opacity: { ...getOpacityObject(opacity) },
			zIndex,
			position,
			positionOptions: position.options,
			display,
			transform: getTransformObject(transform),
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
			borderWidthHover: borderHover.borderWidth,
			borderRadiusHover: borderHover.borderRadius,
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

	get getContainerSizeObject() {
		const { fullWidth, sizeContainer } = this.props.attributes;

		const response = {
			sizeContainer,
		};

		if (fullWidth !== 'full') return response;

		return {};
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
				fullWidth,
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

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-row-block',
			getLastBreakpointValue(display, 'display', deviceType) === 'none' &&
				'maxi-block-display-none',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			className
		);

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
					__experimentalTagName={ContainerInnerBlocks}
					__experimentalPassedProps={{
						className: classes,
						dataAlign: fullWidth,
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
														rowPattern.general.rowPattern =
															template.name;
														rowPattern.m.rowPattern =
															template.responsiveLayout;

														setAttributes({
															rowPattern,
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
		dispatch('core/block-editor').selectBlock(id);
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
