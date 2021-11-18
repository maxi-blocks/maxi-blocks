/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent } from '../../extensions/maxi-block';
import {
	ArrowDisplayer,
	BlockPlaceholder,
	Toolbar,
	InnerBlocks,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const {
			attributes,
			blockFullWidth,
			clientId,
			deviceType,
			hasInnerBlock,
		} = this.props;
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
					].indexOf(blockName) === -1
			);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				className={hasInnerBlock && 'has-child'}
				key={`maxi-group--${uniqueID}`}
				blockFullWidth={blockFullWidth}
				ref={this.blockRef}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<ArrowDisplayer
					{...getGroupAttributes(
						attributes,
						['blockBackground', 'arrow', 'border'],
						true
					)}
					breakpoint={deviceType}
				/>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					templateLock={false}
					className='maxi-group-block__group'
					renderAppender={
						!hasInnerBlock
							? () => <BlockPlaceholder clientId={clientId} />
							: () => <InnerBlocks.ButtonBlockAppender />
					}
				/>
			</MaxiBlock>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const hasInnerBlock = !isEmpty(
		select('core/block-editor').getBlockOrder(clientId)
	);
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		hasInnerBlock,
		deviceType,
	};
})(edit);
