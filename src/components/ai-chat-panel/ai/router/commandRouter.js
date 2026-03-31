/**
 * Client-side command router.
 *
 * Converts a (rawMessage, RoutingContext) pair into a typed RouteResult
 * without touching any React state. The hook is responsible for acting on
 * the returned result (state updates, block attribute writes, API calls).
 *
 * Processing order mirrors the original sendMessage() cascade:
 *   1.  Text-link detection
 *   2.  Attribute-group builders (L, Meta, CSS, DC, Button A/B/C/I, Text, Container A-Z)
 *   3.  Numeric-value patterns (spacing, image sizing, size limits, border radius)
 *   4.  Direct-removal patterns (corners, shadow, border)
 *   5.  Hex-colour direct action
 *   6.  Shape-divider clarification
 *   6b. Open Cloud Library (insert maxi-cloud block)
 *   7.  LAYOUT_PATTERNS loop (flow triggers, aesthetic, cloud icon, create block,
 *       colour clarify, use_prompt, standard patterns)
 *   8.  Gap patterns
 *   9.  Passthrough (send to AI API)
 */

import LAYOUT_PATTERNS from '../patterns/layoutPatterns';
import {
	getRequestedTargetFromMessage,
	isTargetedPatternTarget,
} from '../patterns/targeting';
import { getAiHandlerForBlock, getAiHandlerForTarget } from '../registry';
import {
	buildColorUpdate,
	getColorTargetFromMessage,
	getColorTargetLabel,
} from '../color/colorClarify';
import {
	buildContainerAGroupAction,
	buildContainerBGroupAction,
	buildContainerCGroupAction,
	buildContainerDGroupAction,
	buildContainerEGroupAction,
	buildContainerFGroupAction,
	buildContainerHGroupAction,
	buildContainerLGroupAction,
	buildContainerMGroupAction,
	buildContainerOGroupAction,
	buildContainerPGroupAction,
	buildContainerRGroupAction,
	buildContainerSGroupAction,
	buildContainerTGroupAction,
	buildContainerWGroupAction,
	buildContainerZGroupAction,
} from '../utils/containerGroups';
import {
	buildTextCGroupAction,
	buildTextLGroupAction,
	buildTextPGroupAction,
	buildTextListGroupAction,
} from '../utils/textGroup';
import { buildDcGroupAction } from '../utils/dcGroup';
import {
	buildAdvancedCssAGroupAction,
} from '../utils/advancedCssAGroup';
import {
	buildMetaAGroupAction,
} from '../utils/metaAGroup';
import {
	buildButtonAGroupAction,
	buildButtonBGroupAction,
	buildButtonCGroupAction,
	buildButtonIGroupAction,
} from '../utils/buttonGroups';
import {
	extractUrl,
	getSpacingIntent,
	parseRemoveSpacingRequest,
	parseNumericSpacingRequest,
	detectSpacingTarget,
	resolveImageRatioValue,
	resolvePromptValue,
} from '../utils/messageExtractors';
import {
	getBlockPrefix,
	collectBlocks,
	findBlockByClientId,
} from '../utils/blockHelpers';

// ─── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Detect whether a message is requesting button-icon line vs fill style.
 *
 * @param {string} lowerMsg
 * @returns {'line'|'fill'}
 */
const resolveButtonIconTarget = lowerMsg => {
	if ( /\bline\b|\boutline\b|\bstroke\b/.test( lowerMsg ) ) return 'line';
	return 'fill';
};

/**
 * Build a shallow DirectAction for the given scope.
 *
 * @param {'selection'|'page'|'global'} currentScope
 * @param {Object}                      fields         Extra action fields.
 * @returns {import('./types').DirectAction}
 */
const makeAction = ( currentScope, fields ) => ( {
	action: currentScope === 'page' ? 'update_page' : 'update_selection',
	...fields,
} );

/** @returns {import('./types').ActionResult} */
const actionResult = payload => ( { type: 'action', payload } );

/** @returns {import('./types').ClarifyResult} */
const clarifyResult = message => ( { type: 'clarify', message } );

// ─── Section handlers ──────────────────────────────────────────────────────────

/**
 * 1. Text-link detection.
 * Matches when the selected block is a text/list-item block and the message
 * contains a URL.
 */
const routeTextLink = ( rawMessage, ctx ) => {
	if ( ! ( ctx.isTextSelection && ctx.textLinkUrl ) ) return null;

	const lowerRaw = rawMessage.toLowerCase();
	const opensInNewTab = /new\s*tab|_blank|external/.test( lowerRaw );
	const noFollow = /nofollow/.test( lowerRaw );
	const sponsored = /sponsored/.test( lowerRaw );
	const ugc = /\bugc\b/.test( lowerRaw );
	const relParts = [];
	if ( noFollow ) relParts.push( 'nofollow' );
	if ( sponsored ) relParts.push( 'sponsored' );
	if ( ugc ) relParts.push( 'ugc' );
	const rel = relParts.join( ' ' );

	return actionResult( {
		action: ctx.currentScope === 'page' ? 'update_page' : 'update_selection',
		property: 'text_link',
		value: {
			url: ctx.textLinkUrl,
			target: opensInNewTab ? '_blank' : '_self',
			...( rel ? { rel } : {} ),
			...( noFollow ? { noFollow: true } : {} ),
			...( sponsored ? { sponsored: true } : {} ),
			...( ugc ? { ugc: true } : {} ),
		},
		message: 'Applied link settings to the selected text.',
		...( ctx.currentScope === 'page' ? { target_block: 'text' } : {} ),
	} );
};

/**
 * 2. Attribute-group builders.
 * Tries every attribute-group builder in priority order. Returns the first
 * non-null action, or null if nothing matches.
 */
