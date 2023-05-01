/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

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
import { copyPasteMapping } from './data';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	state = { openPanes: [] };

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: attributes,
		});
		const response = {
			accordion: {
				[uniqueID]: {
					paneIcon: getAttributesValue({
						target: 'i_c',
						props: attributes,
					}),
					paneIconActive: getAttributesValue({
						target: 'i_c',
						prefix: 'a-',
						props: attributes,
					}),
					accordionLayout: getAttributesValue({
						target: '_acl',
						props: attributes,
					}),
					autoPaneClose: getAttributesValue({
						target: '_apc',
						props: attributes,
					}),
					isCollapsible: getAttributesValue({
						target: '_ico',
						props: attributes,
					}),
					animationDuration: getAttributesValue({
						target: '_ad',
						props: attributes,
					}),
				},
			},
		};

		return response;
	}

	openPane(paneId) {
		const autoPaneClose = getAttributesValue({
			target: '_apc',
			props: this.props.attributes,
		});

		if (autoPaneClose) {
			this.setState({ openPanes: [paneId] });
			return;
		}

		this.setState({ openPanes: [...this.state.openPanes, paneId] });
	}

	closePane(paneId) {
		this.setState({
			openPanes: [
				...this.state.openPanes.filter(pane => pane !== paneId),
			],
		});
	}

	maxiBlockDidUpdate() {
		if (!this.props.hasInnerBlocks) {
			const { removeBlock } = dispatch('core/block-editor');
			removeBlock(this.props.clientId);
		}
	}

	render() {
		const { attributes } = this.props;
		const [
			uniqueID,
			titleLevel,
			accordionLayout,
			isCollapsible,
			animationDuration,
			iconContent,
			activeIconContent,
		] = getAttributesValue({
			target: ['_uid', '_tl', '_acl', '_ico', '_ad', 'i_c', 'a-i_c'],
			props: attributes,
		});

		const inlineStylesTargets = {
			headerLine:
				':scope > .maxi-pane-block > .maxi-pane-block__header > .maxi-pane-block__header-line-container > .maxi-pane-block__header-line',
			contentLine:
				':scope > .maxi-pane-block > .maxi-pane-block__content > .maxi-pane-block__content-line-container > .maxi-pane-block__content-line',
		};

		const ALLOWED_BLOCKS = ['maxi-blocks/pane-maxi'];

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				inlineStylesTargets={inlineStylesTargets}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<AccordionContext.Provider
				key={`accordion-content-${uniqueID}`}
				value={{
					accordionUniqueId: uniqueID,
					paneIcon: iconContent,
					paneIconActive: activeIconContent,
					accordionLayout,
					titleLevel,
					isCollapsible,
					animationDuration,
					openPanes: this.state.openPanes,
					onOpen: paneId => this.openPane(paneId),
					onClose: paneId => this.closePane(paneId),
				}}
			>
				<MaxiBlock
					key={`maxi-accordion--${uniqueID}`}
					ref={this.blockRef}
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
