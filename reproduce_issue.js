
const LAYOUT_PATTERNS = [
	// EMERGENCY PRIORITY RULE
	{ regex: /change.*button.*text.*colou?r|button.*text.*colou?r/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?', target: 'button', colorTarget: 'button-text' },

	// GROUP 1: DIRECTIONAL INTENT (flex-direction)
	{ regex: /side\s*by\s*side|horizontal(?!ly)|in\s*a\s*line|beside\s*(each\s*other)?|next\s*to\s*(each\s*other)?/, property: 'flex_direction', value: 'row', selectionMsg: 'Arranged items side by side (row layout).', pageMsg: 'Arranged containers horizontally.' },
	{ regex: /stack(ed)?|vertical(?!ly)|one\s*on\s*top|underneath|on\s*top\s*of|column\s*layout/, property: 'flex_direction', value: 'column', selectionMsg: 'Stacked items vertically (column layout).', pageMsg: 'Arranged containers in a stack.' },
	{ regex: /backwards?|right\s*to\s*left|reverse.*horizontal|flip.*order/, property: 'flex_direction', value: 'row-reverse', selectionMsg: 'Reversed horizontal order (row-reverse).', pageMsg: 'Reversed horizontal order.' },
	{ regex: /bottom\s*up|reverse.*vertical|reverse.*stack|upwards?\s*stack/, property: 'flex_direction', value: 'column-reverse', selectionMsg: 'Reversed vertical order (column-reverse).', pageMsg: 'Reversed vertical order.' },
	
	// GROUP 2: JUSTIFY CONTENT (main axis distribution)
	{ regex: /spread.*wall|space\s*between|first.*last.*edge|push.*apart|stretch.*apart/, property: 'justify_content', value: 'space-between', selectionMsg: 'Spread items to edges (space-between).', pageMsg: 'Applied space-between layout.' },
	{ regex: /breathing\s*room|balanced\s*spac|space\s*around|equal\s*margin/, property: 'justify_content', value: 'space-around', selectionMsg: 'Added balanced spacing (space-around).', pageMsg: 'Applied balanced spacing.' },
	{ regex: /equal\s*gap|evenly\s*spac|space\s*evenly|perfectly\s*even/, property: 'justify_content', value: 'space-evenly', selectionMsg: 'Applied even spacing (space-evenly).', pageMsg: 'Applied evenly distributed spacing.' },
	{ regex: /push.*start|bunch.*start|items?.*left(?!.*text)|align.*items?.*left/, property: 'justify_content', value: 'flex-start', selectionMsg: 'Pushed items to start (flex-start).', pageMsg: 'Aligned items to start.' },
	{ regex: /push.*end|bunch.*end|items?.*right(?!.*text)|align.*items?.*right/, property: 'justify_content', value: 'flex-end', selectionMsg: 'Pushed items to end (flex-end).', pageMsg: 'Aligned items to end.' },
	{ regex: /center.*items?|items?.*center(?!.*text)|centre.*items?|items?.*centre/, property: 'justify_content', value: 'center', selectionMsg: 'Centred items on main axis (justify-content: center).', pageMsg: 'Centred items horizontally.' },
	
	// GROUP 3: ALIGN ITEMS (cross-axis)
	{ regex: /top\s*align|ceiling|push.*top|align.*top(?!.*text)/, property: 'align_items_flex', value: 'flex-start', selectionMsg: 'Aligned items to top (align-items: flex-start).', pageMsg: 'Top-aligned items.' },
	{ regex: /bottom\s*align|floor|push.*bottom|align.*bottom(?!.*text)/, property: 'align_items_flex', value: 'flex-end', selectionMsg: 'Aligned items to bottom (align-items: flex-end).', pageMsg: 'Bottom-aligned items.' },
	{ regex: /middle\s*align|center.*vertically|centre.*vertically|vertical.*center|vertical.*centre/, property: 'align_items_flex', value: 'center', selectionMsg: 'Vertically centred items (align-items: center).', pageMsg: 'Vertically centred items.' },
	{ regex: /same\s*height|stretch|equal\s*height|fill.*height|full.*height/, property: 'align_items_flex', value: 'stretch', selectionMsg: 'Stretched items to same height (align-items: stretch).', pageMsg: 'Stretched items to equal height.' },
	{ regex: /baseline|line\s*up.*text|align.*first\s*word/, property: 'align_items_flex', value: 'baseline', selectionMsg: 'Aligned items by text baseline.', pageMsg: 'Baseline-aligned items.' },
	
	// GROUP 4: FLEX WRAP
	{ regex: /let.*wrap|allow.*wrap|multi-?line|next\s*line|new\s*line|overflow.*wrap/, property: 'flex_wrap', value: 'wrap', selectionMsg: 'Enabled wrapping to new lines (flex-wrap: wrap).', pageMsg: 'Enabled multi-line wrapping.' },
	{ regex: /one\s*line|single\s*line|no\s*wrap|don'?t\s*wrap|force.*together/, property: 'flex_wrap', value: 'nowrap', selectionMsg: 'Forced items to single line (flex-wrap: nowrap).', pageMsg: 'Disabled wrapping.' },
	{ regex: /wrap.*upward|wrap.*reverse|reverse.*wrap/, property: 'flex_wrap', value: 'wrap-reverse', selectionMsg: 'Enabled reverse wrapping (flex-wrap: wrap-reverse).', pageMsg: 'Enabled reverse wrapping.' },
	
	// GROUP 5: EXTENDED - DEAD CENTER & FLEX SIZING
	{ regex: /dead\s*cent(er|re)|perfect(ly)?\s*cent(er|re)(ed)?|absolute(ly)?\s*cent(er|re)/, property: 'dead_center', value: true, selectionMsg: 'Perfectly centred items (horizontally + vertically).', pageMsg: 'Dead-centred all containers.' },
	{ regex: /fill.*remaining|fill.*rest|take.*rest|expand.*fill|grow.*space|use.*remaining/, property: 'flex_grow', value: 1, selectionMsg: 'Set to fill remaining space (flex-grow: 1).', pageMsg: 'Set containers to fill remaining space.' },
	{ regex: /don'?t\s*shrink|no\s*shrink|keep.*fixed|fixed\s*size|prevent.*shrink/, property: 'flex_shrink', value: 0, selectionMsg: 'Prevented shrinking (flex-shrink: 0).', pageMsg: 'Prevented containers from shrinking.' },
	
	// GROUP 6: STACKING & POSITION
	{ regex: /bring.*front|put.*top|on\s*top|overlap|layer.*top|above.*other/, property: 'stacking', value: { zIndex: 10, position: 'relative' }, selectionMsg: 'Brought to front (z-index: 10).', pageMsg: 'Brought containers to front.' },
	{ regex: /send.*back|put.*behind|behind.*everything|layer.*back|below.*other/, property: 'stacking', value: { zIndex: -1, position: 'relative' }, selectionMsg: 'Sent to back (z-index: -1).', pageMsg: 'Sent containers to back.' },
	{ regex: /make.*sticky|sticky|follow.*scroll|stay.*scroll|stick.*top/, property: 'position', value: 'sticky', selectionMsg: 'Made sticky (follows scroll).', pageMsg: 'Made containers sticky.' },
	{ regex: /float.*corner|fixed\s*position|stay.*corner|pin.*corner|always\s*visible/, property: 'position', value: 'fixed', selectionMsg: 'Fixed to viewport (always visible).', pageMsg: 'Fixed containers to viewport.' },
	
	// GROUP 7: VISIBILITY
	{ regex: /hide\s*(this|it)?(?!.*mobile)|make.*invisible|disappear|display.*none|remove.*view/, property: 'display', value: 'none', selectionMsg: 'Hidden from view (display: none).', pageMsg: 'Hidden containers.' },
	{ regex: /show\s*(this|it)?(?!.*mobile)|make.*visible|appear|unhide|display.*block/, property: 'display', value: 'flex', selectionMsg: 'Made visible (display: flex).', pageMsg: 'Made containers visible.' },
	
	// GROUP 8: GAP CONTROL (special handling - remove only, add has clarification)
	{ regex: /remove\s*gap|no\s*gap|zero\s*gap|remove\s*gutter/, property: 'gap', value: 0, selectionMsg: 'Removed gaps between items.', pageMsg: 'Removed gaps from containers.' },
	
	// GROUP 9: OPACITY & TRANSPARENCY
	{ regex: /see.*through|transparent|ghostly|translucent|opacity.*half|semi.*transparent/, property: 'opacity', value: 0.5, selectionMsg: 'Made semi-transparent (opacity: 0.5).', pageMsg: 'Made containers semi-transparent.' },
	{ regex: /fade.*out.*complete|fully.*transparent|invisible|opacity.*zero|completely.*transparent/, property: 'opacity', value: 0, selectionMsg: 'Made fully transparent (opacity: 0).', pageMsg: 'Made containers invisible.' },
	{ regex: /fully.*opaque|solid|not.*transparent|opacity.*full|remove.*transparency/, property: 'opacity', value: 1, selectionMsg: 'Made fully opaque (opacity: 1).', pageMsg: 'Restored full opacity.' },
	
	// GROUP 10: TRANSFORM EFFECTS
	{ regex: /tilt|askew|skew|slant/, property: 'transform_rotate', value: 5, selectionMsg: 'Tilted element (rotate: 5deg).', pageMsg: 'Tilted containers.' },
	{ regex: /rotate|spin|turn.*degrees/, property: 'transform_rotate', value: 45, selectionMsg: 'Rotated element (45deg).', pageMsg: 'Rotated containers.' },
	{ regex: /flip.*horizontal|mirror/, property: 'transform_scale', value: { x: -1, y: 1 }, selectionMsg: 'Flipped horizontally.', pageMsg: 'Flipped containers horizontally.' },
	{ regex: /flip.*vertical|upside.*down/, property: 'transform_scale', value: { x: 1, y: -1 }, selectionMsg: 'Flipped vertically.', pageMsg: 'Flipped containers vertically.' },
	{ regex: /zoom.*hover|bigger.*hover|enlarge.*hover|scale.*hover|grow.*hover/, property: 'transform_scale_hover', value: 1.1, selectionMsg: 'Added zoom on hover (scale: 1.1).', pageMsg: 'Added hover zoom effect.' },
	
	// GROUP 11: SCROLL EFFECTS
	{ regex: /fade.*scroll|scroll.*fade|entrance.*fade|fade.*in.*scroll/, property: 'scroll_fade', value: true, selectionMsg: 'Added scroll fade-in effect.', pageMsg: 'Added scroll fade to containers.' },
	{ regex: /parallax|slow.*background|background.*slower/, property: 'parallax', value: true, selectionMsg: 'Added parallax effect.', pageMsg: 'Added parallax to backgrounds.' },
	
	// GROUP 12: AESTHETIC STYLES (triggers apply_theme via special handling)
	{ regex: /minimalis(m|t)|clean.*look|simple.*design|white.*space/, property: 'aesthetic', value: 'minimalism', selectionMsg: 'Applied minimalist style.', pageMsg: 'Applied minimalist aesthetic.' },
	{ regex: /brutalis(m|t)|raw.*html|harsh|industrial/, property: 'aesthetic', value: 'brutalism', selectionMsg: 'Applied brutalist style.', pageMsg: 'Applied brutalist aesthetic.' },
	{ regex: /neobrutalis(m|t)|thick.*border.*pastel|block.*shadow|modern.*figma/, property: 'aesthetic', value: 'neobrutalism', selectionMsg: 'Applied neobrutalist style.', pageMsg: 'Applied neobrutalist aesthetic.' },
	{ regex: /swiss|helvetica|grid.*layout|typograph/, property: 'aesthetic', value: 'swiss', selectionMsg: 'Applied Swiss style.', pageMsg: 'Applied Swiss typography aesthetic.' },
	{ regex: /editorial|magazine|newspaper|pull.*quote/, property: 'aesthetic', value: 'editorial', selectionMsg: 'Applied editorial style.', pageMsg: 'Applied editorial layout.' },
	{ regex: /masculine|bold.*dark|strong.*geometric/, property: 'aesthetic', value: 'masculine', selectionMsg: 'Applied masculine style.', pageMsg: 'Applied masculine aesthetic.' },
	{ regex: /feminine|soft.*pastel|delicate|script.*font/, property: 'aesthetic', value: 'feminine', selectionMsg: 'Applied feminine style.', pageMsg: 'Applied feminine aesthetic.' },
	{ regex: /corporate|professional|business|navy.*slate/, property: 'aesthetic', value: 'corporate', selectionMsg: 'Applied corporate style.', pageMsg: 'Applied corporate aesthetic.' },
	{ regex: /natural|organic|earth.*tone|terracotta|sage/, property: 'aesthetic', value: 'natural', selectionMsg: 'Applied natural style.', pageMsg: 'Applied natural/organic aesthetic.' },
	
	// GROUP 13: TYPOGRAPHY READABILITY
	{ regex: /lines.*crash|wall.*text|too.*close.*lines|line.*height|more.*space.*lines/, property: 'line_height', value: 1.8, selectionMsg: 'Increased line spacing (line-height: 1.8).', pageMsg: 'Improved line spacing for readability.' },
	{ regex: /tight.*lines|condense.*lines|less.*space.*lines/, property: 'line_height', value: 1.2, selectionMsg: 'Tightened line spacing (line-height: 1.2).', pageMsg: 'Reduced line spacing.' },
	{ regex: /letters.*squish|too.*tight.*letter|letter.*spac|track/, property: 'letter_spacing', value: 1, selectionMsg: 'Increased letter spacing.', pageMsg: 'Added letter spacing.' },
	{ regex: /chunk|heavy|bold|thicker.*text|fatter.*text|font.*weight/, property: 'font_weight', value: 700, selectionMsg: 'Made text bolder (font-weight: 700).', pageMsg: 'Applied bold weight.' },
	{ regex: /thin.*text|light.*weight|lighter.*text/, property: 'font_weight', value: 300, selectionMsg: 'Made text lighter (font-weight: 300).', pageMsg: 'Applied light weight.' },
	{ regex: /remove.*underline|no.*underline|plain.*link/, property: 'text_decoration', value: 'none', selectionMsg: 'Removed underline.', pageMsg: 'Removed underlines from links.' },
	{ regex: /add.*underline|underline.*text/, property: 'text_decoration', value: 'underline', selectionMsg: 'Added underline.', pageMsg: 'Underlined text.' },
	
	// GROUP: COLOUR CLARIFICATION (show palette picker)
	// Match colour requests that need clarification - will show 8-colour palette
	{ regex: /(make|change|set|turn|paint|color|colour|give).*(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)|(\bred|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey)\b.*(background|button|text|heading|container|box|section|color|colour)/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?' },
	
	// GROUP 14: BACKGROUNDS & MEDIA
	{ regex: /video.*behind|movie.*behind|background.*video/, property: 'background_media', value: 'video', selectionMsg: 'Set video as background.', pageMsg: 'Applied video background.' },
	{ regex: /darken.*screen|overlay|dim.*background|dark.*overlay/, property: 'background_overlay', value: 0.5, selectionMsg: 'Added dark overlay (50%).', pageMsg: 'Darkened background with overlay.' },
	{ regex: /zoom.*photo|fill.*container|cover.*image|fit.*cover/, property: 'object_fit', value: 'cover', selectionMsg: 'Set image to cover container.', pageMsg: 'Applied cover fit to images.' },
	{ regex: /contain.*image|show.*whole|fit.*contain/, property: 'object_fit', value: 'contain', selectionMsg: 'Set image to contain.', pageMsg: 'Applied contain fit to images.' },
	{ regex: /pattern.*texture|tile.*background|repeat.*background|honeycomb/, property: 'background_tile', value: true, selectionMsg: 'Added tiled pattern.', pageMsg: 'Applied repeating pattern.' },
	
	// GROUP 15: SHAPES & DIVIDERS
	{ regex: /wavy.*edge|wave.*bottom|wave.*divider/, property: 'shape_divider', value: 'wave', selectionMsg: 'Added wave shape divider.', pageMsg: 'Applied wave divider.' },
	{ regex: /triangle.*edge|angle.*divider|slant.*edge/, property: 'shape_divider', value: 'triangle', selectionMsg: 'Added triangle shape divider.', pageMsg: 'Applied angled divider.' },
	{ regex: /cut.*triangle|triangle.*shape|clip.*triangle/, property: 'clip_path', value: 'polygon(50% 0%, 0% 100%, 100% 100%)', selectionMsg: 'Cut into triangle shape.', pageMsg: 'Applied triangle clip.' },
	{ regex: /cut.*circle|circle.*shape|round.*clip/, property: 'clip_path', value: 'circle(50%)', selectionMsg: 'Cut into circle shape.', pageMsg: 'Applied circle clip.' },
	{ regex: /cut.*diamond|diamond.*shape/, property: 'clip_path', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', selectionMsg: 'Cut into diamond shape.', pageMsg: 'Applied diamond clip.' },
	
	// GROUP 16: CONSTRAINTS & SIZING
	{ regex: /don'?t.*too.*wide|max.*width|limit.*width|constrain.*width/, property: 'max_width', value: 'fit-content', selectionMsg: 'Constrained max width.', pageMsg: 'Limited maximum width.' },
	{ regex: /full.*width|stretch.*wide|100.*width/, property: 'full_width', value: true, selectionMsg: 'Set to full width.', pageMsg: 'Made containers full width.' },
	{ regex: /minimum.*height|at.*least.*tall|min.*height/, property: 'min_height', value: 400, selectionMsg: 'Set minimum height.', pageMsg: 'Applied minimum height.' },
	
	// GROUP 17: ROW PATTERNS
	{ regex: /zig.*zag|alternate|stagger|every.*other/, property: 'row_pattern', value: 'alternating', selectionMsg: 'Applied alternating row pattern.', pageMsg: 'Created zig-zag layout.' },
	{ regex: /masonry|pinterest|grid.*flow/, property: 'row_pattern', value: 'masonry', selectionMsg: 'Applied masonry layout.', pageMsg: 'Created masonry grid.' },
	
	// GROUP 18: RELATIVE SIZING (±20% adjustment)
	{ regex: /bigger(?!.*hover)|larger|increase.*size|more.*size|scale.*up/, property: 'relative_size', value: 1.2, selectionMsg: 'Increased size by 20%.', pageMsg: 'Scaled up by 20%.' },
	{ regex: /smaller|reduce.*size|decrease.*size|less.*size|scale.*down/, property: 'relative_size', value: 0.8, selectionMsg: 'Decreased size by 20%.', pageMsg: 'Scaled down by 20%.' },
	{ regex: /bigger.*text|larger.*text|increase.*font|larger.*font/, property: 'font_size_relative', value: 1.2, selectionMsg: 'Increased font size by 20%.', pageMsg: 'Enlarged text.' },
	{ regex: /smaller.*text|reduce.*text|decrease.*font|tinier/, property: 'font_size_relative', value: 0.8, selectionMsg: 'Decreased font size by 20%.', pageMsg: 'Reduced text size.' },
	{ regex: /wider|more.*width|increase.*width|stretch.*horizontal/, property: 'width_relative', value: 1.2, selectionMsg: 'Increased width by 20%.', pageMsg: 'Made wider.' },
	{ regex: /narrower|less.*width|decrease.*width|thinner/, property: 'width_relative', value: 0.8, selectionMsg: 'Decreased width by 20%.', pageMsg: 'Made narrower.' },
	{ regex: /taller|more.*height|increase.*height|stretch.*vertical/, property: 'height_relative', value: 1.2, selectionMsg: 'Increased height by 20%.', pageMsg: 'Made taller.' },
	{ regex: /shorter|less.*height|decrease.*height|squash/, property: 'height_relative', value: 0.8, selectionMsg: 'Decreased height by 20%.', pageMsg: 'Made shorter.' },
	
	// GROUP 19: DIRECTIONAL MARGIN
	{ regex: /push.*down|more.*space.*above|margin.*top|space.*above/, property: 'margin_top', value: 40, selectionMsg: 'Added top margin (40px).', pageMsg: 'Added space above.' },
	{ regex: /push.*up|more.*space.*below|margin.*bottom|space.*below|space.*under/, property: 'margin_bottom', value: 40, selectionMsg: 'Added bottom margin (40px).', pageMsg: 'Added space below.' },
	{ regex: /push.*right|more.*space.*left|margin.*left|space.*left/, property: 'margin_left', value: 40, selectionMsg: 'Added left margin (40px).', pageMsg: 'Added space on left.' },
	{ regex: /push.*left|more.*space.*right|margin.*right|space.*right/, property: 'margin_right', value: 40, selectionMsg: 'Added right margin (40px).', pageMsg: 'Added space on right.' },
	
	// GROUP 20: DIRECTIONAL PADDING
	{ regex: /cushion.*top|pad.*top|padding.*top|inside.*top/, property: 'padding_top', value: 30, selectionMsg: 'Added top padding (30px).', pageMsg: 'Added internal space at top.' },
	{ regex: /cushion.*bottom|pad.*bottom|padding.*bottom|inside.*bottom/, property: 'padding_bottom', value: 30, selectionMsg: 'Added bottom padding (30px).', pageMsg: 'Added internal space at bottom.' },
	{ regex: /cushion.*left|pad.*left|padding.*left|inside.*left/, property: 'padding_left', value: 30, selectionMsg: 'Added left padding (30px).', pageMsg: 'Added internal space on left.' },
	{ regex: /cushion.*right|pad.*right|padding.*right|inside.*right/, property: 'padding_right', value: 30, selectionMsg: 'Added right padding (30px).', pageMsg: 'Added internal space on right.' },
	
	// GROUP 21: RESPONSIVE OVERRIDES
	{ regex: /hide.*mobile|mobile.*hide|don'?t.*show.*mobile|invisible.*mobile/, property: 'display_mobile', value: 'none', selectionMsg: 'Hidden on mobile devices.', pageMsg: 'Hidden on mobile.' },
	{ regex: /hide.*desktop|desktop.*hide|mobile.*only/, property: 'display_desktop', value: 'none', selectionMsg: 'Hidden on desktop (mobile only).', pageMsg: 'Showing only on mobile.' },
	{ regex: /hide.*tablet|tablet.*hide/, property: 'display_tablet', value: 'none', selectionMsg: 'Hidden on tablet.', pageMsg: 'Hidden on tablets.' },
	{ regex: /show.*mobile.*only|mobile.*version/, property: 'show_mobile_only', value: true, selectionMsg: 'Showing on mobile only.', pageMsg: 'Visible only on mobile.' },
	
	// GROUP 22: HOVER STATE PATTERNS
	{ regex: /change.*hover|hover.*change|when.*hover/, property: 'hover_effect', value: 'transform', selectionMsg: 'Added hover effect.', pageMsg: 'Applied hover transformation.' },
	{ regex: /lift.*hover|raise.*hover|elevate.*hover/, property: 'hover_lift', value: true, selectionMsg: 'Added lift on hover.', pageMsg: 'Elements lift on hover.' },
	{ regex: /glow.*hover|shine.*hover/, property: 'hover_glow', value: true, selectionMsg: 'Added glow on hover.', pageMsg: 'Elements glow on hover.' },
	{ regex: /darken.*hover|dim.*hover/, property: 'hover_darken', value: true, selectionMsg: 'Added darken on hover.', pageMsg: 'Elements darken on hover.' },
	{ regex: /lighten.*hover|brighten.*hover/, property: 'hover_lighten', value: true, selectionMsg: 'Added lighten on hover.', pageMsg: 'Elements brighten on hover.' },
	
	// GROUP 23: UNIVERSAL ALIGNMENT (text + items together)
	{ regex: /align.*everything.*left|everything.*left.*align|left.*align.*all|flush.*left/, property: 'align_everything', value: 'left', selectionMsg: 'Left-aligned all content.', pageMsg: 'Left-aligned everything.' },
	{ regex: /align.*everything.*center|everything.*center|center.*align.*all|centre.*everything/, property: 'align_everything', value: 'center', selectionMsg: 'Centred all content.', pageMsg: 'Centred everything.' },
	{ regex: /align.*everything.*right|everything.*right.*align|right.*align.*all|flush.*right/, property: 'align_everything', value: 'right', selectionMsg: 'Right-aligned all content.', pageMsg: 'Right-aligned everything.' },
	
	// GROUP 24: BUTTON ACTIONS
	{ regex: /outline.*button|ghost.*button|transparent.*button/, property: 'button_style', value: 'outline', selectionMsg: 'Applied outline style to buttons.', pageMsg: 'Changed all buttons to outline style.', target: 'button' },
	{ regex: /solid.*button|filled.*button|fill.*button/, property: 'button_style', value: 'solid', selectionMsg: 'Applied solid style to buttons.', pageMsg: 'Changed all buttons to solid style.', target: 'button' },
	{ regex: /flat.*button|no.*shadow.*button/, property: 'button_style', value: 'flat', selectionMsg: 'Applied flat style (no shadow) to buttons.', pageMsg: 'Removed shadows from buttons.', target: 'button' },
	{ regex: /pill.*button|capsule.*button|rounded.*button/, property: 'border_radius', value: 50, selectionMsg: 'Applied pill shape to buttons.', pageMsg: 'Changed buttons to pill shape.', target: 'button' },
	{ regex: /full.*width.*button|stretch.*button|expand.*button/, property: 'width', value: '100%', selectionMsg: 'Made buttons full width.', pageMsg: 'Expanded buttons to full width.', target: 'button' },
	{ regex: /auto.*width.*button|fit.*content.*button|shrink.*button/, property: 'width', value: 'auto', selectionMsg: 'Set buttons to auto width.', pageMsg: 'Set buttons to fit content.', target: 'button' },
	{ regex: /icon.*only.*button|remove.*text.*button|hide.*text.*button/, property: 'button_icon', value: 'only', selectionMsg: 'Made buttons icon-only.', pageMsg: 'Changed buttons to icon-only.', target: 'button' },
	{ regex: /remove.*icon.*button|no.*icon.*button|hide.*icon.*button|text.*only.*button/, property: 'button_icon', value: 'none', selectionMsg: 'Removed icons from buttons.', pageMsg: 'Removed icons from all buttons.', target: 'button' },
	{ regex: /small.*button|tiny.*button|compact.*button/, property: 'button_size', value: 'small', selectionMsg: 'Made buttons smaller.', pageMsg: 'Reduced button size.', target: 'button' },
	{ regex: /large.*button|big.*button|huge.*button|giant.*button/, property: 'button_size', value: 'large', selectionMsg: 'Made buttons larger.', pageMsg: 'Increased button size.', target: 'button' },



	// GROUP 24b: BUTTON ICONS (NEW)
	{ regex: /add.*icon.*button|put.*icon/, property: 'button_icon_add', value: 'arrow-right', selectionMsg: 'Added icon to button.', pageMsg: 'Added icons to buttons.', target: 'button' },
	{ regex: /icon.*top|icon.*above/, property: 'icon_position', value: 'top', selectionMsg: 'Moved icon to top.', pageMsg: 'Moved icons to top.', target: 'button' },
	{ regex: /icon.*left|icon.*before/, property: 'icon_position', value: 'left', selectionMsg: 'Moved icon to left.', pageMsg: 'Moved icons to left.', target: 'button' },
	{ regex: /icon.*right|icon.*after/, property: 'icon_position', value: 'right', selectionMsg: 'Moved icon to right.', pageMsg: 'Moved icons to right.', target: 'button' },
	{ regex: /icon.*size.*24|24px.*icon|icon.*bigger/, property: 'icon_size', value: 24, selectionMsg: 'Set icon size to 24px.', pageMsg: 'Set icon size to 24px.', target: 'button' },
	{ regex: /cart.*icon|shopping.*icon/, property: 'button_icon_change', value: 'shopping-cart', selectionMsg: 'Changed icon to shopping cart.', pageMsg: 'Changed icons to shopping cart.', target: 'button' },
	{ regex: /space.*icon.*text|gap.*icon/, property: 'icon_spacing', value: 10, selectionMsg: 'Increased icon spacing.', pageMsg: 'Increased icon spacing.', target: 'button' },
	{ regex: /white.*icon/, property: 'icon_color', value: '#ffffff', selectionMsg: 'Made icon white.', pageMsg: 'Made icons white.', target: 'button' },
	{ regex: /circle.*icon|round.*icon|icon.*radius/, property: 'icon_style', value: 'circle', selectionMsg: 'Made icon circular.', pageMsg: 'Made icons circular.', target: 'button' },

	// GROUP 24c: BUTTON STYLING (NEW) - Colour requests trigger palette picker
	{ regex: /button.*text.*colou?r|text.*colou?r.*button|button.*font.*colou?r|button.*link.*colou?r/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?', target: 'button', colorTarget: 'button-text' },
	{ regex: /button.*border.*(colou?r)/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?', target: 'button', colorTarget: 'button-border' },
	{ regex: /button.*hover.*(colou?r)|hover.*button.*(colou?r)/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?', target: 'button', colorTarget: 'button-hover-background' },
	// Generic button colour requests -> show palette (Keep last in group to avoid shadowing specific targets)
	{ regex: /button.*background.*(colou?r)|change.*button.*(colou?r)|button.*(colou?r)/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?', target: 'button', colorTarget: 'button-background' },
	// Specific button styling (non-colour)
	{ regex: /transparent.*background|clear.*background/, property: 'button_bg_color', value: 'transparent', selectionMsg: 'Made background transparent.', pageMsg: 'Made button backgrounds transparent.', target: 'button' },
	{ regex: /gradient.*button|gradient.*background/, property: 'button_gradient', value: true, selectionMsg: 'Applied gradient background.', pageMsg: 'Applied gradient to buttons.', target: 'button' },
	{ regex: /grey.*border|gray.*border/, property: 'button_border', value: '1px solid grey', selectionMsg: 'Added grey border.', pageMsg: 'Added grey border to buttons.', target: 'button' },
	{ regex: /button.*shadow.*grey/, property: 'button_shadow_color', value: 'grey', selectionMsg: 'Set shadow color to grey.', pageMsg: 'Set button shadow color to grey.', target: 'button' },
	
	// GROUP 24d: BUTTON TYPOGRAPHY (NEW)
	{ regex: /button.*uppercase|caps.*button/, property: 'button_transform', value: 'uppercase', selectionMsg: 'Made button text uppercase.', pageMsg: 'Made button text uppercase.', target: 'button' },
	{ regex: /button.*italic/, property: 'button_transform', value: 'italic', selectionMsg: 'Italicized button text.', pageMsg: 'Italicized button text.', target: 'button' },
	{ regex: /button.*underline/, property: 'button_decoration', value: 'underline', selectionMsg: 'Underlined button text.', pageMsg: 'Underlined button text.', target: 'button' },
	{ regex: /button.*bold|bold.*text.*button/, property: 'button_weight', value: 700, selectionMsg: 'Made button text bold.', pageMsg: 'Made button text bold.', target: 'button' },
	
	// GROUP 24e: RESPONSIVE & HOVER (NEW)
	{ regex: /button.*full.*mobile|full.*width.*mobile/, property: 'button_responsive_width', value: { device: 'mobile', width: '100%' }, selectionMsg: 'Made button full width on mobile.', pageMsg: 'Made buttons full width on mobile.', target: 'button' },
	{ regex: /hide.*button.*tablet/, property: 'button_responsive_hide', value: 'tablet', selectionMsg: 'Hidden button on tablet.', pageMsg: 'Hidden buttons on tablet.', target: 'button' },
	{ regex: /hover.*blue/, property: 'button_hover_bg', value: 'blue', selectionMsg: 'Set hover background to blue.', pageMsg: 'Set hover background to blue.', target: 'button' },
	{ regex: /hover.*yellow.*text/, property: 'button_hover_text', value: 'yellow', selectionMsg: 'Set hover text to yellow.', pageMsg: 'Set hover text to yellow.', target: 'button' },

	// GROUP 24f: DYNAMIC CONTENT (NEW)
	{ regex: /bind.*title|dynamic.*title/, property: 'button_dynamic_text', value: 'post-title', selectionMsg: 'Bound text to Post Title.', pageMsg: 'Bound button text to Post Title.', target: 'button' },
	{ regex: /dynamic.*link|post.*url/, property: 'button_dynamic_link', value: 'post-url', selectionMsg: 'Bound link to Post URL.', pageMsg: 'Bound button links to Post URL.', target: 'button' },


	// GROUP 24a: BUTTON CONTENT & LINKS (Moved to end to prevent shadowing color patterns)
	{ regex: /change.*button.*text|set.*button.*label|rename.*button/, property: 'button_text', value: 'use_prompt', selectionMsg: 'Updated button text.', pageMsg: 'Updated button text.', target: 'button' },
	{ regex: /change.*button.*link|update.*button.*url|set.*button.*link/, property: 'button_url', value: 'use_prompt', selectionMsg: 'Updated button link.', pageMsg: 'Updated button links.', target: 'button' },
	{ regex: /open.*new.*tab|new.*window.*link/, property: 'link_target', value: '_blank', selectionMsg: 'Set link to open in new tab.', pageMsg: 'Set buttons to open in new tab.', target: 'button' },
	{ regex: /nofollow.*link|rel.*nofollow/, property: 'link_rel', value: 'nofollow', selectionMsg: 'Set link to nofollow.', pageMsg: 'Set buttons to nofollow.', target: 'button' },
	{ regex: /download.*button|link.*pdf/, property: 'button_custom_text_link', value: 'Download', selectionMsg: 'Changed to Download button.', pageMsg: 'Changed buttons to Download.', target: 'button' },

	// GROUP 25: CREATE BLOCK PATTERNS (from Cloud Library)
	// Must include pattern-related keywords to avoid matching style changes like "make button red"
	{ regex: /(create|make|add|insert|build|generate)\s+(a\s+|an\s+|me\s+a\s+)?(pricing|hero|testimonial|contact|feature|team|gallery|footer|header|nav|cta|about|services|portfolio|faq|blog|card|grid|section|template|pattern|layout)/i, property: 'create_block', value: 'cloud_library', pageMsg: 'Creating pattern from Cloud Library...' },
];

const input = 'make the button border round';

const match = LAYOUT_PATTERNS.find(pattern => pattern.regex.test(input));

if (match) {
	console.log('MATCH FOUND!');
	console.log('Regex:', match.regex);
	console.log('Property:', match.property);
	console.log('ColorTarget:', match.colorTarget);
} else {
	console.log('NO MATCH FOUND');
}
