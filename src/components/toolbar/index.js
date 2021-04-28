/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { useEffect, useState, memo } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, cloneDeep, isEqual } from 'lodash';

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
	TextItalic,
	TextLevel,
	TextColor,
	TextLink,
	TextListOptions,
	TextOptions,
	ToggleBlock,
	ToolbarColumnPattern,
} from './components';
import { Breadcrumbs } from '../../components';

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
const MaxiToolbar = memo(
	props => {
		const {
			attributes,
			changeSVGContent,
			clientId,
			deviceType,
			isSelected,
			name,
			setAttributes,
			toggleHandlers,
		} = props;
		const {
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
			const { getBlockParents } = select('core/block-editor');

			const originalNestedBlocks = clientId
				? getBlockParents(clientId)
				: [];

			if (!originalNestedBlocks.includes(clientId))
				originalNestedBlocks.push(clientId);

			return originalNestedBlocks.length > 1;
		};

		return (
			<>
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
							<Breadcrumbs key={`breadcrumbs-${uniqueID}`} />
							<div className='toolbar-block-custom-label'>
								{customLabel}
							</div>
							<Mover clientId={clientId} blockName={name} />
							<ReusableBlocks clientId={clientId} />
							<ColumnMover clientId={clientId} blockName={name} />
							{!attributes['border-highlight'] && (
								<DividerColor
									{...getGroupAttributes(
										attributes,
										'divider'
									)}
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
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => setAttributes(obj)}
								node={anchorRef}
								breakpoint={deviceType}
								isList={isList}
								typeOfList={typeOfList}
								textLevel={textLevel}
							/>
							{!attributes['text-highlight'] && (
								<TextColor
									blockName={name}
									{...getGroupAttributes(
										attributes,
										'typography'
									)}
									onChange={obj => setAttributes(obj)}
									breakpoint={deviceType}
									node={anchorRef}
									isList={isList}
									textLevel={textLevel}
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
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => setAttributes(obj)}
								isList={isList}
								breakpoint={deviceType}
								textLevel={textLevel}
							/>
							<TextItalic
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
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
								{...getGroupAttributes(
									attributes,
									'rowPattern'
								)}
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
								textLevel={textLevel}
							/>
							<TextLink
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => setAttributes(obj)}
								isList={isList}
								linkSettings={linkSettings}
								breakpoint={deviceType}
								textLevel={textLevel}
							/>
							<TextListOptions
								blockName={name}
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
								<>
									{!attributes['color1-highlight'] && (
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
												changeSVGContent(
													svgColorOrange,
													1
												);
											}}
										/>
									)}
									{!attributes['color2-highlight'] && (
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
												changeSVGContent(
													svgColorBlack,
													2
												);
											}}
										/>
									)}
								</>
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
								{...getGroupAttributes(
									attributes,
									'columnSize'
								)}
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
									flexBlocks.includes(name)
										? 'flex'
										: 'inherit'
								}
							/>
							<CopyPaste clientId={clientId} />
						</div>
					</Popover>
				)}
			</>
		);
	},
	// Avoids non-necessary renderings
	(
		{ attributes: oldAttr, propsToAvoid, isSelected: wasSelected },
		{ attributes: newAttr, isSelected }
	) => {
		if (!wasSelected || wasSelected !== isSelected) return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default MaxiToolbar;
