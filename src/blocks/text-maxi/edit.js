/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import { withSelect, dispatch } from '@wordpress/data';
import { RichText, RichTextShortcut } from '@wordpress/block-editor';
import {
	__unstableIndentListItems,
	__unstableOutdentListItems,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock, { getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import { onMerge, onSplit } from './utils';
import {
	getHasNativeFormat,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	propsToAvoidRendering = ['formatValue'];

	typingTimeoutFormatValue = 0;

	typingTimeoutContent = 0;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const {
			attributes,
			blockFullWidth,
			clientId,
			isSelected,
			name,
			onRemove,
			onReplace,
			setAttributes,
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

		const onChangeRichText = ({ value: formatValue }) => {
			/**
			 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
			 * and add some coding manually
			 * This next script will check if there is any format directly related with
			 * any native format and if it's so, will format it in Maxi Blocks way
			 */
			const hasNativeFormat = getHasNativeFormat(formatValue);

			if (hasNativeFormat) {
				const { typeOfList, content, textLevel } = attributes;

				const cleanCustomProps = setCustomFormatsWhenPaste({
					formatValue,
					typography: getGroupAttributes(attributes, 'typography'),
					isList,
					typeOfList,
					content,
					textLevel,
				});

				delete cleanCustomProps.formatValue;

				setAttributes(cleanCustomProps);
			}

			if (this.typingTimeoutFormatValue) {
				clearTimeout(this.typingTimeoutFormatValue);
			}

			this.typingTimeoutFormatValue = setTimeout(() => {
				dispatch('maxiBlocks/text').sendFormatValue(
					formatValue,
					clientId
				);
			}, 100);
		};

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
				setAttributes({ content: `${newContent}</a>` });
			} else {
				if (this.typingTimeoutContent) {
					clearTimeout(this.typingTimeoutContent);
				}

				this.typingTimeoutContent = setTimeout(() => {
					setAttributes({ content });
				}, 100);
			}
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['content', 'formatValue']}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				propsToAvoid={['content', 'formatValue']}
			/>,
			<MaxiBlock
				key={`maxi-text--${uniqueID}`}
				classes={`${isList ? 'maxi-list-block' : ''}`}
				blockFullWidth={blockFullWidth}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				{!isList && (
					<RichText
						className='maxi-text-block__content'
						value={content}
						onChange={processContent}
						tagName={textLevel}
						onSplit={(value, isExistentBlock) =>
							onSplit(
								this.props.attributes,
								value,
								isExistentBlock,
								clientId
							)
						}
						onReplace={onReplace}
						onMerge={forward => onMerge(this.props, forward)}
						onRemove={onRemove}
						placeholder={__(
							'Set your Maxi Text here…',
							'maxi-blocks'
						)}
						__unstableEmbedURLOnPaste
						__unstableAllowPrefixTransformations
					>
						{onChangeRichText}
					</RichText>
				)}
				{isList && (
					<RichText
						className='maxi-text-block__content'
						identifier='content'
						multiline='li'
						__unstableMultilineRootTag={typeOfList}
						tagName={typeOfList}
						onChange={processContent}
						value={content}
						placeholder={__('Write list…', 'maxi-blocks')}
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
						onReplace={blocks => onReplace(this.props, blocks)}
						onMerge={forward => onMerge(this.props, forward)}
						onRemove={onRemove}
						start={listStart}
						reversed={!!listReversed}
						type={typeOfList}
					>
						{({ value: formatValue, onChange }) => {
							onChangeRichText({ value: formatValue });

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
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect)(edit);
