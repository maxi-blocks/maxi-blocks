/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { select, withSelect, withDispatch, dispatch } from '@wordpress/data';
import {
	__experimentalBlock,
	RichText,
	RichTextShortcut,
} from '@wordpress/block-editor';
import {
	__unstableIndentListItems,
	__unstableOutdentListItems,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { defaultTypography } from '../../extensions/text';
import Inspector from './inspector';
import {
	MaxiBlock,
	Toolbar,
	BackgroundDisplayer,
	MotionPreview,
} from '../../components';
import {
	fromListToText,
	fromTextToList,
	generateFormatValue,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';
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
 * Content
 */
class edit extends MaxiBlock {
	propsToAvoidRendering = ['formatValue'];

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
			isSelected,
			setAttributes,
			onRemove,
			onMerge,
			onSplit,
			onReplace,
			deviceType,
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			blockStyleBackground,
			extraClassName,
			textLevel,
			content,
			isList,
			typeOfList,
			listStart,
			listReversed,
			fullWidth,
		} = attributes;

		const name = 'maxi-blocks/text-maxi';

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-text-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			!!attributes['text-highlight'] && 'maxi-highlight--text',
			!!attributes['background-highlight'] &&
				'maxi-highlight--background',
			!!attributes['border-highlight'] && 'maxi-highlight--border',
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['content', 'formatValue']}
			/>,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MotionPreview
				key={`motion-preview-${uniqueID}`}
				{...getGroupAttributes(attributes, 'motion')}
			>
				<__experimentalBlock className={classes} data-align={fullWidth}>
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
					{!isList && (
						<RichText
							ref={this.blockRef}
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

								const formatValue = generateFormatValue(
									formatElement,
									this.blockRef ? this.blockRef.current : null
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
										typography: getGroupAttributes(
											attributes,
											'typography'
										),
										isList,
										typeOfList,
										content,
									}
								);

								if (cleanCustomProps)
									setAttributes(cleanCustomProps);
							}}
							tagName={textLevel}
							onSplit={onSplit}
							onReplace={blocks =>
								onReplace(
									blocks,
									this.blockRef ? this.blockRef.current : null
								)
							}
							onMerge={onMerge}
							onRemove={onRemove}
							placeholder={__(
								'Set your Maxi Text here…',
								'maxi-blocks'
							)}
							keepPlaceholderOnFocus
							__unstableEmbedURLOnPaste
							__unstableAllowPrefixTransformations
						>
							{({ value }) => {
								dispatch('maxiBlocks/text').sendFormatValue(
									value
								);
							}}
						</RichText>
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
							onReplace={blocks =>
								onReplace(
									blocks,
									this.blockRef ? this.blockRef.current : null
								)
							}
							onRemove={onRemove}
							start={listStart}
							reversed={!!listReversed}
							type={typeOfList}
						>
							{({ value, onChange }) => {
								dispatch('maxiBlocks/text').sendFormatValue(
									value
								);

								if (isSelected)
									return (
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
									);

								return null;
							}}
						</RichText>
					)}
				</__experimentalBlock>
			</MotionPreview>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const { attributes, setAttributes, clientId } = ownProps;
	const { content } = attributes;

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

	const { getFormatValue } = select('maxiBlocks/text');

	const onReplace = (blocks, node) => {
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
						...getGroupAttributes(attributes, 'typography'),
						...defaultTypography.p,
					};

					newBlock = createBlock(name, {
						...ownProps.attributes,
						textLevel: block.attributes.ordered ? 'ol' : 'ul',
						typeOfList: block.attributes.ordered ? 'ol' : 'ul',
						content: block.attributes.values,
						isList: true,
						...textTypography,
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
						...getGroupAttributes(attributes, 'typography'),
						...defaultTypography[`h${headingLevel}`],
					};

					newBlock = createBlock(name, {
						...ownProps.attributes,
						textLevel: `h${headingLevel}`,
						content: block.attributes.content,
						...headingTypography,
						isList: false,
					});
					break;
				}
				case 'core/paragraph': {
					const textTypography = {
						...getGroupAttributes(attributes, 'typography'),
						...defaultTypography.p,
					};

					newBlock = createBlock(name, {
						...ownProps.attributes,
						content: block.attributes.content,
						textLevel: 'p',
						...textTypography,
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

				const formatValue = getFormatValue();

				/**
				 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
				 * and add some coding manually
				 * This next script will check if there is any format directly related with
				 * native format 'core/link' and if it's so, will format it in Maxi Blocks way
				 */
				const cleanCustomProps = setCustomFormatsWhenPaste({
					formatValue,
					typography: getGroupAttributes(attributes, 'typography'),
					isList,
					typeOfList,
					content,
				});

				if (cleanCustomProps)
					updateBlockAttributes(clientId, cleanCustomProps);
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

	return {
		onReplace,
		onMerge,
		onSplit,
	};
});

export default compose(editSelect, editDispatch)(edit);
