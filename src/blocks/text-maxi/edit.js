/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { Fragment } = wp.element;
const { createBlock } = wp.blocks;
const { select, withSelect, withDispatch } = wp.data;
const { __experimentalBlock, RichText, RichTextShortcut } = wp.blockEditor;
const { __unstableIndentListItems, __unstableOutdentListItems } = wp.richText;

/**
 * Internal dependencies
 */
import defaultTypography from '../../extensions/defaults/typography';
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getAlignmentTextObject,
	getOpacityObject,
	getTransformObject,
	setBackgroundStyles,
	setTextCustomFormats,
	getLastBreakpointValue,
} from '../../utils';
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalBackgroundDisplayer,
} from '../../components';
import {
	__experimentalGetFormatValue,
	__experimentalSetCustomFormatsWhenPaste,
	__experimentalFromListToText,
	__experimentalFromTextToList,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getObject() {
		const {
			uniqueID,
			background,
			backgroundHover,
			typography,
			typographyHover,
		} = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID} .maxi-text-block__content`]: this.getTypographyObject,
			[`${uniqueID} .maxi-text-block__content:hover`]: this
				.getTypographyHoverObject,
			[`${uniqueID} .maxi-text-block__content li`]: this
				.getTypographyObject,
			[`${uniqueID} .maxi-text-block__content li:hover`]: this
				.getTypographyHoverObject,
			[`${uniqueID} .maxi-text-block__content a`]: this
				.getTypographyObject,
			[`${uniqueID} .maxi-text-block__content a:hover`]: this
				.getTypographyHoverObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		response = Object.assign(
			response,
			setTextCustomFormats(
				[
					`${uniqueID} .maxi-text-block__content`,
					`${uniqueID} .maxi-text-block__content li`,
				],
				typography,
				typographyHover
			)
		);

		return response;
	}

	get getNormalObject() {
		const {
			alignment,
			opacity,
			boxShadow,
			border,
			size,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			size: { ...JSON.parse(size) },
			opacity: { ...getOpacityObject(JSON.parse(opacity)) },
			zIndex: { ...JSON.parse(zIndex) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
		};

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		return response;
	}

	get getTypographyObject() {
		const { typography, margin, padding } = this.props.attributes;

		const response = {
			typography: { ...JSON.parse(typography) },
			margin: { ...JSON.parse(margin) },
			padding: { ...JSON.parse(padding) },
		};

		return response;
	}

	get getTypographyHoverObject() {
		const { typographyHover } = this.props.attributes;

		const response = {
			typographyHover: { ...JSON.parse(typographyHover) },
		};

		return response;
	}

	render() {
		const {
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				extraClassName,
				background,
				textLevel,
				content,
				isList,
				typeOfList,
				listStart,
				listReversed,
				fullWidth,
				typography,
				display,
			},
			node,
			className,
			isSelected,
			setAttributes,
			onRemove,
			onMerge,
			onSplit,
			onReplace,
			deviceType,
		} = this.props;

		const name = 'maxi-blocks/text-maxi';

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const classes = classnames(
			'maxi-block maxi-text-block',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			extraClassName,
			uniqueID,
			className
		);

		const { getFormatTypes } = select('core/rich-text');

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBlock
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
				data-align={fullWidth}
			>
				<__experimentalBackgroundDisplayer background={background} />
				{!isList && (
					<RichText
						className='maxi-text-block__content'
						value={content}
						onChange={content => {
							setAttributes({ content });

							const formatElement = {
								element: node,
								html: content,
								multilineTag: isList ? 'li' : undefined,
								multilineWrapperTags: isList
									? typeOfList
									: undefined,
								__unstableIsEditableTree: false,
							};
							const formatValue = __experimentalGetFormatValue(
								formatElement
							);

							/**
							 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
							 * and add some coding manually
							 * This next script will check if there is any format directly related with
							 * native format 'core/link' and if it's so, will format it in Maxi Blocks way
							 */
							const cleanCustomProps = __experimentalSetCustomFormatsWhenPaste(
								{
									formatValue,
									typography: JSON.parse(typography),
									isList,
									typeOfList,
									content,
								}
							);

							if (cleanCustomProps)
								setAttributes({
									typography: JSON.stringify(
										cleanCustomProps.typography
									),
									content: cleanCustomProps.content,
								});
						}}
						tagName={textLevel}
						onSplit={onSplit}
						onReplace={onReplace}
						onMerge={onMerge}
						onRemove={onRemove}
						placeholder={__(
							'Set your Maxi Text here…',
							'maxi-blocks'
						)}
						keepPlaceholderOnFocus
						__unstableEmbedURLOnPaste
						__unstableAllowPrefixTransformations
						allowedFormats={getFormatTypes().filter(format => {
							return format.name !== 'core/link';
						})}
					/>
				)}
				{isList && (
					<RichText
						className='maxi-text-block__content'
						identifier='content'
						multiline='li'
						__unstableMultilineRootTag={typeOfList}
						tagName={typeOfList}
						onChange={content => setAttributes({ content })}
						value={content}
						placeholder={__('Write list…', 'maxi-blocks')}
						onMerge={onMerge}
						onSplit={value => {
							if (!value) {
								return createBlock(name, {
									...this.props.attributes,
									isList: false,
								});
							}

							return createBlock(name, {
								...this.props.attributes,
								content: value,
							});
						}}
						__unstableOnSplitMiddle={() =>
							createBlock('maxi-blocks/text-maxi')
						}
						onReplace={onReplace}
						onRemove={onRemove}
						start={listStart}
						reversed={!!listReversed}
						type={typeOfList}
						allowedFormats={getFormatTypes().filter(format => {
							return format.name !== 'core/link';
						})}
					>
						{({ value, onChange }) =>
							isSelected && (
								<Fragment>
									<RichTextShortcut
										type='primary'
										character='['
										onUse={() => {
											onChange(
												__unstableOutdentListItems(
													value
												)
											);
										}}
									/>
									<RichTextShortcut
										type='primary'
										character=']'
										onUse={() => {
											onChange(
												__unstableIndentListItems(
													value,
													{ type: typeOfList }
												)
											);
										}}
									/>
									<RichTextShortcut
										type='primary'
										character='m'
										onUse={() => {
											onChange(
												__unstableIndentListItems(
													value,
													{ type: typeOfList }
												)
											);
										}}
									/>
									<RichTextShortcut
										type='primaryShift'
										character='m'
										onUse={() => {
											onChange(
												__unstableOutdentListItems(
													value
												)
											);
										}}
									/>
								</Fragment>
							)
						}
					</RichText>
				)}
			</__experimentalBlock>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const {
		attributes: { content, isList, typeOfList },
		clientId,
	} = ownProps;

	const node = document.getElementById(`block-${clientId}`);

	const formatElement = {
		element: node,
		html: content,
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: false,
	};
	const formatValue = __experimentalGetFormatValue(formatElement);

	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		node,
		formatValue,
		deviceType,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: { typography, content },
		setAttributes,
		clientId,
	} = ownProps;

	const name = 'maxi-blocks/text-maxi';

	const {
		getBlockIndex,
		getBlockRootClientId,
		getNextBlockClientId,
		getPreviousBlockClientId,
		getBlockAttributes,
	} = select('core/block-editor');

	const {
		insertBlock,
		removeBlock,
		selectBlock,
		updateBlockAttributes,
	} = dispatch('core/block-editor');

	const onReplace = blocks => {
		const currentBlocks = blocks.filter(item => !!item);

		if (isEmpty(currentBlocks)) {
			insertBlock(createBlock(name, getBlockAttributes(name)));
			return;
		}

		currentBlocks.forEach((block, i) => {
			let newBlock = {};

			switch (block.name) {
				case 'core/list': {
					const textTypography = JSON.stringify({
						...JSON.parse(typography),
						...defaultTypography.p,
					});

					newBlock = createBlock(name, {
						...ownProps.attributes,
						textLevel: block.attributes.ordered ? 'ol' : 'ul',
						typeOfList: block.attributes.ordered ? 'ol' : 'ul',
						content: block.attributes.values,
						isList: true,
						typography: textTypography,
					});
					break;
				}
				case 'core/image':
					newBlock = createBlock('maxi-blocks/image-maxi', {
						...getBlockAttributes('maxi-blocks/image-maxi'),
						mediaURL: block.attributes.url,
						altSelector: 'custom',
						mediaALT: block.attributes.alt,
						captionType:
							(!isEmpty(block.attributes.caption) && 'custom') ||
							'none',
						captionContent: block.attributes.caption,
					});
					break;
				case 'core/heading': {
					const headingLevel = block.attributes.level;
					const headingTypography = JSON.stringify({
						...JSON.parse(typography),
						...defaultTypography[`h${headingLevel}`],
					});
					newBlock = createBlock(name, {
						...ownProps.attributes,
						textLevel: `h${headingLevel}`,
						content: block.attributes.content,
						typography: headingTypography,
						isList: false,
					});
					break;
				}
				case 'core/paragraph': {
					const textTypography = JSON.stringify({
						...JSON.parse(typography),
						...defaultTypography.p,
					});

					newBlock = createBlock(name, {
						...ownProps.attributes,
						content: block.attributes.content,
						textLevel: 'p',
						typography: textTypography,
					});
					break;
				}
				case 'maxi-blocks/text-maxi':
					if (block.attributes.isList) {
						newBlock = createBlock(name, {
							...block.attributes,
						});
					} else {
						newBlock = createBlock(name, {
							...ownProps.attributes,
							content: block.attributes.content,
							isList: false,
						});
					}
					break;
				default:
					newBlock = block;
					break;
			}

			insertBlock(
				newBlock,
				getBlockIndex(clientId),
				getBlockRootClientId(clientId)
			).then(block => {
				const {
					attributes: { content, isList, typeOfList },
					clientId,
				} = block.blocks[0];
				const node = document.getElementById(`block-${clientId}`);

				const formatElement = {
					element: node,
					html: content,
					multilineTag: isList ? 'li' : undefined,
					multilineWrapperTags: isList ? typeOfList : undefined,
					__unstableIsEditableTree: false,
				};
				const formatValue = __experimentalGetFormatValue(formatElement);

				/**
				 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
				 * and add some coding manually
				 * This next script will check if there is any format directly related with
				 * native format 'core/link' and if it's so, will format it in Maxi Blocks way
				 */
				const cleanCustomProps = __experimentalSetCustomFormatsWhenPaste(
					{
						formatValue,
						typography: JSON.parse(typography),
						isList,
						typeOfList,
						content,
					}
				);

				if (cleanCustomProps)
					updateBlockAttributes(clientId, {
						typography: JSON.stringify(cleanCustomProps.typography),
						content: cleanCustomProps.content,
					});
			});

			i === currentBlocks.length - 1 && selectBlock(block.clientId);
		});

		removeBlock(clientId);
	};

	const onMerge = forward => {
		if (forward) {
			const nextBlockClientId = getNextBlockClientId(clientId);

			if (nextBlockClientId) {
				const nextBlockAttributes = getBlockAttributes(
					nextBlockClientId
				);
				const nextBlockContent = nextBlockAttributes.content;
				const newBlockIsList = nextBlockAttributes.isList;

				setAttributes({
					content: content.concat(
						newBlockIsList
							? __experimentalFromListToText(nextBlockContent)
							: __experimentalFromTextToList(nextBlockContent)
					),
				});

				removeBlock(nextBlockClientId);
			}
		} else {
			const previousBlockClientId = getPreviousBlockClientId(clientId);

			if (!previousBlockClientId) {
				removeBlock(clientId);
			} else {
				const previousBlockAttributes = getBlockAttributes(
					previousBlockClientId
				);
				const previousBlockContent = previousBlockAttributes.content;

				updateBlockAttributes(previousBlockClientId, {
					content: previousBlockContent.concat(
						ownProps.attributes.isList
							? __experimentalFromListToText(content)
							: content
					),
				});

				removeBlock(clientId);
			}
		}
	};

	const onSplit = value => {
		if (!value) {
			return createBlock(name);
		}

		return createBlock(name, {
			...ownProps.attributes,
			content: value,
		});
	};

	return {
		onReplace,
		onMerge,
		onSplit,
	};
});

export default compose(editSelect, editDispatch)(edit);
