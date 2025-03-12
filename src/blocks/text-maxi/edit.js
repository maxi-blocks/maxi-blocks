/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';
import { select } from '@wordpress/data';

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
import BlockInserter from '@components/block-inserter';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { RawHTML } from '@components';
import {
	getColorRGBAString,
	getPaletteAttributes,
	getGroupAttributes,
} from '@extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import getStyles from './styles';
import onMerge from './utils';
import {
	onChangeRichText,
	processContent,
	handleSplit,
	TextContext,
	ListContext,
} from '@extensions/text/formats';
import { setSVGColor } from '@extensions/svg';
import { copyPasteMapping, scProps } from './data';
import { getDCValues, withMaxiContextLoopContext } from '@extensions/DC';
import withMaxiDC from '@extensions/DC/withMaxiDC';

const List = props => {
	const { clientId, hasInnerBlocks, typeOfList, start, reversed, className } =
		props;

	const ALLOWED_BLOCKS = ['maxi-blocks/list-item-maxi'];
	const ListTagName = typeOfList;

	return (
		<ListTagName
			{...useInnerBlocksProps(
				{
					className,
					start,
					reversed,
				},
				{
					allowedBlocks: ALLOWED_BLOCKS,
					renderAppender: !hasInnerBlocks
						? () => <BlockInserter clientId={clientId} />
						: false,
				}
			)}
		/>
	);
};

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
		const getListItemsLength = () => {
			return select('core/block-editor').getBlockOrder(
				this.props.clientId
			).length;
		};

		return getStyles(this.props.attributes, getListItemsLength);
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
			onReplace,
			maxiSetAttributes,
			hasInnerBlocks,
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
			field: dcField,
			subField,
		} = getDCValues(
			getGroupAttributes(attributes, 'dynamicContent'),
			this.props?.contextLoopContext?.contextLoop
		);

		const className = 'maxi-text-block__content';
		const DCTagName = textLevel;

		const commonProps = {
			className: 'maxi-text-block__content',
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
			onReplace,
			onMerge: forward => onMerge(this.props, forward),
			// onRemove needs to be commented to avoid removing the block
			// on pressing backspace with the content empty 👍
			// onRemove={onRemove}
		};

		const showDCContent =
			dcStatus && dcField !== 'static_text' && subField !== 'static_text';

		return [
			<TextContext.Provider
				key={`maxi-text-block__context-${uniqueID}`}
				value={{
					content,
					formatValue: {
						...this.state.formatValue,
					},
					onChangeTextFormat: newFormatValue => {
						if (!showDCContent && !isList)
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
					setShowLoader={value =>
						this.setState({ showLoader: value })
					}
					{...this.props}
				/>
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
					disableCustomFormats={dcStatus}
					setShowLoader={value =>
						this.setState({ showLoader: value })
					}
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
					showLoader={this.state.showLoader}
				>
					{!showDCContent && !isList && (
						<RichText
							tagName={textLevel}
							__unstableEmbedURLOnPaste
							withoutInteractiveFormatting
							preserveWhiteSpace
							multiline={false}
							{...commonProps}
						>
							{richTextValues => {
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
							}}
						</RichText>
					)}
					{showDCContent && (
						<DCTagName className={className}>
							{dcContainsHTML ? (
								<RawHTML>{dcContent}</RawHTML>
							) : (
								dcContent
							)}
						</DCTagName>
					)}
					{!showDCContent && isList && (
						<ListContext.Provider
							value={getGroupAttributes(attributes, [
								'typography',
								'link',
							])}
						>
							<List
								typeOfList={typeOfList}
								className={className}
								start={listStart}
								reversed={listReversed}
								clientId={clientId}
								hasInnerBlocks={hasInnerBlocks}
							/>
						</ListContext.Provider>
					)}
				</MaxiBlock>
			</TextContext.Provider>,
		];
	}
}

export default withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)));
