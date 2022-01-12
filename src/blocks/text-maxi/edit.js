/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
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
import onMerge, { onReplaceBlocks } from './utils';
import {
	getHasNativeFormat,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import { isEmpty, compact, flatten } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	propsToAvoidRendering = ['formatValue'];

	formatValue = {};

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

			this.formatValue = formatValue;

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
						identifier='content'
						value={content}
						onChange={processContent}
						tagName={textLevel}
						// Needs to stay: if there's no `onSplit` function, `onReplace` function
						// is not called when pasting content with blocks; is called with plainText
						// Check `packages/block-editor/src/components/rich-text/use-enter.js` on Gutenberg
						onSplit={() => null}
						onReplace={(blocks, indexToSelect, initialPosition) => {
							if (
								!blocks ||
								isEmpty(compact(blocks)) ||
								flatten(blocks).every(block => isEmpty(block))
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
						__unstableEmbedURLOnPaste
						preserveWhiteSpace
					>
						{onChangeRichText}
					</RichText>
				)}
				{isList && (
					<RichText
						className='maxi-text-block__content'
						identifier='content'
						multiline='li'
						tagName={typeOfList}
						onChange={processContent}
						value={content}
						// Needs to stay: if there's no `onSplit` function, `onReplace` function
						// is not called when pasting content with blocks; is called with plainText
						// Check `packages/block-editor/src/components/rich-text/use-enter.js` on Gutenberg
						onSplit={() => null}
						onReplace={(blocks, indexToSelect, initialPosition) => {
							if (
								!blocks ||
								isEmpty(compact(blocks)) ||
								flatten(blocks).every(block => isEmpty(block))
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
						onRemove={onRemove}
						start={listStart}
						reversed={listReversed}
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
