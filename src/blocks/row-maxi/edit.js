/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getRowGapProps from '../../extensions/attributes/getRowGapProps';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';

/**
 * External dependencies
 */
import { withMaxiContextLoop } from '../../extensions/DC';
import { RowBlockTemplate } from './components';

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
		} = this.props;
		const { uniqueID, styleID } = attributes;

		const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

		const emptyRowClass = !hasInnerBlocks
			? 'maxi-row-block__empty'
			: 'maxi-row-block__has-inner-block';

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
				data-maxi-style-id={styleID}
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
					data-maxi-style-id={styleID}
				/>
			</RowContext.Provider>,
		];
	}
}

export default withMaxiContextLoop(withMaxiProps(edit));
