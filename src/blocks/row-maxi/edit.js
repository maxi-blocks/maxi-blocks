/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';
import { compose, withInstanceId } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, Icon, withFocusOutside } from '@wordpress/components';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import { MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getTemplates } from '../../extensions/column-templates';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
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
		attributes: { uniqueID },
	} = props;

	return (
		<MaxiBlock
			key={`maxi-row--${uniqueID}`}
			ref={ref}
			className={className}
			{...getMaxiBlockBlockAttributes(props)}
			disableMotion
		>
			{children}
		</MaxiBlock>
	);
});

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

class edit extends MaxiBlockComponent {
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
			instanceId,
			setAttributes,
			deviceType,
		} = this.props;
		const { uniqueID, parentBlockStyle } = attributes;

		const classes = classnames(
			'maxi-row-block',
			getPaletteClasses(
				attributes,
				[
					'background',
					'background-hover',
					'border',
					'border-hover',
					'box-shadow',
					'box-shadow-hover',
				],
				'maxi-blocks/row-maxi',
				parentBlockStyle
			)
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
						...this.props,
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
