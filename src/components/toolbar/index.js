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
import { isEmpty, cloneDeep, isEqual, merge } from 'lodash';

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
		const inlineStylesTargetsDefault = {
			background: '',
			border: '',
			boxShadow: '',
			dividerColor: '',
		};

		const {
			attributes,
			backgroundAdvancedOptions,
			clientId,
			isSelected,
			name,
			maxiSetAttributes,
			toggleHandlers,
			rowPattern,
			prefix = '',
			backgroundGlobalProps,
			resizableObject,
			insertInlineStyles,
			cleanInlineStyles,
			inlineStylesTargets = inlineStylesTargetsDefault,
		} = props;
		const {
			blockFullWidth,
			content,
			customLabel,
			fullWidth,
			isFirstOnHierarchy,
			isList,
			linkSettings,
			textLevel,
			typeOfList,
			uniqueID,
			parentBlockStyle,
			svgType,
		} = attributes;

		const { breakpoint, styleCard } = useSelect(select => {
			const { receiveMaxiDeviceType } = select('maxiBlocks');
			const { receiveMaxiSelectedStyleCard } = select(
				'maxiBlocks/style-cards'
			);

			const breakpoint = receiveMaxiDeviceType();

			const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

			return {
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

		const inlineStylesTargetsResults = merge(
			inlineStylesTargetsDefault,
			inlineStylesTargets
		);

		const boundaryElement =
			document.defaultView.frameElement ||
			getScrollContainer(anchorRef) ||
			document.body;

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
						__unstableSlotName='block-toolbar'
						shouldAnchorIncludePadding
						__unstableStickyBoundaryElement={boundaryElement}
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
								maxiSetAttributes={maxiSetAttributes}
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
								clientId={clientId}
								attributes={attributes}
							/>
							<TextColor
								blockName={name}
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChangeInline={obj =>
									insertInlineStyles(obj, '.rich-text')
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles('.rich-text');
								}}
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
											onChangeInline={obj =>
												insertInlineStyles(
													obj,
													'[data-fill]'
												)
											}
											onChange={obj => {
												maxiSetAttributes(obj);
											}}
											content={attributes.content}
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
											onChangeInline={obj =>
												insertInlineStyles(
													obj,
													'[data-stroke]'
												)
											}
											onChange={obj => {
												maxiSetAttributes(obj);
											}}
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
								onChangeInline={obj =>
									insertInlineStyles(
										obj,
										inlineStylesTargetsDefault.background
									)
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(
										inlineStylesTargetsDefault.background
									);
								}}
								clientId={clientId}
							/>
							<BlockBackgroundColor
								{...getGroupAttributes(
									attributes,
									'blockBackground'
								)}
								blockName={name}
								breakpoint={breakpoint}
								onChangeInline={(obj, target) =>
									insertInlineStyles(obj, target)
								}
								onChange={(obj, target) => {
									maxiSetAttributes(obj);
									cleanInlineStyles(target);
								}}
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
								onChangeInline={obj =>
									insertInlineStyles(
										obj,
										inlineStylesTargetsResults.border
									)
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(
										inlineStylesTargetsResults.border
									);
								}}
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
								onChangeInline={obj =>
									insertInlineStyles(
										obj,
										inlineStylesTargetsResults.boxShadow
									)
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(
										inlineStylesTargetsResults.boxShadow
									);
								}}
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
								{...getGroupAttributes(
									attributes,
									'margin',
									false,
									prefix
								)}
								onChange={obj => maxiSetAttributes(obj)}
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
								onChangeInline={obj =>
									insertInlineStyles(
										obj,
										inlineStylesTargetsResults.dividerColor
									)
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(
										inlineStylesTargetsResults.dividerColor
									);
								}}
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
								prefix={prefix}
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
