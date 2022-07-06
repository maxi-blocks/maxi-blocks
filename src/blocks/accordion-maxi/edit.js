/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';
import getStyles from './styles';
import { Toolbar } from '../../components';
import AccordionContext from './context';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = { openPane: '' };
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;
		const response = {
			accordion: {
				[uniqueID]: {
					paneIcon: attributes['icon-content'],
					paneIconActive: attributes['active-icon-content'],
					accordionLayout: attributes.accordionLayout,
					autoPaneClose: attributes.autoPaneClose,
				},
			},
		};

		return response;
	}

	render() {
		const { attributes } = this.props;
		const { uniqueID, accordionLayout, titleLevel } = attributes;

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */

		const ALLOWED_BLOCKS = ['maxi-blocks/pane-maxi'];
		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				// copyPasteMapping={copyPasteMapping}
			/>,
			<AccordionContext.Provider
				key={`accordion-content-${uniqueID}`}
				value={{
					paneIcon: attributes['icon-content'],
					paneIconActive: attributes['active-icon-content'],
					accordionLayout,
					titleLevel,
					openPane: this.state.openPane,
					setOpenPane: openPane => this.setState({ openPane }),
				}}
			>
				<MaxiBlock
					key={`maxi-accordion--${uniqueID}`}
					ref={this.blockRef}
					className={`maxi-accordion-block--${accordionLayout}-layout`}
					useInnerBlocks
					innerBlocksSettings={{
						allowedBlocks: ALLOWED_BLOCKS,
						renderAppender: false,
						templateLock: false,
						template: [
							[
								'maxi-blocks/pane-maxi',
								{ accordionLayout: 'simple' },
							],
						],
					}}
					{...getMaxiBlockAttributes(this.props)}
				/>
			</AccordionContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
