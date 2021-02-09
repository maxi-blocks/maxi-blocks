/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const { InnerBlocks, __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	BackgroundDisplayer,
	BlockPlaceholder,
	Breadcrumbs,
	MaxiBlock,
	MotionPreview,
	Toolbar,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Edit
 */

class edit extends MaxiBlock {
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
		const {
			attributes,
			className,
			clientId,
			hasInnerBlock,
			deviceType,
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			extraClassName,
		} = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-group-block',
			'maxi-motion-effect',
			`maxi-motion-effect-${uniqueID}`,
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			!!attributes['background-highlight'] &&
				'maxi-highlight--background',
			!!attributes['border-highlight'] && 'maxi-highlight--border',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			className
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
					].indexOf(blockName) === -1
			);

		return [
			<Inspector {...this.props} />,
			<Toolbar {...this.props} />,
			<Breadcrumbs />,
			<MotionPreview {...getGroupAttributes(attributes, 'motion')}>
				<__experimentalBlock.section
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
				>
					{!attributes['background-highlight'] && (
						<BackgroundDisplayer
							{...getGroupAttributes(attributes, [
								'background',
								'backgroundColor',
								'backgroundImage',
								'backgroundVideo',
								'backgroundGradient',
								'backgroundSVG',
								'backgroundHover',
								'backgroundColorHover',
								'backgroundImageHover',
								'backgroundVideoHover',
								'backgroundGradientHover',
								'backgroundSVGHover',
							])}
							blockClassName={uniqueID}
						/>
					)}
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
				</__experimentalBlock.section>
			</MotionPreview>,
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
