/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';
import { compose, withInstanceId } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, Icon, withFocusOutside } from '@wordpress/components';
import { InnerBlocks, __experimentalBlock } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import {
	BackgroundDisplayer,
	Breadcrumbs,
	MaxiBlock,
	Toolbar,
} from '../../components';
import { getTemplates } from '../../extensions/defaults/column-templates';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, uniqueId } from 'lodash';
import loadColumnsTemplate from '../../extensions/column-templates/loadColumnsTemplate';

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
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				toggleHandlers={() => {
					this.setState({
						displayHandlers: !this.state.displayHandlers,
					});
				}}
				{...this.props}
			/>,
			<RowContext.Provider
				key={`row-content-${uniqueID}`}
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
														loadColumnsTemplate(
															template.name,
															attributes.removeColumnGap,
															clientId,
															deviceType
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

const editDispatch = withDispatch(dispatch => {
	/**
	 * Block selector
	 *
	 * @param {string} id Block id to select
	 */
	const selectOnClick = id => {
		dispatch('core/block-editor').selectBlock(id);
	};

	return {
		selectOnClick,
	};
});

export default compose(
	editSelect,
	editDispatch,
	withInstanceId
)(withFocusOutside(edit));
