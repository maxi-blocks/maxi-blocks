/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { BlockInserter, Toolbar } from '../../components';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import getStyles from './styles';
import SliderContext from '../slider-maxi/context';
import copyPasteMapping from './copy-paste-mapping';

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

	maxiBlockDidUpdate(prevProps) {
		const { clientId, isSelected } = this.props;
		const { isSelected: wasSelected } = prevProps;
		if (
			this.context.slidesWidth[clientId] !==
			this.blockRef.current.getBoundingClientRect().width
		) {
			this.context.setSlideWidth(
				clientId,
				this.blockRef.current.getBoundingClientRect().width
			);
		}
		if (isSelected !== wasSelected && isSelected) {
			this.blockRef.current.setAttribute('data-slide-active', 'true');
		}
	}

	maxiBlockWillUnmount() {
		const { clientId } = this.props;
		this.context.onRemoveSlide(clientId);
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
				copyPasteMapping={copyPasteMapping}
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

edit.contextType = SliderContext;

export default withMaxiProps(edit);
