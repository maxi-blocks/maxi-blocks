/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
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
import classnames from 'classnames';
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

		const classes = classnames(
			'maxi-text-block',
			getPaletteClasses(
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
			)
		);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['content', 'formatValue']}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				{...this.props}
				propsToAvoid={['content', 'formatValue']}
			/>,
			<MaxiBlock
				key={`maxi-text--${uniqueID}`}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				{!isList && (
					<RichText
						ref={this.blockRef}
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
						{({ value: formatValue }) => {
							/**
							 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
							 * and add some coding manually
							 * This next script will check if there is any format directly related with
							 * any native format and if it's so, will format it in Maxi Blocks way
							 */
							const hasNativeFormat = getHasNativeFormat(
								formatValue
							);

							if (hasNativeFormat) {
								const {
									typeOfList,
									content,
									textLevel,
								} = attributes;

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
										textLevel,
									}
								);

								setAttributes(cleanCustomProps);
							}

							dispatch('maxiBlocks/text').sendFormatValue(
								formatValue,
								clientId
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
							/**
							 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
							 * and add some coding manually
							 * This next script will check if there is any format directly related with
							 * any native format and if it's so, will format it in Maxi Blocks way
							 */
							const hasNativeFormat = getHasNativeFormat(
								formatValue
							);

							if (hasNativeFormat) {
								const {
									typeOfList,
									content,
									textLevel,
								} = attributes;

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
										textLevel,
									}
								);

								setAttributes(cleanCustomProps);
							}
							dispatch('maxiBlocks/text').sendFormatValue(
								formatValue,
								clientId
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
									</Fragment>
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