const routeAttributeGroups = ( rawMessage, ctx ) => {
	const { currentScope, isButtonContext, isTextContext, isContainerContext,
		metaTargetBlock, dcTargetBlock, selectedBlock } = ctx;

	// Container L-group (links)
	const lGroup = buildContainerLGroupAction( rawMessage, { scope: currentScope } );
	if ( lGroup ) return actionResult( lGroup );

	// Meta A-group
	const metaAction = buildMetaAGroupAction( rawMessage, {
		scope: currentScope,
		targetBlock: metaTargetBlock,
	} );
	if ( metaAction ) return actionResult( metaAction );

	// Advanced CSS A-group
	const advCssAction = buildAdvancedCssAGroupAction( rawMessage, {
		scope: currentScope,
		targetBlock: metaTargetBlock,
	} );
	if ( advCssAction ) return actionResult( advCssAction );

	// Dynamic Content group
	const dcAction = buildDcGroupAction( rawMessage, {
		scope: currentScope,
		targetBlock: dcTargetBlock,
	} );
	if ( dcAction ) return actionResult( dcAction );

	// Button groups (only when button context is active)
	if ( isButtonContext ) {
		const buttonA = buildButtonAGroupAction( rawMessage, { scope: currentScope } );
		if ( buttonA ) return actionResult( buttonA );
		const buttonB = buildButtonBGroupAction( rawMessage, { scope: currentScope } );
		if ( buttonB ) return actionResult( buttonB );
		const buttonC = buildButtonCGroupAction( rawMessage, { scope: currentScope } );
		if ( buttonC ) return actionResult( buttonC );
		const buttonI = buildButtonIGroupAction( rawMessage, { scope: currentScope } );
		if ( buttonI ) return actionResult( buttonI );
	}

	// Text groups (only when text context is active)
	if ( isTextContext ) {
		const textList = buildTextListGroupAction( rawMessage, { scope: currentScope } );
		if ( textList ) return actionResult( textList );
		const textL = buildTextLGroupAction( rawMessage, { scope: currentScope } );
		if ( textL ) return actionResult( textL );
		const textP = buildTextPGroupAction( rawMessage, { scope: currentScope } );
		if ( textP ) return actionResult( textP );
		const textC = buildTextCGroupAction( rawMessage, { scope: currentScope } );
		if ( textC ) return actionResult( textC );
	}

	// Container A-group
	const aGroup = buildContainerAGroupAction( rawMessage, { scope: currentScope } );
	if ( aGroup ) return actionResult( aGroup );

	// Container B-group
	const bGroup = buildContainerBGroupAction( rawMessage, { scope: currentScope } );
	if ( bGroup ) return actionResult( bGroup );

	// Container C-group
	const cGroup = buildContainerCGroupAction( rawMessage, { scope: currentScope } );
	if ( cGroup ) return actionResult( cGroup );

	// Container D-group
	const dGroup = buildContainerDGroupAction( rawMessage, { scope: currentScope } );
	if ( dGroup ) return actionResult( dGroup );

	// Container E-group
	const eGroup = buildContainerEGroupAction( rawMessage, { scope: currentScope } );
	if ( eGroup ) return actionResult( eGroup );

	// Container F-group
	const fGroup = buildContainerFGroupAction( rawMessage, { scope: currentScope } );
	if ( fGroup ) return actionResult( fGroup );

	// Container M-group
	const mGroup = buildContainerMGroupAction( rawMessage, { scope: currentScope } );
	if ( mGroup ) return actionResult( mGroup );

	// Container W-group
	const wGroup = buildContainerWGroupAction( rawMessage, {
		scope: currentScope,
		targetBlock: selectedBlock?.name?.includes( 'column' ) ? 'column' : null,
		blockName: selectedBlock?.name,
	} );
	if ( wGroup ) return actionResult( wGroup );

	// Container Z-group
	const zGroup = buildContainerZGroupAction( rawMessage, { scope: currentScope } );
	if ( zGroup ) return actionResult( zGroup );

	// Container P-group
	const pGroup = buildContainerPGroupAction( rawMessage, { scope: currentScope } );
	if ( pGroup ) return actionResult( pGroup );

	// Container R-group
	const rGroup = buildContainerRGroupAction( rawMessage, { scope: currentScope } );
	if ( rGroup ) return actionResult( rGroup );

	// Container S-group
	const sGroup = buildContainerSGroupAction( rawMessage, { scope: currentScope } );
	if ( sGroup ) return actionResult( sGroup );

	// Container T-group
	const tGroup = buildContainerTGroupAction( rawMessage, { scope: currentScope } );
	if ( tGroup ) return actionResult( tGroup );

	// Container O-group
	const oGroup = buildContainerOGroupAction( rawMessage, { scope: currentScope } );
	if ( oGroup ) return actionResult( oGroup );

	// Container H-group
	const hGroup = buildContainerHGroupAction( rawMessage, { scope: currentScope } );
	if ( hGroup ) return actionResult( hGroup );

	return null;
};

/**
 * 3. Numeric-value patterns (spacing, image sizing, size limits, border radius).
 */
