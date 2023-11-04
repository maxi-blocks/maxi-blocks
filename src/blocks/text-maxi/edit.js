/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { RichText, RichTextShortcut } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { createRef } from '@wordpress/element';

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

		this.richTextRef = createRef();

		/**
		 * Prevents losing general link format when the link is affecting whole content
		 *
		 * In case we add a whole link format, Gutenberg doesn't keep it when creators write new content.
		 * This method fixes it
		 */
		const processContent = rawContent => {
			if (rawContent === this.props.attributes.content) {
				return;
			}

			/**
			 * Replace last space with &nbsp; to prevent losing him in Firefox #4194
			 * Does not replace spaces, which inside of HTML tags
			 */
			const replaceSpaces = content =>
				content.replace(/(?![^<]*>|[^<>]*<\/) $/, '&nbsp;');

			const content = replaceSpaces(rawContent);

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

		const commonProps = {
			className: 'maxi-text-block__content',
			identifier: 'content',
			value: content,
			onChange: processContent,
			onSplit: (value, isOriginal) => {
				let newAttributes;

				if (!isList) {
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
				}
				// isList
				console.log('value', value);
				console.log('attributes.content', attributes.content);
				let newContent = '';

				// Hitting enter at the beginning
				if (value === '' && !isOriginal) {
					newContent = `${attributes.content}<li></li>`;
				}
				// Hitting enter in the middle
				else if (value !== '' && !isOriginal) {
					newContent = attributes.content.replace(
						value,
						`</li><li>${value}`
					);
				}
				// Hitting enter at the end
				else if (isOriginal) {
					newContent = `<li></li>${attributes.content}`;
				}

				// console.log('newContent: ', newContent);

				maxiSetAttributes({ content: newContent });
				return {};
			},
			onReplace,
			onMerge: forward => onMerge(this.props, forward),
			onRemove: () => {
				console.log('remove');
			},
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
							multiline='li'
							ref={this.richTextRef}
							tagName={typeOfList}
							start={listStart}
							reversed={listReversed}
							type={typeOfList}
							{...commonProps}
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
