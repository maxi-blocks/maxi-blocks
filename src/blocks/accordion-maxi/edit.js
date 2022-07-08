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

		this.state = { openPanes: [] };
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
					isCollapsible: attributes.isCollapsible,
				},
			},
		};

		return response;
	}

	openPane(paneId) {
		const { autoPaneClose } = this.props.attributes;

		if (autoPaneClose) {
			this.setState({ openPanes: [paneId] });
			return;
		}

		this.setState({ openPanes: [...this.state.openPanes, paneId] });
	}

	closePane(paneId) {
		const { isCollapsible } = this.props.attributes;

		if (!isCollapsible && this.state.openPanes.length === 1) return;

		this.setState({
			openPanes: [
				...this.state.openPanes.filter(pane => pane !== paneId),
			],
		});
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
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
					openPanes: this.state.openPanes,
					onOpen: paneId => this.openPane(paneId),
					onClose: paneId => this.closePane(paneId),
					setAccordionAttributes: obj => {
						maxiSetAttributes(obj);
					},
					accordionAttributes: attributes,
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
						template: [['maxi-blocks/pane-maxi']],
					}}
					{...getMaxiBlockAttributes(this.props)}
				/>
			</AccordionContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
