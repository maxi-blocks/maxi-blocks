/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import {
	InnerBlocks as WPInnerBlocks,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { forwardRef } from '@wordpress/element';

/**
 * Component
 */
const InnerBlocks = forwardRef((props, ref) => {
	const {
		allowedBlocks = [],
		templateLock = false,
		template = [],
		tagName = 'div',
		className,
		orientation = 'horizontal',
		renderAppender = false,
	} = props;

	if (!useInnerBlocksProps)
		return (
			<WPInnerBlocks
				allowedBlocks={allowedBlocks}
				templateLock={templateLock}
				template={template}
				orientation={orientation}
				__experimentalTagName={tagName}
				__experimentalPassedProps={{
					className,
				}}
				renderAppender={renderAppender}
			/>
		);

	const innerBlocksProps = useInnerBlocksProps(
		{ className },
		{
			wrapperRef: ref,
			allowedBlocks,
			templateLock,
			template,
			orientation,
			renderAppender,
		}
	);

	const TagName = tagName;

	return <TagName {...innerBlocksProps} />;
});

InnerBlocks.ButtonBlockAppender = WPInnerBlocks.ButtonBlockAppender;

export default InnerBlocks;
