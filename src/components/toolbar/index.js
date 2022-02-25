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
	BackgroundColor,
	BlockBackgroundColor,
	Border,
	BoxShadow,
	ColumnMover,
	ColumnsHandlers,
	ColumnSize,
	Divider,
	DividerAlignment,
	DividerColor,
	Duplicate,
	Link,
	Mover,
	Size,
	SvgColor,
	SvgWidth,
	TextColor,
	TextLevel,
	TextLink,
	TextListOptions,
	ToolbarColumnPattern,
	TextOptions,
	MoreSettings,
	Help,
	VerticalAlign,
	TextMargin,
	ToolbarMediaUpload,
} from './components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

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
			maxiSetAttributes,
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
			isFirstOnHierarchy,
			isList,
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

		const lineOrientation = getLastBreakpointAttribute(
			'line-orientation',
			breakpoint,
			attributes
		);

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
							<div className='toolbar-block-custom-label'>
								{customLabel}
								<span className='toolbar-block-custom-label__block-style'>
									{` | ${parentBlockStyle}`}
								</span>
							</div>
							<Breadcrumbs key={`breadcrumbs-${uniqueID}`} />
							<ToolbarMediaUpload
								blockName={name}
								maxiSetAttributes
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
								clientId={clientId}
								mediaID={mediaID}
							/>
							<TextColor
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
								node={anchorRef}
								isList={isList}
								typeOfList={typeOfList}
								clientId={clientId}
								textLevel={textLevel}
								styleCard={styleCard}
							/>
							<TextOptions
								{...getGroupAttributes(attributes, [
									'typography',
									'textAlignment',
								])}
								blockName={name}
								onChange={obj => maxiSetAttributes(obj)}
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
							<Mover clientId={clientId} blockName={name} />
							<TextLevel
								{...getGroupAttributes(attributes, [
									'typography',
									'typographyHover',
								])}
								blockName={name}
								textLevel={textLevel}
								isList={isList}
								onChange={obj => maxiSetAttributes(obj)}
							/>
							<TextListOptions
								blockName={name}
								isList={isList}
								typeOfList={typeOfList}
								onChange={obj => maxiSetAttributes(obj)}
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
												maxiSetAttributes(obj);
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
												maxiSetAttributes(obj);
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
											maxiSetAttributes(obj);
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
							<ColumnMover clientId={clientId} blockName={name} />
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
								onChange={obj => maxiSetAttributes(obj)}
								clientId={clientId}
							/>
							<BlockBackgroundColor
								{...getGroupAttributes(
									attributes,
									'blockBackground'
								)}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => maxiSetAttributes(obj)}
								clientId={clientId}
							/>
							<Border
								blockName={name}
								{...getGroupAttributes(
									attributes,
									['border', 'borderWidth', 'borderRadius'],
									false,
									prefix
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
								clientId={clientId}
								prefix={prefix}
							/>
							<BoxShadow
								blockName={name}
								{...getGroupAttributes(
									attributes,
									['boxShadow'],
									false,
									prefix
								)}
								onChange={obj => maxiSetAttributes(obj)}
								clientId={clientId}
								breakpoint={breakpoint}
								prefix={prefix}
							/>
							<ToolbarColumnPattern
								clientId={clientId}
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'rowPattern'
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
							/>
							<ColumnsHandlers
								toggleHandlers={toggleHandlers}
								blockName={name}
							/>
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
								onChange={obj => maxiSetAttributes(obj)}
							/>
							<ColumnSize
								{...getGroupAttributes(
									attributes,
									'columnSize'
								)}
								clientId={clientId}
								blockName={name}
								verticalAlign={attributes.verticalAlign}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
								rowPattern={rowPattern}
							/>
							<TextMargin
								blockName={name}
								linkSettings={linkSettings}
								onChange={linkSettings =>
									maxiSetAttributes({ linkSettings })
								}
								textLevel={textLevel}
							/>
							<Link
								blockName={name}
								linkSettings={linkSettings}
								onChange={linkSettings =>
									maxiSetAttributes({ linkSettings })
								}
								textLevel={textLevel}
							/>
							<TextLink
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								blockName={name}
								onChange={obj => maxiSetAttributes(obj)}
								isList={isList}
								linkSettings={linkSettings}
								breakpoint={breakpoint}
								textLevel={textLevel}
								blockStyle={parentBlockStyle}
								styleCard={styleCard}
							/>
							<VerticalAlign
								clientId={clientId}
								blockName={name}
								verticalAlign={attributes.verticalAlign}
								uniqueID={uniqueID}
								onChange={obj => maxiSetAttributes(obj)}
							/>
							<DividerColor
								{...getGroupAttributes(attributes, 'divider')}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => maxiSetAttributes(obj)}
								clientId={clientId}
							/>
							<Divider
								{...getGroupAttributes(attributes, 'divider')}
								blockName={name}
								breakpoint={breakpoint}
								lineOrientation={lineOrientation}
								onChange={obj => maxiSetAttributes(obj)}
							/>
							<DividerAlignment
								{...getGroupAttributes(attributes, 'divider')}
								lineOrientation={lineOrientation}
								lineVertical={getLastBreakpointAttribute(
									'line-vertical',
									breakpoint,
									attributes
								)}
								lineHorizontal={getLastBreakpointAttribute(
									'line-horizontal',
									breakpoint,
									attributes
								)}
								blockName={name}
								onChangeOrientation={lineOrientation =>
									maxiSetAttributes({
										[`line-orientation-${breakpoint}`]:
											lineOrientation,
									})
								}
								onChangeHorizontal={lineHorizontal =>
									maxiSetAttributes({
										[`line-horizontal-${breakpoint}`]:
											lineHorizontal,
									})
								}
								onChangeVertical={lineVertical =>
									maxiSetAttributes({
										[`line-vertical-${breakpoint}`]:
											lineVertical,
									})
								}
							/>
							<Duplicate clientId={clientId} blockName={name} />
							<Help />
							<MoreSettings
								clientId={clientId}
								{...getGroupAttributes(attributes, [
									'alignment',
									'textAlignment',
								])}
								blockName={name}
								breakpoint={breakpoint}
								onChange={obj => maxiSetAttributes(obj)}
							/>
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
