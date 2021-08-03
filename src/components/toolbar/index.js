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
import Alignment from './components/alignment';
import BackgroundColor from './components/background-color';
import Border from './components/border';
import BoxShadow from './components/box-shadow';
import Breadcrumbs from '../breadcrumbs';
import ColumnMover from './components/column-mover';
import ColumnsHandlers from './components/columns-handlers';
import ColumnSize from './components/column-size';
import CopyPaste from './components/copy-paste';
import Delete from './components/delete';
import Divider from './components/divider-line';
import DividerAlignment from './components/divider-alignment';
import DividerColor from './components/divider-color';
import Duplicate from './components/duplicate';
import ImageSize from './components/image-size';
import Link from './components/link';
import Mover from './components/mover';
import PaddingMargin from './components/padding-margin';
import ReusableBlocks from './components/reusable-blocks';
import RowSettings from './components/row-settings';
import ShapeColor from './components/shape-color';
import ShapeWidth from './components/shape-width';
import Size from './components/size';
import SvgColor from './components/svg-color';
import SvgWidth from './components/svg-width';
import TextBold from './components/text-bold';
import TextColor from './components/text-color';
import TextItalic from './components/text-italic';
import TextLevel from './components/text-level';
import TextLink from './components/text-link';
import TextListOptions from './components/text-list-options';
import ToggleBlock from './components/toggle-block';
import ToolbarColumnPattern from './components/column-pattern';
import TypographyControl from './components/typography-control';

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
	'maxi-blocks/shape-maxi',
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
	'maxi-blocks/shape-maxi',
	'maxi-blocks/svg-icon-maxi',
];

/**
 * Component
 */
const MaxiToolbar = memo(
	forwardRef((props, ref) => {
		const {
			attributes,
			changeSVGContent,
			clientId,
			isSelected,
			name,
			setAttributes,
			toggleHandlers,
			rowPattern,
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
			parentBlockStyle,
			resizableObject,
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
							<ReusableBlocks clientId={clientId} />
							<ColumnMover clientId={clientId} blockName={name} />
							<DividerColor
								{...getGroupAttributes(attributes, 'divider')}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => setAttributes(obj)}
								clientId={clientId}
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
							<TypographyControl
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => setAttributes(obj)}
								node={anchorRef}
								content={content}
								breakpoint={breakpoint}
								isList={isList}
								typeOfList={typeOfList}
								textLevel={textLevel}
								styleCard={styleCard}
								clientId={clientId}
							/>
							<TextColor
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => setAttributes(obj)}
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
								onChange={obj => setAttributes(obj)}
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
								onChange={obj => setAttributes(obj)}
								isList={isList}
								breakpoint={breakpoint}
								styleCard={styleCard}
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
								breakpoint={breakpoint}
								textLevel={textLevel}
								blockStyle={parentBlockStyle}
								styleCard={styleCard}
							/>
							<TextListOptions
								blockName={name}
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
								breakpoint={breakpoint}
								onChange={obj => setAttributes(obj)}
								clientId={clientId}
							/>
							{name === 'maxi-blocks/shape-maxi' && (
								<>
									<ShapeColor
										{...getGroupAttributes(
											attributes,
											'shape'
										)}
										blockName={name}
										onChange={obj => setAttributes(obj)}
										clientId={clientId}
									/>
									<ShapeWidth
										{...getGroupAttributes(
											attributes,
											'shape'
										)}
										blockName={name}
										onChange={obj => {
											setAttributes(obj);
										}}
									/>
								</>
							)}
							{name === 'maxi-blocks/svg-icon-maxi' && (
								<>
									<SvgColor
										{...getGroupAttributes(
											attributes,
											'svg'
										)}
										blockName={name}
										onChange={obj => {
											setAttributes(obj);
										}}
										changeSVGContent={changeSVGContent}
										type='fill'
										parentBlockStyle={parentBlockStyle}
									/>
									<SvgColor
										{...getGroupAttributes(
											attributes,
											'svg'
										)}
										blockName={name}
										onChange={obj => {
											setAttributes(obj);
										}}
										changeSVGContent={changeSVGContent}
										type='line'
										parentBlockStyle={parentBlockStyle}
									/>
									<SvgWidth
										{...getGroupAttributes(
											attributes,
											'svg'
										)}
										blockName={name}
										onChange={obj => {
											setAttributes(obj);
										}}
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
								onChange={obj => setAttributes(obj)}
								breakpoint={breakpoint}
								clientId={clientId}
							/>
							{breakpoint === 'general' && (
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
								breakpoint={breakpoint}
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
								breakpoint={breakpoint}
								resizableObject={resizableObject}
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
								onChange={obj => setAttributes(obj)}
								clientId={clientId}
								breakpoint={breakpoint}
							/>
							<PaddingMargin
								blockName={name}
								{...getGroupAttributes(attributes, [
									'margin',
									'padding',
								])}
								onChange={obj => setAttributes(obj)}
								breakpoint={breakpoint}
							/>
							<Duplicate clientId={clientId} blockName={name} />
							<Delete clientId={clientId} blockName={name} />
							<ToggleBlock
								{...getGroupAttributes(attributes, 'display')}
								onChange={obj => setAttributes(obj)}
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
