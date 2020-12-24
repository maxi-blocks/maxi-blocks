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
	setTextCustomFormats,
	getLastBreakpointValue,
	setBackgroundStyles,
} from '../../utils';
import {
	MaxiBlock,
	Toolbar,
	BackgroundDisplayer,
	MotionPreview,
} from '../../components';
import {
	getFormatValue,
	setCustomFormatsWhenPaste,
	fromListToText,
	fromTextToList,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	state = {
		formatValue: this.props.generateFormatValue() || {},
		textSelected: '',
	};

	componentDidMount() {
		const { alignment } = this.props.attributes;
		const { isRTL } = select('core/editor').getEditorSettings();

		if (isEmpty(alignment.general.alignment)) {
			alignment.general.alignment = isRTL ? 'right' : 'left';
			this.props.setAttributes({ alignment });
		}

		this.displayStyles();
	}

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
			setBackgroundStyles({
				target: uniqueID,
				background,
				backgroundHover,
			})
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
			size,
			zIndex,
			position,
			display,
			transform,
			margin,
			padding,
			border,
			boxShadow,
		} = this.props.attributes;

		const response = {
			alignment: getAlignmentTextObject(alignment),
			size,
			opacity: getOpacityObject(opacity),
			zIndex,
			position,
			positionOptions: position.options,
			display,
			transform: getTransformObject(transform),
			margin,
			padding,
			border,
			borderWidth: border.borderWidth,
			borderRadius: border.borderRadius,
			boxShadow: getBoxShadowObject(boxShadow),
		};

		return response;
	}

	get getHoverObject() {
		const { borderHover, boxShadowHover } = this.props.attributes;

		const response = {
			borderWidthHover: borderHover.borderWidth,
			borderRadiusHover: borderHover.borderRadius,
		};

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = getBoxShadowObject(boxShadowHover);
		}

		if (!isNil(borderHover) && !!borderHover.status) {
			response.borderHover = borderHover;
		}

		return response;
	}

	get getTypographyObject() {
		const { typography } = this.props.attributes;

		const response = {
			typography,
		};
		return response;
	}

	get getTypographyHoverObject() {
		const { typographyHover } = this.props.attributes;

		const response = {};

		if (!isNil(typographyHover) && !typographyHover.status) {
			response.typographyHover = typographyHover;
		}

		return response;
	}

	get getCustomData() {
		const { uniqueID, motion } = this.props.attributes;

		const motionStatus =
			!!motion.interaction.interactionStatus || !!motion.parallax.status;

		return {
			[uniqueID]: {
				...(motionStatus && { motion }),
			},
		};
	}

	render() {
		const {
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				blockStyleBackground,
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
				motion,
			},
			className,
			isSelected,
			setAttributes,
			onRemove,
			onMerge,
			onSplit,
			onReplace,
			deviceType,
			selectedText,
			generateFormatValue,
		} = this.props;
		const { formatValue, textSelected } = this.state;
		const name = 'maxi-blocks/text-maxi';
		const display = { ...this.props.attributes.display };
		const highlight = { ...this.props.attributes.highlight };
		const {
			textHighlight,
			backgroundHighlight,
			borderHighlight,
		} = highlight;

		if (isEmpty(formatValue) || selectedText !== textSelected)
			this.setState({
				formatValue: generateFormatValue(),
				textSelected: selectedText,
			});

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-text-block',
			getLastBreakpointValue(display, 'display', deviceType) === 'none' &&
				'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			!!textHighlight && 'maxi-highlight--text',
			!!backgroundHighlight && 'maxi-highlight--background',
			!!borderHighlight && 'maxi-highlight--border',
			extraClassName,
			uniqueID,
			className
		);

		const { getFormatTypes } = select('core/rich-text');

		return [
			<Inspector {...this.props} formatValue={formatValue} />,
			<Toolbar {...this.props} formatValue={formatValue} />,
			<MotionPreview motion={motion}>
				<__experimentalBlock
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					data-align={fullWidth}
					onClick={() =>
						this.setState({ formatValue: generateFormatValue() })
					}
				>
					<BackgroundDisplayer background={background} />
					{!isList && (
						<RichText
							className='maxi-text-block__content'
							value={content}
							onChange={content => {
								setAttributes({ content });

								const formatElement = {
									multilineTag: isList ? 'li' : undefined,
									multilineWrapperTags: isList
										? typeOfList
										: undefined,
								};
								const formatValue = getFormatValue(
									formatElement
								);

								/**
								 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
								 * and add some coding manually
								 * This next script will check if there is any format directly related with
								 * native format 'core/link' and if it's so, will format it in Maxi Blocks way
								 */
								const cleanCustomProps = setCustomFormatsWhenPaste(
									{
										formatValue,
										typography,
										isList,
										typeOfList,
										content,
									}
								);

								if (cleanCustomProps)
									setAttributes({
										typography: cleanCustomProps.typography,
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
				</__experimentalBlock>
			</MotionPreview>,
		];
	}
}

const editSelect = withSelect(select => {
	const selectedText = window.getSelection().toString();
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		// The 'selectedText' attribute is a trigger for generating the formatValue
		selectedText,
		deviceType,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: { typography, content, isList, typeOfList },
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
					const textTypography = {
						...typography,
						...defaultTypography.p,
					};

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
					const headingTypography = {
						...typography,
						...defaultTypography[`h${headingLevel}`],
					};
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
					const textTypography = {
						...typography,
						...defaultTypography.p,
					};

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

				const formatElement = {
					multilineTag: isList ? 'li' : undefined,
					multilineWrapperTags: isList ? typeOfList : undefined,
				};
				const formatValue = getFormatValue(formatElement);

				/**
				 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
				 * and add some coding manually
				 * This next script will check if there is any format directly related with
				 * native format 'core/link' and if it's so, will format it in Maxi Blocks way
				 */
				const cleanCustomProps = setCustomFormatsWhenPaste({
					formatValue,
					typography,
					isList,
					typeOfList,
					content,
				});

				if (cleanCustomProps)
					updateBlockAttributes(clientId, {
						typography: cleanCustomProps.typography,
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
							? fromListToText(nextBlockContent)
							: fromTextToList(nextBlockContent)
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
							? fromListToText(content)
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

	const generateFormatValue = () => {
		const formatElement = {
			multilineTag: isList ? 'li' : undefined,
			multilineWrapperTags: isList ? typeOfList : undefined,
			__unstableIsEditableTree: true,
		};
		const formatValue = getFormatValue(formatElement);

		return formatValue;
	};

	return {
		onReplace,
		onMerge,
		onSplit,
		generateFormatValue,
	};
});

export default compose(editSelect, editDispatch)(edit);
