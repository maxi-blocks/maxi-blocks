/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

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
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import getStyles from './styles';
import onMerge from '../text-maxi/utils';
import { onChangeRichText, TextContext } from '../../extensions/text/formats';
import { copyPasteMapping, scProps } from './data';

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
		// Ensures white-space is applied from Maxi and not with inline styles
		if (this.blockRef?.current?.children)
			Array.from(this.blockRef.current.children).forEach(el => {
				if (el.style.whiteSpace) el.style.whiteSpace = null;
			});
	}

	render() {
		const { attributes, clientId, onReplace, maxiSetAttributes } =
			this.props;
		const { content, uniqueID } = attributes;

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
			className: 'maxi-list-item-block__content',
			identifier: 'content',
			value: content,
			onChange: processContent,
			onSplit: (value, isOriginal) => {
				let newAttributes;

				if (isOriginal || value) {
					newAttributes = {
						...attributes,
						content: value,
						...(!isOriginal && { uniqueID: null }),
					};
				}

				const block = createBlock(
					'maxi-blocks/list-item-maxi',
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
			<TextContext.Provider
				key={`maxi-list-item-block__context-${uniqueID}`}
				value={{
					content,
					formatValue: {
						...this.state.formatValue,
					},
					onChangeTextFormat: newFormatValue => {
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
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
					wpVersion={this.state.wpVersion}
				/>
				<MaxiBlock
					key={`maxi-text--${uniqueID}`}
					classes={classnames(
						isEmpty(content)
							? 'maxi-list-item-block__empty'
							: 'maxi-list-item-block__has-text'
					)}
					ref={this.blockRef}
					tagName='li'
					{...getMaxiBlockAttributes(this.props)}
				>
					<RichText
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
								onChange: newState => {
									if (this.typingTimeoutFormatValue) {
										clearTimeout(
											this.typingTimeoutFormatValue
										);
									}

									this.typingTimeoutFormatValue = setTimeout(
										() => {
											this.setState(newState);
										},
										10
									);
								},
								richTextValues,
							})
						}
					</RichText>
				</MaxiBlock>
			</TextContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
