/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { BlockInserter, Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Editor
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
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
					].indexOf(blockName) === -1
			);

		const emptySlideClass = !hasInnerBlocks
			? 'maxi-slide-block__empty'
			: 'maxi-slide-block__has-innerBlock';

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				propsToAvoid={['resizableObject']}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-slide--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
				tagName='li'
				classes={classnames(
					emptySlideClass,
					'maxi-block',
					'maxi-block--backend',
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

export default withMaxiProps(edit);
