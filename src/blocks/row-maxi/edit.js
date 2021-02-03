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
import { MaxiBlock, Toolbar, Breadcrumbs } from '../../components';
import Inspector from './inspector';
import {
	getTemplates,
	getTemplateObject,
} from '../../extensions/defaults/column-templates';
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import RowContext from './context';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, uniqueId } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const {
		children,
		className,
		maxiBlockClass,
		dataAlign,
		background,
	} = props;

	return (
		<__experimentalBlock.div
			ref={ref}
			className={className}
			data-align={dataAlign}
			data-gx_initial_block_class={maxiBlockClass}
		>
			<BackgroundDisplayer {...background} />
			{children}
		</__experimentalBlock.div>
	);
});

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

class edit extends MaxiBlock {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

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

	render() {
		const {
			attributes,
			clientId,
			loadTemplate,
			selectOnClick,
			hasInnerBlock,
			className,
			instanceId,
			setAttributes,
			deviceType,
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			extraClassName,
			defaultBlockStyle,
			blockStyleBackground,
			fullWidth,
		} = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-row-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
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
					rowPattern: getGroupAttributes(attributes, 'rowPattern'),
				}}
			>
				<InnerBlocks
					__experimentalTagName={ContainerInnerBlocks}
					__experimentalPassedProps={{
						className: classes,
						dataAlign: fullWidth,
						maxiBlockClass: defaultBlockStyle,
						background: {
							...getGroupAttributes(attributes, [
								'background',
								'backgroundColor',
								'backgroundImage',
								'backgroundVideo',
								'backgroundGradient',
								'backgroundSVG',
								'backgroundHover',
								'backgroundColorHover',
								'backgroundImageHover',
								'backgroundVideoHover',
								'backgroundGradientHover',
								'backgroundSVGHover',
							]),
						},
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
														setAttributes({
															'row-pattern-general':
																template.name,
															'row-pattern-m':
																template.responsiveLayout,
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
