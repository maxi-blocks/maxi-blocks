/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	ArrowDisplayer,
	BlockPlaceholder,
	MaxiBlockComponent,
	Toolbar,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Edit
 */

class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']) ||
			!!this.props.attributes['parallax-status'];

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
						'parallax',
					]),
				}),
			},
		};
	}

	render() {
		const { attributes, clientId, hasInnerBlock, deviceType } = this.props;
		const { uniqueID, parentBlockStyle } = attributes;

		const classes = classnames(
			'maxi-group-block',
			getPaletteClasses(
				attributes,
				[
					'background',
					'background-hover',
					'border',
					'border-hover',
					'box-shadow',
					'box-shadow-hover',
				],
				'maxi-blocks/group-maxi',
				parentBlockStyle
			)
		);

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
						'maxi-blocks/row-maxi',
						'maxi-blocks/column-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-group--${uniqueID}`}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<ArrowDisplayer
					{...getGroupAttributes(attributes, 'arrow')}
					breakpoint={deviceType}
				/>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					templateLock={false}
					__experimentalTagName='div'
					__experimentalPassedProps={{
						className: 'maxi-group-block__group',
					}}
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
