/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar, Button, Icon } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

import { getTemplates } from '../../extensions/column-templates';
import { getGroupAttributes } from '../../extensions/styles';
import getRowGapProps from '../../extensions/attributes/getRowGapProps';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';
import loadColumnsTemplate from '../../extensions/column-templates/loadColumnsTemplate';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

/**
 * Edit
 */
const RowBlockTemplate = ({ clientId, maxiSetAttributes, deviceType }) => {
	const { selectBlock } = useDispatch('core/block-editor');

	return (
		<>
			<div className='maxi-row-block__title'>
				<span>{__('Column picker', 'maxi-blocks')}</span>
			</div>
			<div
				className='maxi-row-block__template'
				onClick={() => selectBlock(clientId)}
				key={`maxi-row-block--${clientId}`}
			>
				{getTemplates().map(template => {
					return (
						<Button
							key={uniqueId(`maxi-row-block--${clientId}--`)}
							className='maxi-row-block__template__button'
							onClick={() => {
								maxiSetAttributes({
									'row-pattern-general': template.name,
									'row-pattern-m': template.responsiveLayout,
								});
								loadColumnsTemplate(
									template.name,
									clientId,
									deviceType
								);
							}}
						>
							<Icon
								className='maxi-row-block__template__icon'
								icon={template.icon}
								avoidSize
							/>
						</Button>
					);
				})}
			</div>
		</>
	);
};

class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		displayHandlers: false,
	};

	columnsSize = {};

	columnsClientIds = [];

	maxiBlockDidUpdate() {
		if (this.state.displayHandlers && !this.props.isSelected) {
			this.setState({
				displayHandlers: false,
			});
		}
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return maxiAttributes;
	}

	render() {
		const {
			attributes,
			clientId,
			deviceType,
			hasInnerBlocks,
			maxiSetAttributes,
			preview,
		} = this.props;
		const { uniqueID } = attributes;

		const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

		const emptyRowClass = !hasInnerBlocks
			? 'maxi-row-block__empty'
			: 'maxi-row-block__has-inner-block';

		if (preview)
			return (
				<MaxiBlock
					key={`maxi-row--${uniqueID}`}
					ref={this.blockRef}
					{...getMaxiBlockAttributes(this.props)}
				>
					<img src={previews.row_preview} />
				</MaxiBlock>
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
				copyPasteMapping={copyPasteMapping}
				{...this.props}
			/>,
			<RowContext.Provider
				key={`row-content-${uniqueID}`}
				value={{
					displayHandlers: this.state.displayHandlers,
					rowPattern: getGroupAttributes(attributes, 'rowPattern'),
					rowBlockId: clientId,
					columnsSize: this.columnsSize,
					columnsClientIds: this.columnsClientIds,
					setColumnClientId: clientId => {
						this.columnsClientIds = [
							...this.columnsClientIds,
							clientId,
						];
					},
					setColumnSize: (clientId, columnSize) => {
						this.columnsSize = {
							...this.columnsSize,
							[clientId]: columnSize,
						};

						this.forceUpdate();
					},
					rowGapProps: getRowGapProps(attributes),
					rowBorderRadius: getGroupAttributes(
						attributes,
						'borderRadius'
					),
				}}
			>
				<MaxiBlock
					key={`maxi-row--${uniqueID}`}
					ref={this.blockRef}
					classes={emptyRowClass}
					{...getMaxiBlockAttributes(this.props)}
					useInnerBlocks
					innerBlocksSettings={{
						...(hasInnerBlocks && { templateLock: 'insert' }),
						allowedBlocks: ALLOWED_BLOCKS,
						orientation: 'horizontal',
						renderAppender: !hasInnerBlocks
							? () => (
									<RowBlockTemplate
										clientId={clientId}
										maxiSetAttributes={maxiSetAttributes}
										deviceType={deviceType}
									/>
							  )
							: false,
					}}
					renderWrapperInserter={false}
				/>
			</RowContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
