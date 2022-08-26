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
		this.setState({
			openPanes: [
				...this.state.openPanes.filter(pane => pane !== paneId),
			],
		});
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
			headerLine: ':scope > .maxi-pane-block > .maxi-pane-block__header',
			contentLine:
				':scope > .maxi-pane-block > .maxi-pane-block__content',
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
					{...getMaxiBlockAttributes(this.props)}
				/>
			</AccordionContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
