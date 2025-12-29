/**
 * Internal dependencies
 */
import Inspector from './inspector';
import BlockInserter from '@components/block-inserter';
import Toolbar from '@components/toolbar';
import ArrowDisplayer from '@components/arrow-displayer';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import { getGroupAttributes } from '@extensions/styles';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '@extensions/DC';
import { DISALLOWED_BLOCKS } from '@extensions/repeater';
import withMaxiDC from '@extensions/DC/withMaxiDC';
import { getAllowedBlocks } from '@extensions/common/getAllowedBlocks';

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
		const ALLOWED_BLOCKS = getAllowedBlocks([
			'maxi-blocks/container-maxi',
			'maxi-blocks/column-maxi',
			'maxi-blocks/pane-maxi',
			'maxi-blocks/maxi-cloud',
			'maxi-blocks/slide-maxi',
			'maxi-blocks/list-item-maxi',
			'core/list-item',
			...DISALLOWED_BLOCKS,
		]).concat(
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

const withPropsComponent = withMaxiProps(edit);
const withDCComponent = withMaxiDC(withPropsComponent);
const withContextLoopContextComponent =
	withMaxiContextLoopContext(withDCComponent);
const finalComponent = withMaxiContextLoop(withContextLoopContextComponent);

export default finalComponent;
