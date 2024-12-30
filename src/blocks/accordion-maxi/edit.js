/* eslint-disable react/jsx-no-constructed-context-values */

/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { withMaxiContextLoop } from '@extensions/DC';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import getStyles from './styles';
import AccordionContext from './context';
import { copyPasteMapping } from './data';
import withMaxiDC from '@extensions/DC/withMaxiDC';

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
		const { uniqueID } = attributes;
		const response = {
			[uniqueID]: {
				paneIcon: attributes['icon-content'],
				paneIconActive: attributes['active-icon-content'],
				accordionLayout: attributes.accordionLayout,
				autoPaneClose: attributes.autoPaneClose,
				isCollapsible: attributes.isCollapsible,
				animationDuration: attributes.animationDuration,
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
		const {
			uniqueID,
			accordionLayout,
			titleLevel,
			isCollapsible,
			animationDuration,
		} = attributes;

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
				setShowLoader={value => this.setState({ showLoader: value })}
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
					paneIcon: attributes['icon-content'],
					paneIconActive: attributes['active-icon-content'],
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
					showLoader={this.state.showLoader}
					{...getMaxiBlockAttributes(this.props)}
				/>
			</AccordionContext.Provider>,
		];
	}
}

export default withMaxiContextLoop(withMaxiDC(withMaxiProps(edit)));
