/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { Fragment, useEffect, useState } = wp.element;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../utils';

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

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/block-image-box',
	'maxi-blocks/block-title-extra',
	'maxi-blocks/testimonials-slider-block',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/section-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/font-icon-maxi',
];

/**
 * Component
 */
const MaxiToolbar = props => {
	const {
		attributes: {
			customLabel,
			uniqueID,
			typography,
			typographyHover,
			alignment,
			background,
			border,
			size,
			columnSize,
			imageSize,
			mediaID,
			fullWidth,
			isFirstOnHierarchy,
			textLevel,
			margin,
			padding,
			rowPattern,
			horizontalAlign,
			verticalAlign,
			linkSettings,
			boxShadow,
			divider,
			lineOrientation,
			lineVertical,
			lineHorizontal,
			content,
			isList,
			typeOfList,
			svgColorOrange,
			svgColorBlack,
			svgColorWhite,
			display,
		},
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
	const highlight = { ...props.highlight };
	const {
		borderHighlight,
		textHighlight,
		backgroundHighlight,
		color1Highlight,
		color2Highlight,
	} = highlight;

	const [anchorRef, setAnchorRef] = useState(
		document.getElementById(`block-${clientId}`)
	);

	useEffect(() => {
		setAnchorRef(document.getElementById(`block-${clientId}`));
	});

	if (!allowedBlocks.includes(name)) return null;

	return (
		<Fragment>
			{isSelected && anchorRef && (
				<Popover
					noArrow
					animate={false}
					position='top center right'
					focusOnMount={false}
					anchorRef={anchorRef}
					className='maxi-toolbar__popover'
					uniqueid={uniqueID}
					__unstableSticky
					__unstableSlotName='block-toolbar'
					shouldAnchorIncludePadding
				>
					<div className='toolbar-block-custom-label'>
						{customLabel}
					</div>
					<div className='toolbar-wrapper'>
						<Mover clientId={clientId} blockName={name} />
						<ColumnMover clientId={clientId} blockName={name} />
						{!!borderHighlight && (
							<DividerColor
								blockName={name}
								divider={divider}
								onChange={divider => setAttributes({ divider })}
							/>
						)}
						<Divider
							blockName={name}
							divider={divider}
							defaultDivider={getDefaultProp(clientId, 'divider')}
							lineOrientation={lineOrientation}
							onChange={divider =>
								setAttributes({
									divider,
								})
							}
						/>
						<DividerAlignment
							lineOrientation={lineOrientation}
							lineVertical={lineVertical}
							lineHorizontal={lineHorizontal}
							divider={divider}
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
							blockName={name}
							typography={typography}
							defaultTypography={getDefaultProp(
								clientId,
								'typography'
							)}
							onChange={obj => setAttributes(obj)}
							node={anchorRef}
							content={content}
							breakpoint={deviceType}
							isList={isList}
							typeOfList={typeOfList}
							formatValue={formatValue}
						/>
						{!!textHighlight && (
							<TextColor
								blockName={name}
								typography={typography}
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
							alignment={alignment}
							onChange={alignment => setAttributes({ alignment })}
							breakpoint={deviceType}
						/>
						<TextLevel
							blockName={name}
							textLevel={textLevel}
							typography={typography}
							typographyHover={typographyHover}
							margin={margin}
							isList={isList}
							onChange={obj => setAttributes(obj)}
						/>
						<TextBold
							typography={typography}
							formatValue={formatValue}
							blockName={name}
							onChange={obj => setAttributes(obj)}
							isList={isList}
							breakpoint={deviceType}
						/>
						<TextItalic
							typography={typography}
							formatValue={formatValue}
							blockName={name}
							onChange={obj => setAttributes(obj)}
							isList={isList}
							breakpoint={deviceType}
						/>
						<RowSettings
							blockName={name}
							horizontalAlign={horizontalAlign}
							verticalAlign={verticalAlign}
							onChange={obj => setAttributes(obj)}
						/>
						<ToolbarColumnPattern
							clientId={clientId}
							blockName={name}
							rowPattern={rowPattern}
							onChange={rowPattern =>
								setAttributes({ rowPattern })
							}
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
							blockName={name}
							onChange={obj => setAttributes(obj)}
							isList={isList}
							formatValue={formatValue}
							linkSettings={linkSettings}
							typography={typography}
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
						{!backgroundHighlight && (
							<BackgroundColor
								blockName={name}
								background={background}
								defaultBackground={getDefaultProp(
									clientId,
									'background'
								)}
								onChange={background =>
									setAttributes({ background })
								}
							/>
						)}
						{name === 'maxi-blocks/svg-icon-maxi' && (
							<Fragment>
								{!color1Highlight && (
									<SvgColor
										blockName={name}
										svgColor={svgColorOrange}
										onChange={svgColorOrange => {
											setAttributes({
												svgColorOrange,
											});
											changeSVGContent(svgColorOrange, 1);
										}}
									/>
								)}
								{!color2Highlight && (
									<SvgColor
										blockName={name}
										svgColor={svgColorBlack}
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
										svgColor={svgColorWhite}
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
							border={border}
							defaultBorder={getDefaultProp(clientId, 'border')}
							onChange={border => setAttributes({ border })}
							breakpoint={deviceType}
							disableColor={!!borderHighlight}
						/>
						{deviceType === 'general' && (
							<ImageSize
								blockName={name}
								size={size}
								defaultSize={getDefaultProp(clientId, 'size')}
								onChangeSize={size => setAttributes({ size })}
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
							clientId={clientId}
							blockName={name}
							size={size}
							defaultSize={getDefaultProp(clientId, 'size')}
							onChangeSize={size => setAttributes({ size })}
							fullWidth={fullWidth}
							onChangeFullWidth={fullWidth =>
								setAttributes({ fullWidth })
							}
							isFirstOnHierarchy={isFirstOnHierarchy}
							breakpoint={deviceType}
						/>
						<ColumnSize
							clientId={clientId}
							blockName={name}
							columnSize={columnSize}
							verticalAlign={verticalAlign}
							uniqueID={uniqueID}
							onChange={obj => setAttributes(obj)}
							breakpoint={deviceType}
						/>
						<BoxShadow
							blockName={name}
							boxShadow={boxShadow}
							defaultBoxShadow={getDefaultProp(
								clientId,
								'boxShadow'
							)}
							onChange={boxShadow => setAttributes({ boxShadow })}
							breakpoint={deviceType}
						/>
						<PaddingMargin
							blockName={name}
							margin={margin}
							defaultMargin={getDefaultProp(clientId, 'margin')}
							onChangeMargin={margin => setAttributes({ margin })}
							padding={padding}
							defaultPadding={getDefaultProp(clientId, 'padding')}
							onChangePadding={padding =>
								setAttributes({ padding })
							}
							breakpoint={deviceType}
						/>
						<Duplicate clientId={clientId} />
						<Delete clientId={clientId} />
						<ToggleBlock
							display={display}
							breakpoint={deviceType}
							onChange={display => setAttributes({ display })}
							defaultDisplay='flex'
						/>
					</div>
				</Popover>
			)}
		</Fragment>
	);
};

export default MaxiToolbar;
