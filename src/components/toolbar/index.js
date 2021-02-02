/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { Fragment, useEffect, useState } = wp.element;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../utils';

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
	SvgColor,
	Border,
	BoxShadow,
	Mover,
	ToolbarColumnPattern,
	Divider,
	DividerColor,
	DividerAlignment,
	Duplicate,
	Link,
	Delete,
	ImageSize,
	TextBold,
	TextColor,
	TextItalic,
	TextLevel,
	TextLink,
	TextListOptions,
	TextOptions,
	PaddingMargin,
	Size,
	ToggleBlock,
	ColumnMover,
	RowSettings,
	ColumnSize,
	ColumnsHandlers,
} from './components';

/**
 * Styles
 */
import './editor.scss';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/font-icon-maxi',
];

const flexBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
];

/**
 * Component
 */
const MaxiToolbar = props => {
	const {
		attributes,
		clientId,
		isSelected,
		name,
		setAttributes,
		formatValue,
		deviceType,
		toggleHandlers,
		hasThirdColour,
		changeSVGContent,
	} = props;
	const {
		customLabel,
		uniqueID,
		fullWidth,
		isFirstOnHierarchy,
		linkSettings,
		isList,
		content,
		typeOfList,
		textLevel,
		imageSize,
		mediaID,
		lineOrientation,
		lineVertical,
		lineHorizontal,
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
						<ColumnMover clientId={clientId} blockName={name} />
						{!attributes['border-highlight'] && (
							<DividerColor
								color={attributes['divider-border-color']}
								blockName={name}
								onChange={obj => setAttributes(obj)}
							/>
						)}
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
						{!attributes['text-highlight'] && (
							<TextColor
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								content={content}
								onChange={obj => setAttributes(obj)}
								breakpoint={deviceType}
								node={anchorRef}
								isList={isList}
								typeOfList={typeOfList}
								formatValue={formatValue}
							/>
						)}
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
						{!attributes['background-highlight'] && (
							<BackgroundColor
								{...getGroupAttributes(
									attributes,
									'backgroundColor'
								)}
								blockName={name}
								onChange={obj => setAttributes(obj)}
							/>
						)}
						{name === 'maxi-blocks/svg-icon-maxi' && (
							<Fragment>
								{!attributes.color1Highlight && (
									<SvgColor
										blockName={name}
										svgColor={attributes.svgColorOrange}
										onChange={svgColorOrange => {
											setAttributes({
												svgColorOrange,
											});
											changeSVGContent(svgColorOrange, 1);
										}}
									/>
								)}
								{!attributes.color2Highlight && (
									<SvgColor
										blockName={name}
										svgColor={attributes.svgColorBlack}
										onChange={svgColorBlack => {
											setAttributes({
												svgColorBlack,
											});
											changeSVGContent(svgColorBlack, 2);
										}}
									/>
								)}
								{hasThirdColour && (
									<SvgColor
										blockName={name}
										svgColor={attributes.svgColorWhite}
										onChange={svgColorWhite => {
											setAttributes({ svgColorWhite });
											changeSVGContent(svgColorWhite, 3);
										}}
									/>
								)}
							</Fragment>
						)}
						<Border
							blockName={name}
							{...getGroupAttributes(attributes, [
								'border',
								'borderWidth',
								'borderRadius',
							])}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
							disableColor={!attributes['border-highlight']}
						/>
						{deviceType === 'general' && (
							<ImageSize
								{...getGroupAttributes(attributes, 'size')}
								blockName={name}
								defaultSize={getDefaultProp(clientId, 'size')}
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
							{...getGroupAttributes(attributes, 'boxShadow')}
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
					</div>
				</Popover>
			)}
		</Fragment>
	);
};

export default MaxiToolbar;
