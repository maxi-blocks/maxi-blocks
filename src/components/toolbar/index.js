/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Utils
 */
import {
	Alignment,
	BackgroundColor,
	Border,
	BoxShadow,
	ColumnMover,
	ColumnsHandlers,
	ColumnSize,
	CopyPaste,
	Delete,
	Divider,
	DividerAlignment,
	DividerColor,
	Duplicate,
	ImageSize,
	Link,
	Mover,
	PaddingMargin,
	ReusableBlocks,
	RowSettings,
	Size,
	SvgColor,
	TextBold,
	TextColor,
	TextItalic,
	TextLevel,
	TextLink,
	TextListOptions,
	TextOptions,
	ToggleBlock,
	ToolbarColumnPattern,
} from './components';

/**
 * Styles
 */
import './editor.scss';
import {
	getGroupAttributes,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/font-icon-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/text-maxi',
];

const flexBlocks = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/svg-icon-maxi',
];

/**
 * Component
 */
const MaxiToolbar = props => {
	const {
		attributes,
		changeSVGContent,
		clientId,
		deviceType,
		formatValue,
		isSelected,
		name,
		setAttributes,
		toggleHandlers,
	} = props;
	const {
		content,
		customLabel,
		fullWidth,
		imageSize,
		imgWidth,
		isFirstOnHierarchy,
		isList,
		lineHorizontal,
		lineOrientation,
		lineVertical,
		linkSettings,
		mediaID,
		textLevel,
		typeOfList,
		uniqueID,
	} = attributes;

	const [anchorRef, setAnchorRef] = useState(
		document.getElementById(`block-${clientId}`)
	);

	useEffect(() => {
		setAnchorRef(document.getElementById(`block-${clientId}`));
	});

	if (!allowedBlocks.includes(name)) return null;

	const breadcrumbStatus = () => {
		const rootBlock = select('core/block-editor').getBlockName(
			select('core/block-editor').getBlockRootClientId(
				select('core/block-editor').getSelectedBlockClientId()
			)
		);
		const currentBlock = select('core/block-editor').getBlockName(
			select('core/block-editor').getSelectedBlockClientId()
		);

		if (
			currentBlock === 'maxi-blocks/container-maxi' ||
			currentBlock === 'maxi-blocks/group-maxi' ||
			currentBlock === 'maxi-blocks/row-maxi' ||
			currentBlock === 'maxi-blocks/column-maxi' ||
			rootBlock === 'maxi-blocks/container-maxi' ||
			rootBlock === 'maxi-blocks/group-maxi' ||
			rootBlock === 'maxi-blocks/row-maxi' ||
			rootBlock === 'maxi-blocks/column-maxi'
		)
			return true;
	};

	return (
		<Fragment>
			{isSelected && anchorRef && (
				<Popover
					noArrow
					animate={false}
					position='top center right'
					focusOnMount={false}
					anchorRef={anchorRef}
					className={classnames(
						'maxi-toolbar__popover',
						!!breadcrumbStatus() &&
							'maxi-toolbar__popover--has-breadcrumb'
					)}
					uniqueid={uniqueID}
					__unstableSticky
					__unstableSlotName='block-toolbar'
					shouldAnchorIncludePadding
				>
					<div className='toolbar-wrapper'>
						<div className='toolbar-block-custom-label'>
							{customLabel}
						</div>
						<Mover clientId={clientId} blockName={name} />
						<ReusableBlocks clientId={clientId} />
						<ColumnMover clientId={clientId} blockName={name} />
						<DividerColor
							{...getGroupAttributes(attributes, 'divider')}
							blockName={name}
							onChange={obj => setAttributes(obj)}
						/>
						<Divider
							{...getGroupAttributes(attributes, 'divider')}
							blockName={name}
							lineOrientation={lineOrientation}
							onChange={obj => setAttributes(obj)}
						/>
						<DividerAlignment
							{...getGroupAttributes(attributes, 'divider')}
							lineOrientation={lineOrientation}
							lineVertical={lineVertical}
							lineHorizontal={lineHorizontal}
							blockName={name}
							onChangeOrientation={lineOrientation =>
								setAttributes({ lineOrientation })
							}
							onChangeHorizontal={lineHorizontal =>
								setAttributes({ lineHorizontal })
							}
							onChangeVertical={lineVertical =>
								setAttributes({ lineVertical })
							}
						/>
						<TextOptions
							{...getGroupAttributes(attributes, 'typography')}
							blockName={name}
							onChange={obj => setAttributes(obj)}
							node={anchorRef}
							content={content}
							breakpoint={deviceType}
							isList={isList}
							typeOfList={typeOfList}
							formatValue={formatValue}
							textLevel={textLevel}
						/>
						<TextColor
							blockName={name}
							{...getGroupAttributes(attributes, 'typography')}
							content={content}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
							node={anchorRef}
							isList={isList}
							typeOfList={typeOfList}
							formatValue={formatValue}
						/>
						<Alignment
							blockName={name}
							{...getGroupAttributes(attributes, [
								'alignment',
								'textAlignment',
							])}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						<TextLevel
							{...getGroupAttributes(attributes, [
								'typography',
								'typographyHover',
							])}
							blockName={name}
							textLevel={textLevel}
							isList={isList}
							onChange={obj => setAttributes(obj)}
						/>
						<TextBold
							{...getGroupAttributes(attributes, 'typography')}
							formatValue={formatValue}
							blockName={name}
							onChange={obj => setAttributes(obj)}
							isList={isList}
							breakpoint={deviceType}
						/>
						<TextItalic
							{...getGroupAttributes(attributes, 'typography')}
							formatValue={formatValue}
							blockName={name}
							onChange={obj => setAttributes(obj)}
							isList={isList}
							breakpoint={deviceType}
						/>
						<RowSettings
							blockName={name}
							horizontalAlign={attributes.horizontalAlign}
							verticalAlign={attributes.verticalAlign}
							onChange={obj => setAttributes(obj)}
						/>
						<ToolbarColumnPattern
							clientId={clientId}
							blockName={name}
							{...getGroupAttributes(attributes, 'rowPattern')}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						<ColumnsHandlers
							toggleHandlers={toggleHandlers}
							blockName={name}
						/>
						<Link
							blockName={name}
							linkSettings={linkSettings}
							onChange={linkSettings =>
								setAttributes({ linkSettings })
							}
						/>
						<TextLink
							{...getGroupAttributes(attributes, 'typography')}
							blockName={name}
							onChange={obj => setAttributes(obj)}
							isList={isList}
							formatValue={formatValue}
							linkSettings={linkSettings}
							breakpoint={deviceType}
						/>
						<TextListOptions
							blockName={name}
							formatValue={formatValue}
							content={content}
							isList={isList}
							typeOfList={typeOfList}
							onChange={obj => setAttributes(obj)}
						/>
						<BackgroundColor
							{...getGroupAttributes(
								attributes,
								'backgroundColor'
							)}
							blockName={name}
							onChange={obj => setAttributes(obj)}
						/>
						{name === 'maxi-blocks/svg-icon-maxi' && (
							<Fragment>
								<SvgColor
									blockName={name}
									svgColorDefault={getDefaultAttribute(
										'svgColorOrange',
										clientId
									)}
									svgColor={attributes.svgColorOrange}
									onChange={svgColorOrange => {
										setAttributes({
											svgColorOrange,
										});
										changeSVGContent(svgColorOrange, 1);
									}}
								/>
								<SvgColor
									blockName={name}
									svgColorDefault={getDefaultAttribute(
										'svgColorBlack',
										clientId
									)}
									svgColor={attributes.svgColorBlack}
									onChange={svgColorBlack => {
										setAttributes({
											svgColorBlack,
										});
										changeSVGContent(svgColorBlack, 2);
									}}
								/>
							</Fragment>
						)}
						<Border
							blockName={name}
							{...getGroupAttributes(attributes, [
								'border',
								'borderWidth',
								'borderRadius',
								'palette',
							])}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						{deviceType === 'general' && (
							<ImageSize
								blockName={name}
								imgWidth={imgWidth}
								onChangeSize={obj => setAttributes(obj)}
								imageSize={imageSize}
								onChangeImageSize={imageSize =>
									setAttributes({ imageSize })
								}
								mediaID={mediaID}
								fullWidth={fullWidth}
								onChangeFullWidth={fullWidth =>
									setAttributes({ fullWidth })
								}
								isFirstOnHierarchy={isFirstOnHierarchy}
								onChangeCaption={captionType =>
									setAttributes({ captionType })
								}
							/>
						)}
						<Size
							blockName={name}
							{...getGroupAttributes(attributes, 'size')}
							fullWidth={fullWidth}
							isFirstOnHierarchy={isFirstOnHierarchy}
							breakpoint={deviceType}
							onChange={obj => setAttributes(obj)}
						/>
						<ColumnSize
							clientId={clientId}
							blockName={name}
							{...getGroupAttributes(attributes, 'columnSize')}
							verticalAlign={attributes.verticalAlign}
							uniqueID={uniqueID}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						<BoxShadow
							blockName={name}
							{...getGroupAttributes(attributes, [
								'boxShadow',
								'palette',
							])}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						<PaddingMargin
							blockName={name}
							{...getGroupAttributes(attributes, [
								'margin',
								'padding',
							])}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						<Duplicate clientId={clientId} />
						<Delete clientId={clientId} />
						<ToggleBlock
							{...getGroupAttributes(attributes, 'display')}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
							defaultDisplay={
								flexBlocks.includes(name) ? 'flex' : 'inherit'
							}
						/>
						<CopyPaste clientId={clientId} />
					</div>
				</Popover>
			)}
		</Fragment>
	);
};

export default MaxiToolbar;