const routeNumericPatterns = ( rawMessage, ctx ) => {
	const { lowerMessage, currentScope, isGlobalScope, isImageRequest, selectedBlock } = ctx;

	// Spacing removal
	if ( ! isGlobalScope ) {
		const removeSpacing = parseRemoveSpacingRequest( rawMessage );
		if ( removeSpacing ) {
			const actionType = currentScope === 'selection' ? 'update_selection' : 'update_page';
			const targetBlock =
				currentScope === 'page'
					? detectSpacingTarget( rawMessage ) || 'container'
					: null;
			const parts = removeSpacing.property.split( '_' );
			const label =
				parts.length === 2
					? `${ parts[ 1 ] } ${ parts[ 0 ] }`
					: removeSpacing.property;
			return actionResult( {
				action: actionType,
				property: removeSpacing.property,
				value: removeSpacing.value,
				...( targetBlock ? { target_block: targetBlock } : {} ),
				message: `Removed ${ label }.`,
			} );
		}
	}

	// Spacing clarification (vague — no numeric value given)
	const spacingIntent = getSpacingIntent( rawMessage );
	if (
		( lowerMessage.includes( 'spacing' ) ||
			lowerMessage.includes( 'space' ) ||
			lowerMessage.includes( 'padding' ) ||
			lowerMessage.includes( 'margin' ) ||
			lowerMessage.includes( 'taller' ) ) &&
		! ctx.hasExplicitNumericValue &&
		! lowerMessage.includes( 'compact' ) &&
		! lowerMessage.includes( 'comfortable' ) &&
		! lowerMessage.includes( 'spacious' ) &&
		! lowerMessage.includes( 'square' )
	) {
		let target = null;
		if ( lowerMessage.includes( 'video' ) ) target = 'video';
		else if ( lowerMessage.includes( 'image' ) ) target = 'image';
		else if ( lowerMessage.includes( 'button' ) ) target = 'button';
		else if ( lowerMessage.includes( 'container' ) || lowerMessage.includes( 'section' ) )
			target = 'container';

		if ( ! target && currentScope === 'selection' && selectedBlock?.name?.includes( 'video' ) ) {
			target = 'video';
		}

		const spacingBase =
			spacingIntent?.base ||
			( lowerMessage.includes( 'margin' ) ? 'margin' : 'padding' );
		const spacingSide = spacingIntent?.side || null;
		const spacingLabel = spacingSide ? `${ spacingSide } ${ spacingBase }` : spacingBase;

		return clarifyResult( {
			role: 'assistant',
			content: target
				? `How much ${ spacingLabel } for the ${ target }s?`
				: `How much ${ spacingLabel } would you like?`,
			options: [ 'Compact', 'Comfortable', 'Spacious', 'Remove' ],
			targetContext: target || 'container',
			spacingBase,
			spacingSide,
			executed: false,
		} );
	}

	// Numeric padding/margin
	const numericSpacing = parseNumericSpacingRequest( rawMessage );
	if ( numericSpacing ) {
		const actionType = currentScope === 'selection' ? 'update_selection' : 'update_page';
		const targetBlock =
			currentScope === 'page'
				? detectSpacingTarget( rawMessage ) || 'container'
				: null;
		const parts = numericSpacing.property.split( '_' );
		const label =
			parts.length === 2
				? `${ parts[ 1 ] } ${ parts[ 0 ] }`
				: numericSpacing.property;
		return actionResult( {
			action: actionType,
			property: numericSpacing.property,
			value: numericSpacing.value,
			...( targetBlock ? { target_block: targetBlock } : {} ),
			message: `Applied ${ numericSpacing.value } ${ label }.`,
		} );
	}

	// Image: aspect ratio, width, height
	if ( isImageRequest ) {
		const ratioMatch = lowerMessage.match( /(\d+)\s*[:/]\s*(\d+)/ );
		if ( ratioMatch ) {
			const ratioValue = resolveImageRatioValue( ratioMatch[ 1 ], ratioMatch[ 2 ] );
			return actionResult( {
				action: currentScope === 'selection' ? 'update_selection' : 'update_page',
				property: 'image_ratio',
				value: ratioValue,
				target_block: 'image',
				message: `Aspect ratio set to ${ ratioMatch[ 1 ] }:${ ratioMatch[ 2 ] }.`,
			} );
		}

		const widthMatch = lowerMessage.match(
			/(?:image|img).*(?:width|wide)\s*(?:to|=|is)?\s*(\d+)\s*(px|%)/i
		);
		if ( widthMatch ) {
			const value = Number( widthMatch[ 1 ] );
			const unit = widthMatch[ 2 ];
			const prop = unit === '%' ? 'img_width' : 'width';
			return actionResult( {
				action: currentScope === 'selection' ? 'update_selection' : 'update_page',
				property: prop,
				value,
				target_block: 'image',
				message: `Image width set to ${ value }${ unit }.`,
			} );
		}

		const heightMatch = lowerMessage.match(
			/(?:image|img).*(?:height|tall)\s*(?:to|=|is)?\s*(\d+)\s*(px|%)/i
		);
		if ( heightMatch ) {
			const value = Number( heightMatch[ 1 ] );
			const unit = heightMatch[ 2 ];
			return actionResult( {
				action: currentScope === 'selection' ? 'update_selection' : 'update_page',
				property: 'height',
				value,
				target_block: 'image',
				message: `Image height set to ${ value }${ unit }.`,
			} );
		}
	}

	// Min/max width & height
	const resolveSizeTarget = () => {
		if (
			lowerMessage.includes( 'image' ) ||
			lowerMessage.includes( 'photo' ) ||
			lowerMessage.includes( 'picture' )
		)
			return 'image';
		if ( lowerMessage.includes( 'button' ) ) return 'button';
		if (
			lowerMessage.includes( 'container' ) ||
			lowerMessage.includes( 'section' ) ||
			lowerMessage.includes( 'row' ) ||
			lowerMessage.includes( 'column' )
		)
			return 'container';
		if ( selectedBlock?.name ) {
			if ( selectedBlock.name.includes( 'image' ) ) return 'image';
			if ( selectedBlock.name.includes( 'button' ) ) return 'button';
			if ( selectedBlock.name.includes( 'container' ) ) return 'container';
		}
		return 'container';
	};

	const limitMatch = lowerMessage.match(
		/\b(max(?:imum)?|min(?:imum)?)\s*[- ]*(width|height)\b[^0-9-]*(-?\d+(?:\.\d+)?)\s*(px|%|vh|vw|em|rem)?/i
	);
	const limitMatchAlt = lowerMessage.match(
		/\b(width|height)\s*(max(?:imum)?|min(?:imum)?)\b[^0-9-]*(-?\d+(?:\.\d+)?)\s*(px|%|vh|vw|em|rem)?/i
	);

	if ( limitMatch || limitMatchAlt ) {
		const match = limitMatch || limitMatchAlt;
		const isAlt = Boolean( limitMatchAlt );
		const limitTypeRaw = isAlt ? match[ 2 ] : match[ 1 ];
		const dimension = isAlt ? match[ 1 ] : match[ 2 ];
		const numberValue = Number( match[ 3 ] );
		const unitValue = match[ 4 ];

		if ( ! Number.isNaN( numberValue ) ) {
			const limitType = limitTypeRaw.toLowerCase().startsWith( 'max' ) ? 'max' : 'min';
			const prop = `${ limitType }_${ dimension.toLowerCase() }`;
			const value = unitValue ? `${ numberValue }${ unitValue }` : numberValue;
			const labelUnit = unitValue || 'px';
			return actionResult( {
				action: currentScope === 'selection' ? 'update_selection' : 'update_page',
				property: prop,
				value,
				target_block: resolveSizeTarget(),
				message: `${ limitType.toUpperCase() } ${ dimension } set to ${ numberValue }${ labelUnit }.`,
			} );
		}
	}

	// Border radius — numeric
	const radiusMatch = lowerMessage.match(
		/\b(?:corner|corners|radius|rounded)\b[^0-9-]*(-?\d+(?:\.\d+)?)\s*(px|%|em|rem)?/i
	);
	if ( radiusMatch ) {
		const numericValue = Number( radiusMatch[ 1 ] );
		if ( ! Number.isNaN( numericValue ) ) {
			return actionResult( {
				action: currentScope === 'selection' ? 'update_selection' : 'update_page',
				property: 'border_radius',
				value: numericValue,
				message: `Applied border radius (${ numericValue }px).`,
			} );
		}
	}

	return null;
};

/**
 * 4. Direct-removal patterns (square corners, shadow, border).
 */
const routeDirectRemovals = ( rawMessage, ctx ) => {
	const { lowerMessage, currentScope } = ctx;

	const hasRoundIntent = /\bround(?:ed|ing|er)?\b/.test( lowerMessage );

	// Square / remove corners
	if (
		lowerMessage.includes( 'square' ) ||
		( lowerMessage.includes( 'remove' ) &&
			( hasRoundIntent || lowerMessage.includes( 'radius' ) ) )
	) {
		return actionResult(
			currentScope === 'selection'
				? {
						action: 'update_selection',
						property: 'border_radius',
						value: 0,
						message: 'Removed rounded corners from selected block.',
				  }
				: {
						action: 'update_page',
						property: 'border_radius',
						value: 0,
						message: 'Removed rounded corners.',
				  }
		);
	}

	// Remove shadow
	if (
		( lowerMessage.includes( 'remove' ) && lowerMessage.includes( 'shadow' ) ) ||
		lowerMessage.includes( 'no shadow' )
	) {
		return actionResult(
			currentScope === 'selection'
				? {
						action: 'update_selection',
						property: 'box_shadow',
						value: 'none',
						message: 'Removed shadow from selected block.',
				  }
				: {
						action: 'update_page',
						property: 'box_shadow',
						value: 'none',
						message: 'Removed shadows.',
				  }
		);
	}

	// Remove border
	if (
		lowerMessage.includes( 'remove' ) &&
		lowerMessage.includes( 'border' ) &&
		! lowerMessage.includes( 'radius' )
	) {
		let explicitTarget = null;
		if ( lowerMessage.includes( 'image' ) ) explicitTarget = 'image';
		else if ( lowerMessage.includes( 'button' ) ) explicitTarget = 'button';
		else if ( lowerMessage.includes( 'container' ) || lowerMessage.includes( 'section' ) )
			explicitTarget = 'container';

		return actionResult( {
			...( currentScope === 'selection'
				? {
						action: 'update_selection',
						property: 'border',
						value: 'none',
						message: 'Removed border from selected block.',
				  }
				: {
						action: 'update_page',
						property: 'border',
						value: 'none',
						message: 'Removed borders.',
				  } ),
			...( explicitTarget ? { target_block: explicitTarget } : {} ),
		} );
	}

	// Alignment clarifications
	if (
		lowerMessage.includes( 'align' ) &&
		lowerMessage.includes( 'center' ) &&
		( lowerMessage.includes( 'everything' ) || lowerMessage.includes( 'all' ) )
	) {
		return clarifyResult( {
			role: 'assistant',
			content: 'Would you like to align the text or the items?',
			options: [ 'Align Text', 'Align Items' ],
			alignmentType: 'center',
			executed: false,
		} );
	}

	if (
		lowerMessage.includes( 'align' ) &&
		( lowerMessage.includes( 'everything' ) || lowerMessage.includes( 'all' ) ) &&
		! lowerMessage.includes( 'left' ) &&
		! lowerMessage.includes( 'right' ) &&
		! lowerMessage.includes( 'center' ) &&
		! lowerMessage.includes( 'bottom' ) &&
		! lowerMessage.includes( 'top' )
	) {
		return clarifyResult( {
			role: 'assistant',
			content: 'How would you like to align everything?',
			options: [ 'Align Left', 'Align Center', 'Align Right' ],
			executed: false,
		} );
	}

	return null;
};

