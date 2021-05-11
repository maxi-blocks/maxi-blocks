/**
 * WordPress dependencies
 */
import { compose, withInstanceId } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, Icon, withFocusOutside } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import { MaxiBlockComponent, Toolbar, InnerBlocks } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getTemplates } from '../../extensions/column-templates';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { uniqueId, isEmpty } from 'lodash';
import loadColumnsTemplate from '../../extensions/column-templates/loadColumnsTemplate';

/**
 * Edit
 */

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
			deviceType,
			hasInnerBlocks,
			instanceId,
			selectOnClick,
			setAttributes,
		} = this.props;
		const { uniqueID } = attributes;

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */
		const ALLOWED_BLOCKS = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(
				blockName =>
					[
						'maxi-blocks/column-maxi',
						'maxi-blocks/container-maxi',
						'maxi-blocks/row-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
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
				<MaxiBlock
					key={`maxi-row--${uniqueID}`}
					ref={this.blockRef}
					{...getMaxiBlockBlockAttributes(this.props)}
					disableMotion
				>
					<InnerBlocks
						className='maxi-row-block__container'
						allowedBlocks={ALLOWED_BLOCKS}
						orientation='horizontal'
						renderAppender={
							!hasInnerBlocks
								? () => (
										<div
											className='maxi-row-block__template'
											onClick={() =>
												selectOnClick(clientId)
											}
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
				</MaxiBlock>
			</RowContext.Provider>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const { getSelectedBlockClientId, getBlockParents, getBlockOrder } = select(
		'core/block-editor'
	);

	const selectedBlockId = getSelectedBlockClientId();
	const originalNestedBlocks = getBlockParents(selectedBlockId);
	const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		selectedBlockId,
		originalNestedBlocks,
		deviceType,
		hasInnerBlocks,
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
