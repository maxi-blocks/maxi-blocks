/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
const BlockInserter = loadable(() => import('../../components/block-inserter'));
import Toolbar from '../../components/toolbar';
const ArrowDisplayer = loadable(() =>
	import('../../components/arrow-displayer')
);
import MaxiBlock from '../../components/maxi-block/maxiBlock';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '../../extensions/DC';
import { DISALLOWED_BLOCKS } from '../../extensions/repeater';
import withMaxiDC from '../../extensions/DC/withMaxiDC';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const { attributes, deviceType, hasInnerBlocks, clientId } = this.props;
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
						'maxi-blocks/container-maxi',
						'maxi-blocks/column-maxi',
						'maxi-blocks/pane-maxi',
						'maxi-blocks/maxi-cloud',
						'maxi-blocks/slide-maxi',
						'maxi-blocks/list-item-maxi',
						'core/list-item',
						...DISALLOWED_BLOCKS,
					].indexOf(blockName) === -1
			)
			.concat(
				this.props.repeaterStatus
					? Array(DISALLOWED_BLOCKS.length).fill(null)
					: DISALLOWED_BLOCKS
			);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-group--${uniqueID}`}
				ref={this.blockRef}
				useInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					templateLock: false,
					renderAppender: !hasInnerBlocks
						? () => <BlockInserter clientId={clientId} />
						: false,
				}}
				{...getMaxiBlockAttributes(this.props)}
			>
				<ArrowDisplayer
					key={`maxi-arrow-displayer__${uniqueID}`}
					{...getGroupAttributes(
						attributes,
						['blockBackground', 'arrow', 'border'],
						true
					)}
					breakpoint={deviceType}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
