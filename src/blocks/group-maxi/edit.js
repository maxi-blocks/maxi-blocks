/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { InnerBlocks, __experimentalBlock } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	ArrowDisplayer,
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
	getPaletteClasses,
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

	componentDidMount() {
		/*
		we have not accessed to the clientId in the save the file,
		so saved it in attributes, in future we should find a better solution :)
		*/
		const { setAttributes, clientId } = this.props;

		setAttributes({
			clientId,
		});
	}

	render() {
		const {
			attributes,
			className,
			clientId,
			hasInnerBlock,
			deviceType,
		} = this.props;
		const { uniqueID, blockStyle, extraClassName, fullWidth } = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-group-block',
			'maxi-motion-effect',
			`maxi-motion-effect-${uniqueID}`,
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			getPaletteClasses(
				attributes,
				blockStyle,
				[
					'background',
					'background-hover',
					'border',
					'border-hover',
					'box-shadow',
					'box-shadow-hover',
				],
				'',
				clientId
			),
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
						'maxi-blocks/column-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				blockStyle={blockStyle}
				{...this.props}
			/>,
			<Breadcrumbs key={`breadcrumbs-${uniqueID}`} />,
			<MotionPreview
				key={`motion-preview-${uniqueID}`}
				{...getGroupAttributes(attributes, 'motion')}
			>
				<__experimentalBlock.section
					className={classes}
					data-align={fullWidth}
				>
					<ArrowDisplayer
						{...getGroupAttributes(attributes, 'arrow')}
						breakpoint={deviceType}
					/>
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
