/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { RichText, RichTextShortcut } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { resolveSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const Inspector = loadable(() => import('./inspector'));
const Toolbar = loadable(() => import('../../components/toolbar'));
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { RawHTML } from '../../components';
import {
	getColorRGBAString,
	getPaletteAttributes,
	getGroupAttributes,
} from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import getStyles from './styles';
import onMerge from './utils';
import { onChangeRichText, textContext } from '../../extensions/text/formats';
import { setSVGColor } from '../../extensions/svg';
import { copyPasteMapping, scProps } from './data';
import { indentListItems, outdentListItems } from '../../extensions/text/lists';
import { getDCValues, withMaxiContextLoopContext } from '../../extensions/DC';
import withMaxiDC from '../../extensions/DC/withMaxiDC';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	state = {
		formatValue: {},
		onChangeFormat: null,
		wpVersion: 6.3,
	};

	scProps = scProps;

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

		// Ensures white-space is applied from Maxi and not with inline styles
		if (this.blockRef?.current?.children)
			Array.from(this.blockRef.current.children).forEach(el => {
				if (el.style.whiteSpace) el.style.whiteSpace = null;
			});
	}

	shiftEnterPressed = false;

	handleKeyDown = event => {
		const { isList } = this.props.attributes;
		if (this.state.wpVersion >= 6.4 && isList) {
			if (event.key === 'Enter') {
				event.preventDefault();
				if (event.shiftKey) {
					console.log('shift enter');
					// Update the class property when Shift+Enter is pressed
					this.shiftEnterPressed = true;
					this.insertNewListItem();
				} else {
					this.insertNewListItem();
				}
			}
		}
	};

	insertNewListItem = () => {
		const { maxiSetAttributes } = this.props;

		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		if (!range.collapsed) return;

		let cursorNode = range.startContainer;
		const rangeStartOffset = range.startOffset;

		// Ensure cursorNode is an element
		if (cursorNode.nodeType !== Node.ELEMENT_NODE) {
			cursorNode = cursorNode.parentNode;
		}

		const liElement = cursorNode.closest('li');
		if (!liElement) return;

		let clonedLi = liElement;

		if (rangeStartOffset !== 0) {
			// Clone the list item
			clonedLi = liElement.cloneNode(true);
			liElement.parentNode.insertBefore(clonedLi, liElement.nextSibling);
		}

		const textNode =
			range.startContainer.nodeType === Node.TEXT_NODE
				? range.startContainer
				: null;
		if (textNode) {
			if (
				rangeStartOffset === 0 &&
				liElement.parentNode.firstChild === liElement
			) {
				// Cursor is at the beginning of the first list item
				// Create a new empty list item and insert it before the current first list item
				const newLi = document.createElement('li');
				newLi.innerHTML =
					'<span class="list-item-placeholder" contenteditable="true">&zwnj;</span>';
				console.log('liElement', liElement);

				liElement.parentNode.insertBefore(newLi, liElement);
				console.log(liElement.parentNode);

				// Set focus to the new placeholder
				setTimeout(() => {
					const placeholder = newLi.querySelector(
						'.list-item-placeholder'
					);
					if (placeholder) {
						placeholder.focus();
						const range = document.createRange();
						range.selectNodeContents(placeholder);
						range.collapse(true);
						const selection = window.getSelection();
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}, 0);
			}

			// Check if the cursor is at the end of the text node
			else if (rangeStartOffset === textNode.length) {
				console.log('rangeStartOffset === textNode.length');
				// Use a contenteditable span with &zwnj; as a placeholder
				clonedLi.innerHTML =
					'<span class="list-item-placeholder" contenteditable="true">&zwnj;</span>';
			} else {
				console.log('else');
				const textAfterCursor = textNode.splitText(rangeStartOffset);
				clonedLi.innerHTML = ''; // Clear the cloned list item
				clonedLi.appendChild(textAfterCursor); // Add the split text and everything after it
			}
		} else {
			console.log('else no textNode');
			// If there's no textNode, then use the placeholder
			clonedLi.innerHTML =
				'<span class="list-item-placeholder" contenteditable="true">&zwnj;</span>';
		}

		// Serialize the modified list back to HTML
		const listHtml = liElement.parentNode.innerHTML;
		console.log('listHtml', listHtml);
		maxiSetAttributes({ content: listHtml });
	};

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
			typeOfList,
			uniqueID,
		} = attributes;

		const {
			status: dcStatus,
			content: dcContent,
			containsHtml: dcContainsHTML,
		} = getDCValues(
			getGroupAttributes(attributes, 'dynamicContent'),
			this.props?.contextLoopContext?.contextLoop
		);

		const className = 'maxi-text-block__content';
		const DCTagName = textLevel;

		const { receiveMaxiSettings } = resolveSelect('maxiBlocks');
		receiveMaxiSettings().then(maxiSettings => {
			const version = maxiSettings?.core?.version;
			if (version) {
				const convertVersionStringToNumber = versionString => {
					// This regex matches the first two groups of digits separated by a dot
					const matches = versionString.match(/^(\d+\.\d+)/);
					return matches ? parseFloat(matches[1]) : null;
				};
				const wpVersion = convertVersionStringToNumber(version);
				this.setState({ wpVersion });
			}
		});

		// Function to set the cursor to the end of the list-item-placeholder
		const setCursorToEndOfPlaceholder = () => {
			const placeholder = document.querySelector(
				'.list-item-placeholder'
			);
			console.log('placeholder', placeholder);
			if (placeholder) {
				const range = document.createRange();
				const selection = window.getSelection();
				range.selectNodeContents(placeholder);
				range.collapse(false); // Collapse the range to the end
				selection.removeAllRanges();
				selection.addRange(range);
			}
		};

		/**
		 * Prevents losing general link format when the link is affecting whole content
		 *
		 * In case we add a whole link format, Gutenberg doesn't keep it when creators write new content.
		 * This method fixes it
		 */
		const processContent = rawContent => {
			if (!this.shiftEnterPressed) {
				console.log('processContent');
				console.log('rawContent', rawContent);
				console.log(
					'this.props.attributes.content',
					this.props.attributes.content
				);
				if (rawContent === this.props.attributes.content) {
					return;
				}

				let content = rawContent;

				if (isList && this.state.wpVersion >= 6.4) {
					// Detect text at the beginning of rawContent outside of <li> tags
					const firstLiStartIndex = rawContent.indexOf('<li>');

					if (firstLiStartIndex !== -1) {
						// Extract the text that precedes the first <li> tag
						const extraTextAtStart = rawContent.substring(
							0,
							firstLiStartIndex
						);

						if (extraTextAtStart.trim().length > 0) {
							// Insert the extra text into the first <li> with a list-item-placeholder
							const adjustedContent =
								this.props.attributes.content.replace(
									/(<li[^>]*><span class="list-item-placeholder" contenteditable="true">).*?(<\/span><\/li>)/,
									`$1${extraTextAtStart}$2`
								);

							console.log(
								'adjusted content beginning',
								adjustedContent
							);
							maxiSetAttributes({ content: adjustedContent });

							// After updating the content, programmatically set the cursor position
							setTimeout(() => {
								setCursorToEndOfPlaceholder();
							}, 0);
						}
					}

					// Detect text at the end of rawContent outside of <li> tags
					const lastLiEndIndex = rawContent.lastIndexOf('</li>') + 5;
					// Extract the extra text from rawContent
					const extraText = rawContent.substring(lastLiEndIndex);

					if (extraText.trim().length > 0) {
						// Append the extra text to the content inside the last list-item-placeholder
						const adjustedContent =
							this.props.attributes.content.replace(
								/(<span class="list-item-placeholder" contenteditable="true">)(.*?)(<\/span><\/li>)/,
								(_, startTag, currentText, endTag) =>
									`${startTag}${currentText}${extraText}${endTag}`
							);

						console.log('adjusted content', adjustedContent);
						maxiSetAttributes({ content: adjustedContent });
						// After updating the content, programmatically set the cursor position
						setTimeout(() => {
							setCursorToEndOfPlaceholder();
						}, 0);
					}
				} else {
					// Replace last space with &nbsp; to prevent losing it in Firefox #4194
					const replaceSpaces = content => {
						return content.replace(/(>)(\s+)(<)/g, '$1&nbsp;$3');
					};

					content = replaceSpaces(content);

					const isWholeLink =
						content.split('</a>').length === 2 &&
						content.startsWith('<a') &&
						content.indexOf('</a>') === content.length - 5;

					if (isWholeLink) {
						const newContent = content.replace('</a>', '');

						maxiSetAttributes({ content: `${newContent}</a>` });
					} else {
						maxiSetAttributes({ content });
					}
				}
			} else {
				this.shiftEnterPressed = false;
			}
		};

		const commonProps = {
			className: 'maxi-text-block__content',
			identifier: 'content',
			value: content,
			onChange: processContent,
			onSplit: (value, isOriginal) => {
				const { isList } = this.props.attributes;
				if (this.state.wpVersion >= 6.4 && isList) {
					// do nothing
					return {};
				}
				let newAttributes;

				if (isOriginal || value) {
					newAttributes = {
						...attributes,
						content: value,
						...(!isOriginal && { uniqueID: null }),
					};
				}

				const block = createBlock(
					'maxi-blocks/text-maxi',
					newAttributes
				);

				if (isOriginal) {
					block.clientId = clientId;
				}

				return block;
			},
			onReplace,
			onMerge: forward => onMerge(this.props, forward),
			// onRemove needs to be commented to avoid removing the block
			// on pressing backspace with the content empty 👍
			// onRemove={onRemove}
		};

		return [
			<textContext.Provider
				key={`maxi-text-block__context-${uniqueID}`}
				value={{
					content,
					formatValue: {
						...this.state.formatValue,
					},
					onChangeTextFormat: newFormatValue => {
						!dcStatus &&
							this.state.onChangeFormat?.(newFormatValue);

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
				<Inspector
					key={`block-settings-${uniqueID}`}
					disableCustomFormats={dcStatus}
					{...this.props}
				/>
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					wpVersion={this.state.wpVersion}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
					disableCustomFormats={dcStatus}
				/>
				<MaxiBlock
					key={`maxi-text--${uniqueID}`}
					classes={classnames(
						isEmpty(content)
							? 'maxi-text-block__empty'
							: 'maxi-text-block__has-text',
						isList && 'maxi-list-block'
					)}
					ref={this.blockRef}
					{...getMaxiBlockAttributes(this.props)}
				>
					{!dcStatus && !isList && (
						<RichText
							tagName={textLevel}
							__unstableEmbedURLOnPaste
							withoutInteractiveFormatting
							preserveWhiteSpace
							multiline={false}
							{...commonProps}
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
					{dcStatus && (
						<DCTagName className={className}>
							{dcContainsHTML ? (
								<RawHTML>{dcContent}</RawHTML>
							) : (
								dcContent
							)}
						</DCTagName>
					)}
					{!dcStatus && isList && (
						<RichText
							multiline={
								this.state.wpVersion < 6.4 ? 'li' : false
							}
							tagName={typeOfList}
							start={listStart}
							reversed={listReversed}
							type={typeOfList}
							onKeyDown={this.handleKeyDown}
							{...commonProps}
						>
							{richTextValues => {
								const { value: formatValue, onChange } =
									richTextValues;

								(!isList || this.state.wpVersion < 6.4) &&
									onChangeRichText({
										attributes,
										maxiSetAttributes,
										oldFormatValue: this.state.formatValue,
										onChange: newState => {
											if (this.typingTimeoutFormatValue) {
												clearTimeout(
													this
														.typingTimeoutFormatValue
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
														outdentListItems(
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
														indentListItems(
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
														indentListItems(
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
														outdentListItems(
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

export default withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)));
