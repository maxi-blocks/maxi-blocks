/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { Button, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

import { getTemplates } from '../../extensions/column-templates';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';
import loadColumnsTemplate from '../../extensions/column-templates/loadColumnsTemplate';

/**
 * Edit
 */
const RowBlockTemplate = ({ clientId, maxiSetAttributes, deviceType }) => {
	const { selectBlock } = useDispatch('core/block-editor');

	return (
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
						/>
					</Button>
				);
			})}
		</div>
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

	render() {
		const {
			attributes,
			blockFullWidth,
			clientId,
			deviceType,
			hasInnerBlocks,
			maxiSetAttributes,
		} = this.props;
		const { uniqueID } = attributes;

		const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

		const emptyRowClass = !hasInnerBlocks
			? 'maxi-row-block__empty'
			: 'maxi-row-block__has-innerBlock';

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
					rowGapProps: (() => {
						const response = getGroupAttributes(attributes, 'flex');

						Object.keys(response).forEach(key => {
							if (!key.includes('gap')) delete response[key];
						});

						return response;
					})(),
					rowBorderRadius: getGroupAttributes(
						attributes,
						'borderRadius'
					),
				}}
			>
				<MaxiBlock
					key={`maxi-row--${uniqueID}`}
					ref={this.blockRef}
					blockFullWidth={blockFullWidth}
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
				/>
			</RowContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
