/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { useSelect } = wp.data;
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
	ColumnPattern,
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
	TextList,
	TextListOptions,
	TextOptions,
	PaddingMargin,
	Size,
	ToggleBlock,
	__experimentalColumnMover,
	__experimentalRowSettings,
	__experimentalColumnSize,
	__experimentalColumnsHandlers,
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
];

/**
 * Component
 */
const MaxiToolbar = props => {
	const {
		attributes: {
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
		toggleHandlers,
	} = props;

	const { deviceType } = useSelect(select => {
		const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

		return {
			deviceType,
		};
	});

	const [anchorRef, setAnchorRef] = useState(
		document.getElementById(`block-${clientId}`)
	);

	useEffect(() => {
		setAnchorRef(document.getElementById(`block-${clientId}`));
	});

	if (!allowedBlocks.includes(name)) return null;

	function getThirdSvgColor() {
		const { clientId } = wp.data
			.select('core/block-editor')
			.getSelectedBlock();
		const current_content = wp.data
			.select('core/block-editor')
			.getSelectedBlock().attributes.content;

		if (current_content.indexOf('maxi-svg-color-third') !== -1) return true;
		return false;
	}

	function changeContent(color, colorNumber) {
		let colorClass = '';
		switch (colorNumber) {
			case 1:
				colorClass = 'maxi-svg-color-first';
				break;
			case 2:
				colorClass = 'maxi-svg-color-second';
				break;
			case 3:
				colorClass = 'maxi-svg-color-third';
				break;
			default:
				return;
		}

		if (colorClass !== '') {
			const { clientId } = wp.data
				.select('core/block-editor')
				.getSelectedBlock();
			const current_content = wp.data
				.select('core/block-editor')
				.getSelectedBlock().attributes.content;
			const regex_line_to_change = new RegExp(
				`${colorClass}" fill=".+?(?= )`,
				'g'
			);
			const regex_line_to_change2 = new RegExp(
				`${colorClass}" stroke=".+?(?= )`,
				'g'
			);
			const change_to = `${colorClass}" fill="${color}"`;
			const change_to2 = `${colorClass}" stroke="${color}"`;
			let new_content = current_content.replace(
				regex_line_to_change,
				change_to
			);
			new_content = new_content.replace(
				regex_line_to_change2,
				change_to2
			);

			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, { content: new_content });
		}
	}

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
					<div className='toolbar-wrapper'>
						<Mover clientId={clientId} blockName={name} />
						<__experimentalColumnMover
							clientId={clientId}
							blockName={name}
						/>
						<DividerColor
							blockName={name}
							divider={divider}
							onChange={divider => setAttributes({ divider })}
						/>
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
							onChange={typography =>
								setAttributes({ typography })
							}
							breakpoint={deviceType}
						/>
						<TextColor
							blockName={name}
							typography={typography}
							onChange={typography =>
								setAttributes({ typography })
							}
							breakpoint={deviceType}
						/>
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
							blockName={name}
							content={content}
							onChange={content => setAttributes({ content })}
							node={anchorRef}
						/>
						<TextItalic
							blockName={name}
							content={content}
							onChange={content => setAttributes({ content })}
							node={anchorRef}
						/>
						<__experimentalRowSettings
							blockName={name}
							horizontalAlign={horizontalAlign}
							verticalAlign={verticalAlign}
							onChange={obj => setAttributes(obj)}
						/>
						<ColumnPattern
							clientId={clientId}
							blockName={name}
							rowPattern={rowPattern}
							onChange={rowPattern =>
								setAttributes({ rowPattern })
							}
							breakpoint={deviceType}
						/>

						<__experimentalColumnsHandlers
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
							content={content}
							onChange={content => setAttributes({ content })}
							node={anchorRef}
						/>
						<TextList
							blockName={name}
							isList={isList}
							content={content}
							onChange={(isList, content) =>
								setAttributes({
									isList,
									content,
								})
							}
						/>
						<TextListOptions
							blockName={name}
							isList={isList}
							content={content}
							typeOfList={typeOfList}
							onChange={content => setAttributes({ content })}
							node={anchorRef}
						/>
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
						{name === 'maxi-blocks/svg-icon-maxi' && (
							<Fragment>
								<SvgColor
									blockName={name}
									svgColor={svgColorOrange}
									onChange={svgColorOrange => {
										setAttributes({ svgColorOrange });
										changeContent(svgColorOrange, 1);
									}}
								/>
								<SvgColor
									blockName={name}
									svgColor={svgColorBlack}
									onChange={svgColorBlack => {
										setAttributes({ svgColorBlack });
										changeContent(svgColorBlack, 2);
									}}
								/>
								{getThirdSvgColor() && (
									<SvgColor
										blockName={name}
										svgColor={svgColorWhite}
										onChange={svgColorWhite => {
											setAttributes({ svgColorWhite });
											changeContent(svgColorWhite, 3);
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
						<__experimentalColumnSize
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
