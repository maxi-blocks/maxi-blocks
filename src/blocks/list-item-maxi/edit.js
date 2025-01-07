/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import getStyles from './styles';
import onMerge from '@blocks/text-maxi/utils';
import {
	handleSplit,
	onChangeRichText,
	processContent,
	TextContext,
} from '@extensions/text/formats';
import { copyPasteMapping, scProps } from './data';
import withMaxiDC from '@extensions/DC/withMaxiDC';

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

		const commonProps = {
			className: 'maxi-list-item-block__content',
			identifier: 'content',
			value: content,
			onChange: rawContent =>
				processContent(
					rawContent,
					this.props.attributes.content,
					this.typingTimeoutContent,
					maxiSetAttributes,
					typingTimeoutContent => {
						this.typingTimeoutContent = typingTimeoutContent;
					}
				),
			onSplit: (value, isOriginal) =>
				handleSplit(
					value,
					isOriginal,
					attributes,
					clientId,
					'maxi-blocks/list-item-maxi'
				),
			onReplace,
			onMerge: forward => onMerge(this.props, forward),
			onPaste: event => {
				const htmlData = event.clipboardData.getData('text/html');

				const listRegex = /<ol\s*(.*?)>|<ul\s*(.*?)>/i;
				const isList = listRegex.test(htmlData);

				if (isList) {
					event.preventDefault();

					const parser = new DOMParser();
					const doc = parser.parseFromString(htmlData, 'text/html');

					const liElements = doc.querySelectorAll('li');
					const listItemBlocks = Array.from(liElements).map(li =>
						createBlock('maxi-blocks/list-item-maxi', {
							content: li.textContent,
						})
					);

					const { getBlockParentsByBlockName, getBlockIndex } =
						select('core/block-editor');

					const listParentClientId = getBlockParentsByBlockName(
						clientId,
						'maxi-blocks/text-maxi'
					).at(-1);
					const listItemIndex = getBlockIndex(clientId);

					const shouldPasteContentIntoCurrentBlock =
						this.props.attributes.content.length === 0;

					const {
						insertBlocks,
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					if (shouldPasteContentIntoCurrentBlock) {
						maxiSetAttributes({
							content: listItemBlocks[0].attributes.content,
						});
						markNextChangeAsNotPersistent();
					}

					insertBlocks(
						shouldPasteContentIntoCurrentBlock
							? listItemBlocks.slice(1)
							: listItemBlocks,
						listItemIndex + 1,
						listParentClientId
					);
				}
			},
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
				<Inspector
					key={`block-settings-${uniqueID}`}
					{...this.props}
					setShowLoader={value =>
						this.setState({ showLoader: value })
					}
				/>
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
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
					showLoader={this.state.showLoader}
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

export default withMaxiDC(withMaxiProps(edit));
