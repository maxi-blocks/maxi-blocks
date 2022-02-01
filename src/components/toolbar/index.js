/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { useEffect, useState, memo, forwardRef } from '@wordpress/element';
import { select, useSelect } from '@wordpress/data';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, cloneDeep, isEqual, isNaN } from 'lodash';

/**
 * Utils
 */
import Breadcrumbs from '../breadcrumbs';
import {
	Alignment,
	BackgroundColor,
	BlockBackgroundColor,
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
	SvgWidth,
	TextBold,
	TextColor,
	TextItalic,
	TextLevel,
	TextLink,
	TextListOptions,
	ToggleBlock,
	ToolbarColumnPattern,
	TextOptions,
	TextGenerator,
} from './components';

/**
 * Styles
 */
import './editor.scss';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/number-counter-maxi',
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
	'maxi-blocks/map-maxi',
	'maxi-blocks/number-counter-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/svg-icon-maxi',
];

/**
 * Component
 */
const MaxiToolbar = memo(
	forwardRef((props, ref) => {
		const {
			attributes,
			backgroundAdvancedOptions,
			changeSVGContent,
			clientId,
			isSelected,
			name,
			handleSetAttributes,
			toggleHandlers,
			rowPattern,
			changeSVGStrokeWidth,
			prefix = '',
			backgroundGlobalProps,
			resizableObject,
		} = props;
		const {
			blockFullWidth,
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
			parentBlockStyle,
			svgType,
		} = attributes;

		const { editorVersion, breakpoint, styleCard } = useSelect(select => {
			const { receiveMaxiSettings, receiveMaxiDeviceType } =
				select('maxiBlocks');
			const { receiveMaxiSelectedStyleCard } = select(
				'maxiBlocks/style-cards'
			);

			const maxiSettings = receiveMaxiSettings();
			const version = !isEmpty(maxiSettings.editor)
				? maxiSettings.editor.version
				: null;

			const breakpoint = receiveMaxiDeviceType();

			const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

			return {
				editorVersion: version,
				breakpoint,
				styleCard,
			};
		});

		const [anchorRef, setAnchorRef] = useState(ref.current);

		useEffect(() => {
			setAnchorRef(ref.current);
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

		const boundaryElement =
			document.defaultView.frameElement ||
			getScrollContainer(anchorRef) ||
			document.body;

		// Different from > WP 5.5.3
		const stickyProps = {
			...((parseFloat(editorVersion) <= 9.2 && {
				__unstableSticky: true,
			}) ||
				(anchorRef &&
					!isNaN(parseFloat(editorVersion)) && {
						__unstableStickyBoundaryElement: boundaryElement,
					})),
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
						__unstableSlotName='block-toolbar'
						shouldAnchorIncludePadding
						{...stickyProps}
					>
						<div className='toolbar-wrapper'>
							<Breadcrumbs key={`breadcrumbs-${uniqueID}`} />
							<div className='toolbar-block-custom-label'>
								{customLabel}
								<span className='toolbar-block-custom-label__block-style'>
									{` | ${parentBlockStyle}`}
								</span>
							</div>
							<Mover clientId={clientId} blockName={name} />
							<TextGenerator
								clientId={clientId}
								blockName={name}
								onChange={obj => handleSetAttributes(obj)}
							/>
							<ReusableBlocks clientId={clientId} />
							<ColumnMover clientId={clientId} blockName={name} />
							<DividerColor
								{...getGroupAttributes(attributes, 'divider')}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => handleSetAttributes(obj)}
								clientId={clientId}
							/>
							<Divider
								{...getGroupAttributes(attributes, 'divider')}
								blockName={name}
								lineOrientation={lineOrientation}
								onChange={obj => handleSetAttributes(obj)}
							/>
							<DividerAlignment
								{...getGroupAttributes(attributes, 'divider')}
								lineOrientation={lineOrientation}
								lineVertical={lineVertical}
								lineHorizontal={lineHorizontal}
								blockName={name}
								onChangeOrientation={lineOrientation =>
									handleSetAttributes({ lineOrientation })
								}
								onChangeHorizontal={lineHorizontal =>
									handleSetAttributes({ lineHorizontal })
								}
								onChangeVertical={lineVertical =>
									handleSetAttributes({ lineVertical })
								}
							/>
							<TextOptions
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => handleSetAttributes(obj)}
								node={anchorRef}
								content={content}
								breakpoint={breakpoint}
								isList={isList}
								typeOfList={typeOfList}
								textLevel={textLevel}
								styleCard={styleCard}
								clientId={clientId}
								blockStyle={parentBlockStyle}
							/>
							<TextColor
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
								node={anchorRef}
								isList={isList}
								typeOfList={typeOfList}
								clientId={clientId}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<Alignment
								blockName={name}
								{...getGroupAttributes(attributes, [
									'alignment',
									'textAlignment',
								])}
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
							/>
							<TextLevel
								{...getGroupAttributes(attributes, [
									'typography',
									'typographyHover',
								])}
								blockName={name}
								textLevel={textLevel}
								isList={isList}
								onChange={obj => handleSetAttributes(obj)}
							/>
							<TextBold
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => handleSetAttributes(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextItalic
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => handleSetAttributes(obj)}
								isList={isList}
								breakpoint={breakpoint}
								styleCard={styleCard}
							/>
							<RowSettings
								blockName={name}
								horizontalAlign={attributes.horizontalAlign}
								verticalAlign={attributes.verticalAlign}
								onChange={obj => handleSetAttributes(obj)}
							/>
							<ToolbarColumnPattern
								clientId={clientId}
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'rowPattern'
								)}
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
							/>
							<ColumnsHandlers
								toggleHandlers={toggleHandlers}
								blockName={name}
							/>
							<Link
								blockName={name}
								linkSettings={linkSettings}
								onChange={linkSettings =>
									handleSetAttributes({ linkSettings })
								}
								textLevel={textLevel}
							/>
							<TextLink
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => handleSetAttributes(obj)}
								isList={isList}
								linkSettings={linkSettings}
								breakpoint={breakpoint}
								textLevel={textLevel}
								blockStyle={parentBlockStyle}
								styleCard={styleCard}
							/>
							<TextListOptions
								blockName={name}
								isList={isList}
								typeOfList={typeOfList}
								onChange={obj => handleSetAttributes(obj)}
							/>
							<BackgroundColor
								{...getGroupAttributes(
									attributes,
									[
										'background',
										'backgroundColor',
										'backgroundGradient',
									],
									false,
									prefix
								)}
								prefix={prefix}
								advancedOptions={backgroundAdvancedOptions}
								globalProps={backgroundGlobalProps}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => handleSetAttributes(obj)}
								clientId={clientId}
							/>
							<BlockBackgroundColor
								{...getGroupAttributes(
									attributes,
									'blockBackground'
								)}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => handleSetAttributes(obj)}
								clientId={clientId}
							/>
							{name === 'maxi-blocks/svg-icon-maxi' && (
								<>
									{svgType !== 'Line' && (
										<SvgColor
											{...getGroupAttributes(
												attributes,
												'svg'
											)}
											blockName={name}
											onChange={obj => {
												handleSetAttributes(obj);
											}}
											changeSVGContent={changeSVGContent}
											type='fill'
											parentBlockStyle={parentBlockStyle}
										/>
									)}
									{svgType !== 'Shape' && (
										<SvgColor
											{...getGroupAttributes(
												attributes,
												'svg'
											)}
											blockName={name}
											onChange={obj => {
												handleSetAttributes(obj);
											}}
											changeSVGContent={changeSVGContent}
											type='line'
											parentBlockStyle={parentBlockStyle}
										/>
									)}
									<SvgWidth
										{...getGroupAttributes(
											attributes,
											'svg'
										)}
										blockName={name}
										onChange={obj => {
											handleSetAttributes(obj);
										}}
										breakpoint={breakpoint}
										changeSVGStrokeWidth={
											changeSVGStrokeWidth
										}
										type={svgType}
										resizableObject={resizableObject}
									/>
								</>
							)}
							<Border
								blockName={name}
								{...getGroupAttributes(attributes, [
									'border',
									'borderWidth',
									'borderRadius',
								])}
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
								clientId={clientId}
							/>
							{breakpoint === 'general' && (
								<ImageSize
									blockName={name}
									imgWidth={imgWidth}
									onChangeSize={obj =>
										handleSetAttributes(obj)
									}
									imageSize={imageSize}
									onChangeImageSize={imageSize =>
										handleSetAttributes({ imageSize })
									}
									mediaID={mediaID}
									fullWidth={fullWidth}
									onChangeFullWidth={fullWidth =>
										handleSetAttributes({ fullWidth })
									}
									isFirstOnHierarchy={isFirstOnHierarchy}
									onChangeCaption={captionType =>
										handleSetAttributes({ captionType })
									}
								/>
							)}
							<Size
								blockName={name}
								blockFullWidth={blockFullWidth}
								fullWidth={fullWidth}
								{...getGroupAttributes(
									attributes,
									'size',
									false,
									prefix
								)}
								isFirstOnHierarchy={isFirstOnHierarchy}
								breakpoint={breakpoint}
								onChange={obj => handleSetAttributes(obj)}
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
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
								rowPattern={rowPattern}
								columnSize={{
									...getGroupAttributes(
										attributes,
										'columnSize'
									),
								}}
							/>
							<BoxShadow
								blockName={name}
								{...getGroupAttributes(attributes, [
									'boxShadow',
								])}
								onChange={obj => handleSetAttributes(obj)}
								clientId={clientId}
								breakpoint={breakpoint}
							/>
							<PaddingMargin
								blockName={name}
								{...getGroupAttributes(attributes, [
									'margin',
									'padding',
									'iconPadding',
								])}
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
							/>
							<Duplicate clientId={clientId} blockName={name} />
							<Delete clientId={clientId} blockName={name} />
							<ToggleBlock
								{...getGroupAttributes(attributes, 'display')}
								onChange={obj => handleSetAttributes(obj)}
								breakpoint={breakpoint}
								defaultDisplay={
									flexBlocks.includes(name)
										? 'flex'
										: 'inherit'
								}
							/>
							<CopyPaste clientId={clientId} blockName={name} />
						</div>
					</Popover>
				)}
			</>
		);
	}),
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
