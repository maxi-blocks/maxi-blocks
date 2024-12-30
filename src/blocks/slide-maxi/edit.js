/**
 * Wordpress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import BlockInserter from '@components/block-inserter';
import Toolbar from '@components/toolbar';
import { copyPasteMapping } from './data';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '@extensions/DC';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { getLastBreakpointAttribute } from '@extensions/styles';
import getStyles from './styles';
import SliderContext from '@blocks/slider-maxi/context';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * Editor
 */
class edit extends MaxiBlockComponent {
	static contextType = SliderContext;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	maxiBlockDidMount() {
		const { clientId } = this.props;

		this.context?.setSlideWidth(
			clientId,
			this.blockRef.current.getBoundingClientRect().width
		);
	}

	maxiBlockDidUpdate(prevProps) {
		const { clientId, isSelected } = this.props;
		const { isSelected: wasSelected } = prevProps;
		const { width } = this.blockRef.current.getBoundingClientRect();

		if (this.context?.slidesWidth[clientId] !== width) {
			this.context?.setSlideWidth(clientId, width);
		}
		if (isSelected !== wasSelected && isSelected) {
			this.context?.onSelect(clientId);
			this.blockRef.current.setAttribute('data-slide-active', 'true');
		}
	}

	maxiBlockWillUnmount() {
		const { clientId } = this.props;
		this.context?.onRemoveSlide(clientId);
	}

	render() {
		const { attributes, deviceType, hasInnerBlocks, clientId } = this.props;
		const { uniqueID } = attributes;

		const ALLOWED_BLOCKS = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(
				blockName =>
					[
						'maxi-blocks/container-maxi',
						'maxi-blocks/slide-maxi',
						'maxi-blocks/maxi-cloud',
						'maxi-blocks/list-item-maxi',
						'core/list-item',
					].indexOf(blockName) === -1
			);

		const emptySlideClass = `maxi-slide-block__${
			hasInnerBlocks ? 'has-innerBlock' : 'empty'
		}`;
		const isActive =
			this.context?.selected ===
			select('core/block-editor').getBlockIndex(clientId);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				propsToAvoid={['resizableObject']}
				copyPasteMapping={copyPasteMapping}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-slide--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
				tagName='li'
				data-slide-active={isActive}
				classes={classnames(
					emptySlideClass,
					'maxi-block',
					'maxi-block--backend',
					'maxi-slide-block',
					'maxi-slide-block__resizer',
					`maxi-slide-block__resizer__${uniqueID}`,
					getLastBreakpointAttribute({
						target: 'display',
						breakpoint: deviceType,
						attributes,
						isHover: false,
						forceSingle: true,
					}) === 'none' && 'maxi-block-display-none'
				)}
				useInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					orientation: 'horizontal',
					templateLock: false,
					renderAppender: !hasInnerBlocks
						? () => <BlockInserter clientId={clientId} />
						: false,
				}}
			/>,
		];
	}
}

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
