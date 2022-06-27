/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { RichText, RichTextShortcut } from '@wordpress/block-editor';
import {
	insert,
	__unstableIndentListItems,
	__unstableOutdentListItems,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import {
	getColorRGBAString,
	getPaletteAttributes,
	createTransitionObj,
} from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import getStyles from './styles';
import onMerge, { onReplaceBlocks } from './utils';
import { onChangeRichText, textContext } from '../../extensions/text/formats';
import { setSVGColor } from '../../extensions/svg';
import copyPasteMapping from './copy-paste-mapping';
/**
 * External dependencies
 */
import { isEmpty, compact, flatten } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	state = {
		formatValue: {},
		onChangeFormat: null,
	};

	scProps = {
		scElements: [1, 2, 3, 4, 5, 6, 7, 8],
		scType: 'color',
	};

	typingTimeoutFormatValue = 0;

	typingTimeoutContent = 0;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	maxiBlockDidUpdate() {
		const { attributes, setAttributes } = this.props;
		const { blockStyle, isList, typeOfList, listStyle, listStyleCustom } =
			attributes;

		// Ensures svg list markers change the colour when SC color changes
		if (
			isList &&
			typeOfList === 'ul' &&
			listStyle === 'custom' &&
			listStyleCustom?.includes('<svg ')
		) {
			const { paletteStatus, paletteColor, paletteOpacity } =
				getPaletteAttributes({
					obj: attributes,
					prefix: 'list-',
				});

			if (paletteStatus) {
				const newColor = getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				});

				if (!listStyleCustom.includes(newColor))
					setAttributes({
						listStyleCustom: setSVGColor({
							svg: listStyleCustom,
							color: newColor,
							type: 'fill',
						}),
					});
			}
		}
	}

	render() {
		const {
			attributes,
			clientId,
			isSelected,
			onReplace,
			maxiSetAttributes,
		} = this.props;
		const {
			content,
			isList,
			listReversed,
			listStart,
			textLevel,
			transition,
			typeOfList,
			uniqueID,
		} = attributes;

		// Temporary code to ensure that all text-maxi transitions objects has link transitions
		// Need to be removed
		if (!transition.canvas?.link)
			maxiSetAttributes({
				transition: {
					...transition,
					canvas: {
						...transition.canvas,
						link: createTransitionObj(),
					},
				},
			});
		// End of temporary code

		/**
		 * Prevents losing general link format when the link is affecting whole content
		 *
		 * In case we add a whole link format, Gutenberg doesn't keep it when creators write new content.
		 * This method fixes it
		 */
		const processContent = content => {
			const isWholeLink =
				content.split('</a>').length === 2 &&
				content.startsWith('<a') &&
				content.indexOf('</a>') === content.length - 5;

			if (isWholeLink) {
				const newContent = content.replace('</a>', '');

				maxiSetAttributes({ content: `${newContent}</a>` });
			} else {
				if (this.typingTimeoutContent)
					clearTimeout(this.typingTimeoutContent);

				this.typingTimeoutContent = setTimeout(() => {
					maxiSetAttributes({ content });
				}, 100);
			}
		};

		return [
			<textContext.Provider
				key={`maxi-text-block__context-${uniqueID}`}
				value={{
					formatValue: this.state.formatValue,
					onChangeTextFormat: newFormatValue => {
						this.state.onChangeFormat(newFormatValue);
						onChangeRichText({
							attributes,
							maxiSetAttributes,
							oldFormatValue: this.state.formatValue,
							onChange: newState => this.setState(newState),
							richTextValues: { value: newFormatValue },
						});
					},
				}}
			>
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
				/>
				<MaxiBlock
					key={`maxi-text--${uniqueID}`}
					classes={`${
						content === ''
							? 'maxi-text-block__empty'
							: 'maxi-text-block__has-text'
					} ${isList ? 'maxi-list-block' : ''}`}
					ref={this.blockRef}
					{...getMaxiBlockAttributes(this.props)}
				>
					{!isList && (
						<RichText
							className='maxi-text-block__content'
							identifier='content'
							value={content}
							onChange={processContent}
							tagName={textLevel}
							onSplit={() => {
								this.state.onChangeFormat(
									insert(this.state.formatValue, '\n')
								);
							}}
							onReplace={(
								blocks,
								indexToSelect,
								initialPosition
							) => {
								if (
									!blocks ||
									isEmpty(compact(blocks)) ||
									flatten(blocks).every(block =>
										isEmpty(block)
									)
								)
									return;

								const { blocks: cleanBlocks } = onReplaceBlocks(
									blocks,
									clientId,
									content
								);

								if (!isEmpty(compact(cleanBlocks)))
									onReplace(
										cleanBlocks,
										indexToSelect,
										initialPosition
									);
							}}
							onMerge={forward => onMerge(this.props, forward)}
							// onRemove needs to be commented to avoid removing the block
							// on pressing backspace with the content empty 👍
							// onRemove={onRemove}
							__unstableEmbedURLOnPaste
							withoutInteractiveFormatting
							preserveWhiteSpace
						>
							{richTextValues =>
								onChangeRichText({
									attributes,
									maxiSetAttributes,
									oldFormatValue: this.state.formatValue,
									onChange: (newState, newContent) => {
										if (this.typingTimeoutFormatValue) {
											clearTimeout(
												this.typingTimeoutFormatValue
											);
										}

										this.typingTimeoutFormatValue =
											setTimeout(() => {
												this.setState(newState);
											}, 10);

										if (newContent) {
											maxiSetAttributes({
												content: newContent,
											});
										}
									},
									richTextValues,
								})
							}
						</RichText>
					)}
					{isList && (
						<RichText
							className='maxi-text-block__content'
							identifier='content'
							multiline='li'
							value={content}
							onChange={processContent}
							tagName={typeOfList}
							onSplit={() => {
								this.state.onChangeFormat(
									insert(this.state.formatValue, '\n')
								);
							}}
							onReplace={(
								blocks,
								indexToSelect,
								initialPosition
							) => {
								if (
									!blocks ||
									isEmpty(compact(blocks)) ||
									flatten(blocks).every(block =>
										isEmpty(block)
									)
								)
									return;

								const { blocks: cleanBlocks } = onReplaceBlocks(
									blocks,
									clientId,
									content
								);

								if (!isEmpty(compact(cleanBlocks)))
									onReplace(
										cleanBlocks,
										indexToSelect,
										initialPosition
									);
							}}
							onMerge={forward => onMerge(this.props, forward)}
							// onRemove needs to be commented to avoid removing the block
							// on pressing backspace with the content empty 👍
							// onRemove={onRemove}
							start={listStart}
							reversed={listReversed}
							type={typeOfList}
						>
							{richTextValues => {
								const { value: formatValue, onChange } =
									richTextValues;

								onChangeRichText({
									attributes,
									maxiSetAttributes,
									oldFormatValue: this.state.formatValue,
									onChange: newState => {
										if (this.typingTimeoutFormatValue) {
											clearTimeout(
												this.typingTimeoutFormatValue
											);
										}

										this.typingTimeoutFormatValue =
											setTimeout(() => {
												this.setState(newState);
											}, 10);
									},
									richTextValues,
								});

								if (isSelected)
									return (
										<>
											<RichTextShortcut
												type='primary'
												character='['
												onUse={() => {
													onChange(
														__unstableOutdentListItems(
															formatValue
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
															formatValue,
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
															formatValue,
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
															formatValue
														)
													);
												}}
											/>
										</>
									);

								return null;
							}}
						</RichText>
					)}
				</MaxiBlock>
			</textContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