/**
 * 5. Hex-colour direct action — applies when the message contains a #hex code
 *    and is not primarily about borders/outlines/shadows.
 */
const routeHexColor = ( rawMessage, ctx ) => {
	const { hexColor, lowerMessage, currentScope, selectedBlock } = ctx;
	if ( ! hexColor ) return null;

	const isFlowIntent =
		lowerMessage.includes( 'border' ) ||
		lowerMessage.includes( 'outline' ) ||
		lowerMessage.includes( 'shadow' ) ||
		lowerMessage.includes( 'glow' );

	if ( isFlowIntent ) return null;

	const colorTarget = getColorTargetFromMessage( lowerMessage, { selectedBlock } );
	const colorUpdate = buildColorUpdate( colorTarget, hexColor, { selectedBlock } );

	if ( ! colorUpdate.property ) return null;

	return actionResult( {
		action: currentScope === 'selection' ? 'update_selection' : 'update_page',
		property: colorUpdate.property,
		value: colorUpdate.value,
		target_block: colorUpdate.targetBlock,
		message: `Applied custom colour to ${ colorUpdate.msgText }.`,
	} );
};

/**
 * 6. Shape-divider clarification.
 */
const routeShapeDivider = ctx => {
	const { lowerMessage, hasShapeDividerIntent, hasShapeDividerStyle } = ctx;
	if ( ! hasShapeDividerIntent || hasShapeDividerStyle ) return null;

	const wantsTop = /\btop\b/.test( lowerMessage );
	const wantsBottom = /\bbottom\b/.test( lowerMessage );

	if ( ! wantsTop && ! wantsBottom ) {
		return clarifyResult( {
			role: 'assistant',
			content: 'Where do you want the shape divider?',
			options: [ 'Top', 'Bottom', 'Both' ],
			shapeDividerLocation: true,
			executed: false,
		} );
	}

	const location =
		wantsTop && wantsBottom ? 'both' : wantsTop ? 'top' : 'bottom';
	return clarifyResult( {
		role: 'assistant',
		content: 'Which shape style should the divider use?',
		options: [ 'Wave', 'Curve', 'Slant', 'Triangle' ],
		shapeDividerTarget: location,
		executed: false,
	} );
};

/**
 * Resolve the cloud-icon target from selected block / message intent.
 *
 * @param {string} lowerMessage
 * @param {Object|null} selectedBlock
 * @returns {{ targetBlock: string, property: string, svgTarget: string }}
 */
