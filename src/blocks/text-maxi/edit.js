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
import { MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
import getStyles from './styles';
import { onMerge, onSplit } from './utils';
import {
	getHasNativeFormat,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	propsToAvoidRendering = ['formatValue'];

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

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
			isSelected,
			setAttributes,
			onReplace,
			onRemove,
			clientId,
			name,
		} = this.props;
		const {
			uniqueID,
			textLevel,
			content,
			isList,
			typeOfList,
			listStart,
			listReversed,
			parentBlockStyle,
		} = attributes;

		const paletteClasses = getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'typography',
				'typography-hover',
			],
			'maxi-blocks/text-maxi',
			parentBlockStyle,
			textLevel
		);

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

			// Well, how to explain this... lol
			// React 16.13.0 introduced a warning for when a function component is updated during another component's
			// render phase (facebook/react#17099). In version 16.13.1 the warning was adjusted to be more
			// specific (facebook/react#18330). The warning look like:
			// Warning: Cannot update a component (Foo) while rendering a different component (Bar).
			// To locate the bad setState() call inside Bar, follow the stack trace as described in https://fb.me/setstate-in-render
			//
			// In this case the error comes from a `forceUpdate` that '@wordpress/data' triggers when updating an store.
			// This error is not related with Maxi, but appears on our blocks. So, a way to avoid it is to set a `setTimeOut`
			// that delays a bit the dispatch action of the store and prevents the rendering of some components while RichText
			// is rendering. Sad but true.
			setTimeout(() => {
				dispatch('maxiBlocks/text').sendFormatValue(
					formatValue,
					clientId
				);
			});
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
				ref={this.blockRef}
				paletteClasses={paletteClasses}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				{!isList && (
					<RichText
						className='maxi-text-block__content'
						value={content}
						onChange={content => setAttributes({ content })}
						tagName={textLevel}
						onSplit={value => onSplit(this.props.attributes, value)}
						onReplace={onReplace}
						onMerge={forward => onMerge(this.props, forward)}
						onRemove={onRemove}
						placeholder={__(
							'Set your Maxi Text here…',
							'maxi-blocks'
						)}
						keepPlaceholderOnFocus
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
						onChange={content => setAttributes({ content })}
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
