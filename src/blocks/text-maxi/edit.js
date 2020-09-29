/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { __unstableIndentListItems, __unstableOutdentListItems } = wp.richText;
const { __experimentalBlock, RichText, RichTextShortcut } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getAlignmentTextObject,
	getOpacityObject,
	getTransformObject,
	setBackgroundStyles,
} from '../../utils';
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalBackgroundDisplayer,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID} .maxi-text-block__content`]: this.getTypographyObject,
			[`${uniqueID} .maxi-text-block__content:hover`]: this
				.getTypographyHoverObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		return response;
	}

	get getNormalObject() {
		const {
			alignment,
			opacity,
			boxShadow,
			border,
			size,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			size: { ...JSON.parse(size) },
			opacity: { ...getOpacityObject(JSON.parse(opacity)) },
			zIndex: { ...JSON.parse(zIndex) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
		};

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		return response;
	}

	get getTypographyObject() {
		const { typography, margin, padding } = this.props.attributes;

		const response = {
			typography: { ...JSON.parse(typography) },
			margin: { ...JSON.parse(margin) },
			padding: { ...JSON.parse(padding) },
		};

		return response;
	}

	get getTypographyHoverObject() {
		const { typographyHover } = this.props.attributes;

		const response = {
			typographyHover: { ...JSON.parse(typographyHover) },
		};

		return response;
	}

	render() {
		const {
			className,
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				extraClassName,
				background,
				textLevel,
				content,
				isList,
				typeOfList,
				listStart,
				listReversed,
				fullWidth,
			},
			isSelected,
			setAttributes,
		} = this.props;

		const classes = classnames(
			'maxi-block maxi-text-block',
			blockStyle,
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBlock
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
				data-align={fullWidth}
			>
				<__experimentalBackgroundDisplayer background={background} />
				{!isList && (
					<RichText
						className='maxi-text-block__content'
						value={content}
						onChange={content => setAttributes({ content })}
						tagName={textLevel}
						placeholder={__(
							'Set your Maxi Text here…',
							'maxi-blocks'
						)}
						keepPlaceholderOnFocus
						__unstableEmbedURLOnPaste
						__unstableAllowPrefixTransformations
					/>
				)}
				{isList && (
					<RichText
						className='maxi-text-block__content'
						identifier='values'
						multiline='li'
						__unstableMultilineRootTag={typeOfList}
						tagName={typeOfList}
						onChange={content => setAttributes({ content })}
						value={content}
						placeholder={__('Write list…')}
						// onMerge={mergeBlocks}
						onSplit={value =>
							createBlock(name, { ...attributes, values: value })
						}
						__unstableOnSplitMiddle={() =>
							createBlock('core/paragraph')
						}
						// onReplace={onReplace}
						// onRemove={() => onReplace([])}
						start={listStart}
						reversed={!!listReversed}
						type={typeOfList}
					>
						{({ value, onChange, onFocus }) => {
							if (isSelected)
								return (
									<Fragment>
										<RichTextShortcut
											type='primary'
											character='['
											onUse={() => {
												onChange(
													__unstableOutdentListItems(
														value
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
														value,
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
														value,
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
														value
													)
												);
											}}
										/>
									</Fragment>
								);
						}}
					</RichText>
				)}
			</__experimentalBlock>,
		];
	}
}

export default edit;