const resolveCloudIconTarget = ( lowerMessage, selectedBlock ) => {
	const selectedName = selectedBlock?.name || '';
	if ( selectedName.includes( 'button' ) )
		return { targetBlock: 'button', property: 'button_icon_svg', svgTarget: 'icon' };
	if ( selectedName.includes( 'icon-maxi' ) || selectedName.includes( 'svg-icon' ) )
		return { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };

	if ( /\bbutton\b/.test( lowerMessage ) )
		return { targetBlock: 'button', property: 'button_icon_svg', svgTarget: 'icon' };
	if ( /\b(icon block|svg icon|svg-icon|icon maxi)\b/.test( lowerMessage ) )
		return { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
	if ( /\bicons?\b/.test( lowerMessage ) )
		return { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };

	return { targetBlock: 'button', property: 'button_icon_svg', svgTarget: 'icon' };
};

/**
 * Resolve the layout target for a selection-scope layout intent.
 *
 * @param {Object|null} selectedBlock
 * @param {Function}    selectFn       WordPress `select` function
 * @returns {string|null}
 */
const resolveSelectionLayoutTarget = ( selectedBlock, selectFn ) => {
	if ( ! selectedBlock ) return null;

	const hasChild = ( block, name ) =>
		block?.innerBlocks?.some( child => child.name.includes( name ) );

	if ( selectedBlock.name.includes( 'row' ) ) return 'row';
	if ( selectedBlock.name.includes( 'column' ) ) return 'column';
	if ( selectedBlock.name.includes( 'group' ) ) return 'group';
	if ( selectedBlock.name.includes( 'container' ) ) {
		if ( hasChild( selectedBlock, 'row' ) ) return 'row';
		if ( hasChild( selectedBlock, 'column' ) ) return 'column';
		if ( hasChild( selectedBlock, 'group' ) ) return 'group';
		return 'container';
	}

	if ( ! selectFn ) return null;
	const { getBlockParents, getBlock } = selectFn( 'core/block-editor' );
	const parentIds = getBlockParents( selectedBlock.clientId ) || [];
	const parentBlocks = parentIds.map( id => getBlock( id ) ).filter( Boolean );
	const layoutParent = parentBlocks.find( p =>
		p.name.includes( 'column' ) ||
		p.name.includes( 'row' ) ||
		p.name.includes( 'group' ) ||
		p.name.includes( 'container' )
	);

	if ( ! layoutParent ) return null;
	if ( layoutParent.name.includes( 'column' ) ) return 'column';
	if ( layoutParent.name.includes( 'row' ) ) return 'row';
	if ( layoutParent.name.includes( 'group' ) ) return 'group';
	if ( layoutParent.name.includes( 'container' ) ) return 'container';
	return null;
};

/**
 * 7. LAYOUT_PATTERNS loop.
 * Iterates over LAYOUT_PATTERNS and dispatches to sub-handlers based on
 * the matched pattern's `property` field.
 *
 * @param {string}                      rawMessage
 * @param {import('./types').RoutingContext} ctx
 * @param {Function|null}               selectFn  WordPress `select` (optional, for parent lookup)
 * @returns {import('./types').RouteResult|null}
 */
const routeLayoutPatterns = ( rawMessage, ctx, selectFn ) => {
	if ( ctx.skipLayoutPatterns ) return null;

	const {
		lowerMessage, hexColor, currentScope, isGlobalScope,
		requestedTarget, hasShapeDividerIntent, selectedBlock, allBlocks,
	} = ctx;

	for ( const pattern of LAYOUT_PATTERNS ) {
		if ( isGlobalScope ) break;

		// Skip hover patterns when targeting image
		if ( requestedTarget === 'image' && ! pattern.target ) {
			if (
				pattern.property === 'hover_effect' ||
				pattern.property.startsWith( 'hover_' )
			) {
				continue;
			}
		}

		if ( ! lowerMessage.match( pattern.regex ) ) continue;

		// Skip divider shape if shape-divider not in message
		if ( hasShapeDividerIntent && pattern.target === 'divider' ) continue;

		// Skip patterns whose target doesn't match what the user asked for
		if (
			requestedTarget &&
			isTargetedPatternTarget( pattern.target ) &&
			pattern.target !== requestedTarget
		) {
			continue;
		}

		// ── FSM Flow Trigger ─────────────────────────────────────────────────
		if ( pattern.property.startsWith( 'flow_' ) ) {
			const result = routeFlowPattern( rawMessage, pattern, ctx, selectFn );
			if ( result ) return result;
			continue; // startResponse was null or block mismatch — try next pattern
		}

		// ── Aesthetic (apply_theme) ──────────────────────────────────────────
		if ( pattern.property === 'aesthetic' ) {
			return actionResult( {
				action: 'apply_theme',
				prompt: `Apply ${ pattern.value } style: ${ lowerMessage }`,
				message: pattern.pageMsg,
			} );
		}

		// ── Cloud icon search ────────────────────────────────────────────────
		if ( pattern.property === 'cloud_icon' ) {
			const iconResult = routeCloudIcon( rawMessage, ctx );
			if ( iconResult ) return iconResult;
			continue; // skip pattern — icon check rejected it
		}

		// ── Insert blank block directly (no cloud library) ──────────────────
		if ( pattern.property === 'insert_block' ) {
			const blockTypeMatch = rawMessage.match(
				/\b(container|row|column|section|block)\b/i
			);
			const blockType = blockTypeMatch
				? blockTypeMatch[ 1 ].toLowerCase()
				: 'container';
			return {
				type: 'insert_block',
				params: { blockType },
			};
		}

		// ── Create block (pattern insert) ───────────────────────────────────
		if ( pattern.property === 'create_block' ) {
			return {
				type: 'create_block',
				params: {
					rawMessage,
					targetClientId: selectedBlock?.clientId || null,
				},
			};
		}

		// ── Colour clarification ─────────────────────────────────────────────
		if ( pattern.property === 'color_clarify' ) {
			return routeColorClarify( rawMessage, pattern, ctx );
		}

		// ── use_prompt patterns ──────────────────────────────────────────────
		let resolvedValue = pattern.value;
		if ( pattern.value === 'use_prompt' ) {
			const promptValue = resolvePromptValue( pattern.property, rawMessage );
			if ( ! promptValue ) {
				const missingMsg =
					pattern.property === 'button_text'
						? 'Please include the button text, e.g. "Set button text to Buy now".'
						: pattern.property === 'button_url'
						? 'Please include the URL, e.g. "Link the button to https://example.com".'
						: pattern.property === 'captionContent'
						? 'Please include the caption text, e.g. "Set caption to Summer Sale".'
						: pattern.property === 'mediaAlt'
						? 'Please include the alt text, e.g. "Set alt text to smiling customer".'
						: pattern.property === 'mediaURL'
						? 'Please include the image URL, e.g. "Replace image with https://example.com/photo.jpg".'
						: 'Please include the value in your request.';

				return clarifyResult( {
					role: 'assistant',
					content: missingMsg,
					executed: false,
				} );
			}

			resolvedValue = promptValue;
			if ( pattern.property === 'icon_color' ) {
				resolvedValue = {
					target: resolveButtonIconTarget( lowerMessage ),
					color: promptValue,
				};
			}
		}

		// ── Standard pattern ─────────────────────────────────────────────────
		const isLayoutAlign =
			pattern.property === 'align_items_flex' ||
			pattern.property === 'justify_content';
		let resolvedTarget = pattern.target || requestedTarget || 'container';

		if ( ! pattern.target && currentScope === 'selection' && isLayoutAlign ) {
			const selTarget = resolveSelectionLayoutTarget( selectedBlock, selectFn );
			if ( selTarget ) resolvedTarget = selTarget;
		}
		if ( pattern.property.startsWith( 'shape_divider' ) ) {
			resolvedTarget = 'container';
		}

		return actionResult(
			currentScope === 'selection'
				? {
						action: 'update_selection',
						property: pattern.property,
						value: resolvedValue,
						target_block: resolvedTarget,
						message: pattern.selectionMsg,
				  }
				: {
						action: 'update_page',
						property: pattern.property,
						value: resolvedValue,
						target_block: resolvedTarget,
						message: pattern.pageMsg,
				  }
		);
	}

	return null; // no pattern matched
};

/**
 * Handles the `flow_*` branch inside the LAYOUT_PATTERNS loop.
 * Returns a FlowResult or ImmediateUpdatesResult, or null if the flow can't
 * be started (wrong block type, no blocks found, etc.).
 */
const routeFlowPattern = ( rawMessage, pattern, ctx, selectFn ) => {
	const {
		lowerMessage, hexColor, currentScope, selectedBlock, allBlocks,
	} = ctx;

	// Determine effective scope (user can override with "all/page/everywhere")
	let flowScope = currentScope;
	if ( /all|page|everywhere/i.test( lowerMessage ) ) flowScope = 'page';

	const matchName = pattern.target || ctx.requestedTarget || 'container';
	const selectionRoot = selectedBlock
		? findBlockByClientId( allBlocks, selectedBlock.clientId ) || selectedBlock
		: null;
	const isTextTarget = matchName === 'text';
	const wantsHeading = /\b(heading|headline|title|subheading|h[1-6])\b/.test( lowerMessage );
	const wantsParagraph = /\b(paragraph|body\s*text|body)\b/.test( lowerMessage );

	const getTextLevel = block =>
		String( block?.attributes?.textLevel || '' ).toLowerCase();

	const collectTextBlocks = blocks => {
		const textBlocks = collectBlocks(
			blocks,
			block =>
				block?.name &&
				( block.name.includes( 'text' ) || block.name.includes( 'heading' ) )
		);
		if ( ! textBlocks.length ) return textBlocks;
		if ( wantsHeading ) {
			const heading = textBlocks.filter( b => {
				if ( b?.name?.includes( 'heading' ) ) return true;
				return /^h[1-6]$/.test( getTextLevel( b ) );
			} );
			if ( heading.length ) return heading;
		}
		if ( wantsParagraph ) {
			const para = textBlocks.filter( b => getTextLevel( b ) === 'p' );
			if ( para.length ) return para;
		}
		return textBlocks;
	};

	// Resolve target blocks based on scope
	let targetBlocks = [];

	if ( flowScope === 'selection' ) {
		if ( ! selectedBlock ) {
			return clarifyResult( {
				role: 'assistant',
				content: 'Please select a block first.',
				executed: false,
			} );
		}

		if ( isTextTarget ) {
			const textBlocks = selectionRoot ? collectTextBlocks( [ selectionRoot ] ) : [];
			if ( ! textBlocks.length ) {
				return clarifyResult( {
					role: 'assistant',
					content: 'Please select a text or heading block.',
					executed: false,
				} );
			}
			targetBlocks = textBlocks;
		} else {
			// If the selected block doesn't match this pattern's target, skip
			if (
				matchName &&
				selectedBlock?.name &&
				! selectedBlock.name.includes( matchName )
			) {
				return null; // skip → try next pattern
			}
			targetBlocks = [ selectionRoot || selectedBlock ];
		}
	} else {
		targetBlocks = isTextTarget
			? collectTextBlocks( allBlocks )
			: collectBlocks( allBlocks, b => b.name.includes( matchName ) );

		if ( targetBlocks.length === 0 ) {
			return clarifyResult( {
				role: 'assistant',
				content: isTextTarget
					? 'No text blocks found on this page.'
					: `No ${ matchName }s found on this page.`,
				executed: false,
			} );
		}
	}

	// Run the block handler to get the flow's first step / response
	const primaryBlock = targetBlocks[ 0 ];
	const prefix = getBlockPrefix( primaryBlock.name );
	const flowHandler =
		getAiHandlerForBlock( primaryBlock ) || getAiHandlerForTarget( matchName );

	// Gather any pre-filled flow data from the message
	const flowData = {};
	const inferTextAlignment = msg => {
		if ( /\bjustif(y|ied)\b/.test( msg ) ) return 'justify';
		if ( /\b(center|centre|centered|centred)\b/.test( msg ) ) return 'center';
		if ( /\bright\b/.test( msg ) ) return 'right';
		if ( /\bleft\b/.test( msg ) ) return 'left';
		return null;
	};

	if ( hexColor ) {
		if ( pattern.property === 'flow_outline' || pattern.property === 'flow_border' )
			flowData.border_color = hexColor;
		if ( pattern.property === 'flow_shadow' )
			flowData.shadow_color = hexColor;
	}

	if ( pattern.property === 'flow_text_align' ) {
		const inferred = inferTextAlignment( lowerMessage );
		if ( inferred ) flowData.text_align = inferred;
	}

	if ( pattern.property === 'flow_icon_line_width' ) {
		const widthMatch = lowerMessage.match(
			/\b(?:stroke|line)\s*(?:width|thickness|weight)\b[^0-9]*([0-9]+(?:\.[0-9]+)?)/
		);
		if ( widthMatch ) {
			const widthValue = Number( widthMatch[ 1 ] );
			if ( Number.isFinite( widthValue ) ) flowData.icon_line_width = widthValue;
		}
	}

	const startResponse = flowHandler
		? flowHandler( primaryBlock, pattern.property, 'start', prefix, flowData )
		: null;

	if ( ! startResponse ) return null; // skip → try next pattern

	// Immediate-apply case (no conversation step needed)
	if ( startResponse.action === 'apply' ) {
		const updates = [];
		targetBlocks.forEach( blk => {
			const p = getBlockPrefix( blk.name );
			const handler =
				getAiHandlerForBlock( blk ) || getAiHandlerForTarget( matchName );
			const res = handler ? handler( blk, pattern.property, null, p, flowData ) : null;
			if ( res?.action === 'apply' && res?.attributes ) {
				updates.push( { clientId: blk.clientId, attributes: res.attributes } );
			}
		} );

		const fallbackMsg =
			flowScope === 'selection' ? pattern.selectionMsg : pattern.pageMsg;
		const finalMsg = startResponse.message || fallbackMsg || 'Done.';

		return {
			type: 'immediate_updates',
			updates,
			message: {
				role: 'assistant',
				content: finalMsg,
				executed: updates.length > 0,
			},
			sidebarProperty:
				flowScope === 'selection' ? pattern.property : null,
		};
	}

	// Flow context case (conversation continues)
	return {
		type: 'flow',
		flowContext: {
			flow: pattern.property,
			pendingTarget: startResponse.target || null,
			data: flowData,
			mode: flowScope,
			currentOptions: startResponse.options || [],
			blockIds: targetBlocks.map( b => b.clientId ),
		},
		message: {
			role: 'assistant',
			content: startResponse.msg,
			options: startResponse.options
				? startResponse.options.map( o => o.label || o )
				: startResponse.action === 'ask_palette'
				? [ 'palette' ]
				: [],
			optionsType:
				startResponse.action === 'ask_palette' ? 'palette' : 'text',
			colorTarget: startResponse.target,
			executed: false,
		},
		sidebarProperty:
			flowScope === 'selection' ? pattern.property : null,
	};
};

/**
 * Handles the `cloud_icon` branch — runs the guard checks and returns
 * a CloudIconResult with pre-computed params for the hook's async handler,
 * or null if the pattern should be skipped.
 */
const routeCloudIcon = ( rawMessage, ctx ) => {
	const { lowerMessage, currentScope, selectedBlock, allBlocks } = ctx;
	const selectedName = selectedBlock?.name || '';

	const isIconColorIntent =
		/\b(colou?r|fill|stroke)\b/.test( lowerMessage ) ||
		/\bline\s*width\b/.test( lowerMessage );

	if ( isIconColorIntent ) return null; // skip this pattern

	const hasIconKeyword = /\bicons?\b/.test( lowerMessage );
	const hasCloudKeyword = /\b(cloud|library)\b/.test( lowerMessage );
	const hasThemeIntent = /\b(?:theme|style|vibe|look)\b/.test( lowerMessage );
	const hasPronounIntent = /\b(this|these|those|them)\b/.test( lowerMessage );
	const hasChangeIntent =
		/\b(change|swap|replace|use|set|add|insert|make|give|update)\b/.test(
			lowerMessage
		);
	const matchTitlesIntent =
		/\b(match|use|set|make|change|swap|replace)\b[^.]*\b(title|titles|label|labels|text|heading|headings)\b[^.]*\b(below|under|beneath|underneath|following|next)\b/.test(
			lowerMessage
		);
	const matchTitlesToIconsIntent =
		/\b(match|sync|update|set|make|change|swap|replace)\b[^.]*\b(title|titles|label|labels|text|heading|headings)\b[^.]*\bicons?\b/.test(
			lowerMessage
		) ||
		/\b(title|titles|label|labels|text|heading|headings)\b[^.]*\b(match|sync|update|set|make|change)\b[^.]*\bicons?\b/.test(
			lowerMessage
		);
	const mentionsOtherTargets =
		/\b(text|heading|paragraph|container|section|background|layout|spacing|padding|margin|row|column|group|divider|image|video|button)\b/.test(
			lowerMessage
		);

	const selectionRoot =
		currentScope === 'selection' && selectedBlock
			? findBlockByClientId( allBlocks, selectedBlock.clientId ) || selectedBlock
			: null;
	const scopeBlocks =
		currentScope === 'selection' && selectionRoot ? [ selectionRoot ] : allBlocks;
	const iconBlocksInScope = collectBlocks(
		scopeBlocks,
		block =>
			block.name.includes( 'icon-maxi' ) || block.name.includes( 'svg-icon' )
	);
	const buttonBlocksInScope = collectBlocks( scopeBlocks, block =>
		block.name.includes( 'button' )
	);
	const hasIconBlocksInScope = iconBlocksInScope.length > 0;
	const hasIconSelection =
		selectedName.includes( 'button' ) ||
		selectedName.includes( 'icon-maxi' ) ||
		selectedName.includes( 'svg-icon' );
	const shouldTreatAsIconTheme =
		hasIconBlocksInScope &&
		hasThemeIntent &&
		( hasPronounIntent || hasChangeIntent ) &&
		! mentionsOtherTargets;

	if (
		! hasIconKeyword &&
		! hasCloudKeyword &&
		! hasIconSelection &&
		! shouldTreatAsIconTheme &&
		! matchTitlesIntent &&
		! matchTitlesToIconsIntent
	) {
		return null; // skip pattern
	}

	const wantsMultipleIcons =
		/\ball\b.*\bicons?\b|\bicons\b/.test( lowerMessage ) ||
		( shouldTreatAsIconTheme && iconBlocksInScope.length > 1 );

	return {
		type: 'cloud_icon',
		params: {
			rawMessage,
			lowerMessage,
			currentScope,
			selectedBlock,
			iconBlocksInScope,
			buttonBlocksInScope,
			wantsMultipleIcons,
			matchTitlesToIconsIntent,
			matchTitlesIntent,
			shouldTreatAsIconTheme,
			hasIconBlocksInScope,
			cloudIconTarget: resolveCloudIconTarget( lowerMessage, selectedBlock ),
		},
	};
};

/**
 * Handles the `color_clarify` branch.
 * If the message contains a direct hex colour, converts it to an action.
 * Otherwise returns a palette-picker clarification.
 */
const routeColorClarify = ( rawMessage, pattern, ctx ) => {
	const { hexColor, lowerMessage, currentScope, selectedBlock } = ctx;
	const colorTarget =
		pattern.colorTarget || getColorTargetFromMessage( lowerMessage, { selectedBlock } );

	if ( hexColor ) {
		const colorUpdate = buildColorUpdate( colorTarget, hexColor, { selectedBlock } );
		return actionResult( {
			action: currentScope === 'selection' ? 'update_selection' : 'update_page',
			property: colorUpdate.property,
			value: colorUpdate.value,
			target_block: colorUpdate.targetBlock,
			message: `Applied custom colour to ${ colorUpdate.msgText }.`,
		} );
	}

	// If we still don't know what to change, ask before showing the palette.
	if ( colorTarget === 'element' ) {
		return {
			type: 'flow',
			flowContext: { type: 'color_what' },
			message: {
				role: 'assistant',
				content: 'Colour of what would you like to change?',
				options: [ 'Text colour', 'Background colour', 'Border colour' ],
				optionsType: 'text',
				executed: false,
			},
			sidebarProperty: null,
		};
	}

	return clarifyResult( {
		role: 'assistant',
		content: `Choose a colour for the ${ getColorTargetLabel( colorTarget ) }:`,
		options: true,
		optionsType: 'palette',
		colorTarget,
		originalMessage: rawMessage,
	} );
};

/**
 * 8. Gap patterns.
 */
const routeGap = ( rawMessage, ctx ) => {
	const { lowerMessage, currentScope, isGlobalScope } = ctx;
	if ( isGlobalScope ) return null;

	const gapMatch = lowerMessage.match(
		/(\d+)\s*(?:px)?\s*(?:gap|gutter|air\s*between|space\s*between\s*items)/i
	);
	if ( gapMatch ) {
		const gapValue = parseInt( gapMatch[ 1 ] );
		return actionResult(
			currentScope === 'selection'
				? {
						action: 'update_selection',
						property: 'gap',
						value: gapValue,
						message: `Applied ${ gapValue }px gap between items.`,
				  }
				: {
						action: 'update_page',
						property: 'gap',
						value: gapValue,
						target_block: 'container',
						message: `Applied ${ gapValue }px gap to containers.`,
				  }
		);
	}

	if (
		lowerMessage.match( /add\s*(gap|gutter)|gap\s*between|gutter\s*between/ ) &&
		! gapMatch
	) {
		return clarifyResult( {
			role: 'assistant',
			content: 'How much gap would you like between items?',
			options: [ 'Small (10px)', 'Medium (20px)', 'Large (40px)' ],
			gapTarget: currentScope === 'selection' ? 'selection' : 'container',
			executed: false,
		} );
	}

	return null;
};

/**
 * User wants the Maxi Cloud Library UI to search or insert patterns/pages manually.
 * Runs before LAYOUT_PATTERNS so option chips like "Browse Cloud Library" are not
 * misread as flex layout (e.g. "beside").
 *
 * @param {string} rawMessage Raw user message.
 * @returns {{ type: 'open_cloud_library', params: { rawMessage: string } }|null}
 */
const routeOpenCloudLibrary = rawMessage => {
	const lower = rawMessage.toLowerCase();

	const intents = [
		/\bopen\s+(the\s+)?(maxi\s+)?cloud\s*(library)?\b/,
		/\b(show|launch|display|bring\s+up)\s+(the\s+)?(maxi\s+)?cloud\s*(library)?\b/,
		/\b(browse|search|explore)\s+(the\s+)?(maxi\s+)?cloud\s*(library)?\b/,
		/\bcloud\s+library\b.*\b(open|browse|search|show)\b/,
		/\b(open|browse|search|show)\b.*\bcloud\s+library\b/,
		/\bbrowse\s+cloud\s+library\b/,
		/\bmaxi\s*blocks\s+cloud\b.*\b(open|browse|search)\b/,
		/\b(search|browse|add)\b[\s\S]{0,80}\b(patterns?|pages?)\b[\s\S]{0,50}\b(from\s+)?(the\s+)?cloud\b/,
		/\bimport\b[\s\S]{0,120}\bfrom\s+the\s+cloud\b/,
		/\b(import|get)\b[\s\S]{0,80}\b(patterns?|pages?|templates?)\b[\s\S]{0,60}\b(from\s+)?(the\s+)?cloud\b/,
		/\bfrom\s+the\s+cloud\b[\s\S]{0,40}\b(manually|myself|in\s+the\s+library|picker|ui)\b/,
		// Import / insert without saying "cloud" (e.g. "import an Accountant page") — article avoids "insert into page".
		/\b(import|insert|get)\s+(a\s+|an\s+|the\s+)[\s\S]{0,120}\b(page|pages|pattern|patterns)\b/i,
		// "Add a hero pattern" — patterns only (avoid "add a page" → site editor ambiguity).
		/\badd\s+(a\s+|an\s+|the\s+)?[\s\S]{0,100}\b(pattern|patterns)\b/i,
	];

	if ( intents.some( re => re.test( lower ) ) ) {
		return {
			type: 'open_cloud_library',
			params: { rawMessage },
		};
	}

	return null;
};

/**
 * Extracts a card name from an SC management phrase, stripping leading articles.
 *
 * @param {string} raw Captured group text.
 * @returns {string}
 */
const extractSCName = raw => {
	return String( raw || '' )
		.trim()
		.replace( /^(a|an|the)\s+/i, '' )
		.trim();
};

/**
 * Local Style Card management: activate, reset, delete, edit, current.
 * Checked before routeCloudSC so "activate X" never falls into the cloud-browser route.
 *
 * @param {string} rawMessage
 * @returns {{ type: 'sc_action', params: Object }|null}
 */
const routeSCAction = rawMessage => {
	// Reset
	if (
		/\breset\b[^.!?]{0,80}\b(?:style[\s-]*cards?|SCs?)\b/i.test( rawMessage ) ||
		/\b(?:style[\s-]*cards?|SCs?)\b[^.!?]{0,80}\breset\b/i.test( rawMessage )
	) {
		return { type: 'sc_action', params: { action: 'reset', rawMessage } };
	}

	// What / which SC is active / current
	if (
		/\b(?:what|which)\b[^.!?]{0,60}\b(?:style[\s-]*card|SC)\b/i.test( rawMessage ) ||
		/\b(?:current|active|applied)\b[^.!?]{0,50}\b(?:style[\s-]*card|SC)\b/i.test( rawMessage ) ||
		/\b(?:style[\s-]*card|SC)\b[^.!?]{0,50}\b(?:is\s+)?(?:active|current|applied|in\s+use)\b/i.test( rawMessage )
	) {
		return { type: 'sc_action', params: { action: 'current', rawMessage } };
	}

	// Delete / remove by name
	const deleteMatch = rawMessage.match(
		/\b(?:delete|remove)\s+(?:the\s+)?(.+?)\s+(?:style[\s-]*card|SC)\b/i
	);
	if ( deleteMatch?.[ 1 ] ) {
		const name = extractSCName( deleteMatch[ 1 ] );
		if ( name ) {
			return { type: 'sc_action', params: { action: 'delete', name, rawMessage } };
		}
	}

	// Activate / switch to by name — requires SC noun to avoid false positives
	const activateMatch = rawMessage.match(
		/\b(?:activate|switch\s+to)\s+(?:the\s+)?(.+?)\s+(?:style[\s-]*card|SC)\b/i
	);
	if ( activateMatch?.[ 1 ] ) {
		const name = extractSCName( activateMatch[ 1 ] );
		if ( name ) {
			return { type: 'sc_action', params: { action: 'activate', name, rawMessage } };
		}
	}

	// Edit / customize named SC
	const editMatch = rawMessage.match(
		/\b(?:edit|customize|modify)\s+(?:the\s+)?(.+?)\s+(?:style[\s-]*card|SC)\b/i
	);
	if ( editMatch?.[ 1 ] ) {
		const name = extractSCName( editMatch[ 1 ] );
		if ( name ) {
			return { type: 'sc_action', params: { action: 'edit', name, rawMessage } };
		}
	}

	// Open SC editor (no specific card)
	if ( /\b(?:open|edit)\b[^.!?]{0,40}\b(?:style[\s-]*cards?\s+editor|SC\s+editor)\b/i.test( rawMessage ) ) {
		return { type: 'sc_action', params: { action: 'edit', name: '', rawMessage } };
	}

	return null;
};

/**
 * User wants to browse the Style Cards cloud library.
 * Requires an explicit cloud/library/import signal so it doesn't fire for
 * local SC browsing ("browse my style cards", "show style cards").
 *
 * @param {string} rawMessage Raw user message.
 * @returns {import('./types').BrowseCloudSCResult|null}
 */
const routeCloudSC = rawMessage => {
	const INTENTS = [
		// "style cards" / "SC/SCs" + cloud/library/import signal
		/\b(?:style[\s-]*cards?|SCs?)\b[^.!?]{0,50}\b(?:cloud|library|online|download)\b/i,
		/\b(?:cloud|library)\b[^.!?]{0,50}\b(?:style[\s-]*cards?|SCs?)\b/i,
		/\b(?:style[\s-]*cards?|SCs?)\s+from\s+(?:the\s+)?(?:cloud|library|online)\b/i,
		/\bget\b[^.!?]{0,30}\b(?:style[\s-]*card|SC)\b[^.!?]{0,30}\b(?:cloud|library)\b/i,
		// show/list/browse verbs — "show me the list of style cards", "list all SCs"
		/\b(?:show|list|see|browse|open|display)\b[^.!?]{0,80}\b(?:style[\s-]*cards?|SCs?)\b/i,
		// import/action verb + [words] + "style card/SC" — covers title-based requests
		// like "import the Optimus style card" as well as plain "import a style card".
		/\b(?:import|input|get|use|apply|load|preview)\b[^.!?]{0,80}\b(?:style[\s-]*card|SC)\b/i,
	];

	if ( ! INTENTS.some( re => re.test( rawMessage ) ) ) return null;

	const lower = rawMessage.toLowerCase();
	const queryMatch = lower.match(
		/\b(dark|light|minimal(?:ist)?|bold|elegant|modern|classic|professional|creative|colorful|warm|cool|earthy|bright|pastel|luxury|vintage|corporate|playful|artistic)\b/
	);
	// Extract a color category (matches sc_color facet values in the Typesense index).
	const categoryMatch = rawMessage.match(
		/\b(red|blue|green|yellow|purple|orange|pink|black|white|grey|gray|brown|gold|silver|teal|navy|violet|indigo|magenta|cyan|aqua|peach|turquoise)\b/i
	);

	// Extract a card title: the word(s) between the action verb+article and "style card/SC".
	// Only used as query when no color category was found (colors are handled by the facet filter).
	let titleQuery = '';
	if ( ! categoryMatch ) {
		const titleMatch = rawMessage.match(
			/\b(?:import|input|get|use|apply|load|preview)\s+(?:a\s+|an\s+|the\s+)?([\w]+(?:\s+[\w]+){0,3}?)\s+(?:style[\s-]*card|SC)\b/i
		);
		if ( titleMatch?.[ 1 ] ) {
			titleQuery = titleMatch[ 1 ].trim();
		}
	}

	const importFirst = /\b(import|input|get|use|apply|load|preview)\b/i.test( rawMessage );
	// showLocalOnly: user wants to see saved/local style cards, not the cloud library.
	const showLocalOnly =
		! importFirst &&
		/\b(?:show|list|see|display)\b/i.test( rawMessage );

	return {
		type: 'browse_cloud_sc',
		params: {
			query: titleQuery || queryMatch?.[ 1 ] || '',
			category: categoryMatch?.[ 1 ]
				? categoryMatch[ 1 ].charAt( 0 ).toUpperCase() +
				  categoryMatch[ 1 ].slice( 1 ).toLowerCase()
				: '',
			importFirst,
			showLocalOnly,
			rawMessage,
		},
	};
};

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Run the full client-side routing cascade for a user message.
 *
 * @param {string}                          rawMessage  Raw user input.
 * @param {import('./types').RoutingContext} ctx         Context built by buildRoutingContext().
 * @param {Function|null}                   [selectFn]  WordPress `select` function (optional).
 * @returns {Promise<import('./types').RouteResult>}
 */
export const routeClientSide = async ( rawMessage, ctx, selectFn = null ) => {
	// 0. Style Card routes — must run before attribute groups, which false-positive
	//    on words like "show", "list", "display" when a block is selected.
	if ( /\b(?:style[\s-]*cards?|SCs?)\b/i.test( rawMessage ) ) {
		const earlyScAction = routeSCAction( rawMessage );
		if ( earlyScAction ) return earlyScAction;

		const earlyCloudSC = routeCloudSC( rawMessage );
		if ( earlyCloudSC ) return earlyCloudSC;
	}

	// 1. Text link
	const textLinkResult = routeTextLink( rawMessage, ctx );
	if ( textLinkResult ) return textLinkResult;

	// 2. Attribute groups
	const groupResult = routeAttributeGroups( rawMessage, ctx );
	if ( groupResult ) return groupResult;

	// 3. Numeric patterns
	const numericResult = routeNumericPatterns( rawMessage, ctx );
	if ( numericResult ) return numericResult;

	// 4. Direct removals + alignment clarifications
	const removalResult = routeDirectRemovals( rawMessage, ctx );
	if ( removalResult ) return removalResult;

	// 5. Hex colour
	const hexResult = routeHexColor( rawMessage, ctx );
	if ( hexResult ) return hexResult;

	// 6. Shape divider
	const shapeDividerResult = routeShapeDivider( ctx );
	if ( shapeDividerResult ) return shapeDividerResult;

	// 6b. Local Style Card management (activate, reset, delete, edit, current)
	const scActionResult = routeSCAction( rawMessage );
	if ( scActionResult ) return scActionResult;

	// 6c. Style Cards cloud library browser
	const cloudSCResult = routeCloudSC( rawMessage );
	if ( cloudSCResult ) return cloudSCResult;

	// 6c. Cloud Library (browse/search/insert UI — patterns/pages)
	const openCloudResult = routeOpenCloudLibrary( rawMessage );
	if ( openCloudResult ) return openCloudResult;

	// 7. Layout patterns
	const layoutResult = routeLayoutPatterns( rawMessage, ctx, selectFn );
	if ( layoutResult ) return layoutResult;

	// 8. Gap
	const gapResult = routeGap( rawMessage, ctx );
	if ( gapResult ) return gapResult;

	// 9. Passthrough — let the AI API handle it
	return { type: 'passthrough' };
};

export default routeClientSide;
