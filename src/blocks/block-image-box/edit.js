/**
 * External dependencies
 */
import classnames from 'classnames';
import { animationsClasses, transitionTypes, buttonShapes, buttonSizes } from './data';
import { withState } from '@wordpress/compose';
import { RangeControl } from '@wordpress/components';
import { FontSizePicker } from '@wordpress/components';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const {
				Component,
				Fragment,
} = wp.element;
const { compose } = wp.compose;
const {
				Dashicon,
				IconButton,
				withFallbackStyles,
				TextControl,
				TextareaControl,
				SelectControl,
				PanelBody,
				ToggleControl,
} = wp.components;
const {
				URLInput,
				RichText,
				ContrastChecker,
				InspectorControls,
				withColors,
				PanelColorSettings,
				AlignmentToolbar,
    			BlockControls,
} = wp.blockEditor;

const { getComputedStyle } = window;

const FallbackStyles = withFallbackStyles((node, ownProps) => {

				const { textColor, backgroundColor, borderColor } = ownProps;

				const backgroundColorValue = backgroundColor && backgroundColor.color;
				const textColorValue = textColor && textColor.color;
				const borderColorValue = borderColor && borderColor.color;

				//avoid the use of querySelector if textColor color is known and verify if node is available.
				const textNode = !textColorValue && node ? node.querySelector('[contenteditable="true"]') : null;

				return {
								fallbackBackgroundColor: backgroundColorValue || !node ? undefined : getComputedStyle(node).backgroundColor,
								fallbackTextColor: textColorValue || !textNode ? undefined : getComputedStyle(textNode).color,
								fallbackBorderColor: borderColorValue || !node ? undefined : getComputedStyle(node).color,
				};

});

class AnimationButtonEdit extends Component {
				constructor() {
								super(...arguments);
								this.nodeRef = null;
								this.bindRef = this.bindRef.bind(this);
				}

				bindRef(node) {
								if (!node) {
												return;
								}
								this.nodeRef = node;
				}

				render() {

								const {
												attributes,
												backgroundColor,
												borderColor,
												textColor,
												setBackgroundColor,
												setTextColor,
												setBorderColor,
												fallbackBorderColor,
												fallbackBackgroundColor,
												fallbackTextColor,
												setAttributes,
												isSelected,
												className,
								} = this.props;

								const {
												text,
												url,
												title,
												animation,
												backgroundHoverColor,
												borderHoverColor,
												textHoverColor,
												transition,
												transitionType,
												extraClassName,
												fontSize,
												lineHeight,
												letterSpacing,
												linkTitle,
												extraStyles,
												extraHoverStyles,
												extraBeforeStyles,
												extraAfterStyles,
												extraHoverBeforeStyles,
												extraHoverAfterStyles,
												opensInNewWindow,
												addNofollow,
												addNoopener,
												addNoreferrer,
												addSponsored,
												addUgc,
												buttonShape,
												buttonSize,
												paddingSize,
												maxWidth,
												borderWidth,
												borderRadius,
												borderStyle,
												minWidth,
												buttonWidth,
												maxHeight,
												minHeight,
												paddingTop,
												paddingLeft,
												paddingRight,
												paddingBottom,
												marginTop,
												marginLeft,
												marginRight,
												marginBottom,
												buttonHeight,
												textTransform,
								} = attributes;


								const fontSizes = [
							        {
							            name: __( 'Small' ),
							            slug: 'small',
							            shortName: 'S',
							            size: 14,
							        },
							        {
							            name: __( 'Default' ),
							            slug: 'normal',
							            shortName: 'M',
							            size: 16,
							        },
							        {
							            name: __( 'Large' ),
							            slug: 'large',
							            shortName: 'X',
							            size: 20,
							        },
							        {
							            name: __( 'X-Large' ),
							            shortName: 'XL',
							            slug: 'x-large',
							            size: 26,
							        },
							        {
							            name: __( 'XX-Large' ),
							            shortName: 'XXL',
							            slug: 'xx-large',
							            size: 30,
							        },
							    ];
								const fallbackFontSize = 16;

								const hoverClass = (borderHoverColor ? borderHoverColor.replace('#', '') + '-' : '') + (backgroundHoverColor ? backgroundHoverColor.replace('#', '') + '-' : '') + (textHoverColor ? textHoverColor.replace('#', '') : '');
								const hoverStyles = (borderHoverColor ? `border-color: #${borderHoverColor.replace( '#', '' )}!important;` : '') + (backgroundHoverColor ? `background-color: #${backgroundHoverColor.replace( '#', '' )}!important;` : '') + (textHoverColor ? `color: #${textHoverColor.replace( '#', '' )}!important;` : '');
								const uniqueClass = extraStyles ? extraStyles.replace(/[^a-z0-9]/gi, '') : '';
								const uniqueHoverClass = extraHoverStyles ? extraHoverStyles.replace(/[^a-z0-9]/gi, '') : '';
								const uniqueBeforeClass = extraBeforeStyles ? extraBeforeStyles.replace(/[^a-z0-9]/gi, '') : '';
								const uniqueAfterClass = extraAfterStyles ? extraAfterStyles.replace(/[^a-z0-9]/gi, '') : '';

								let buttonStyles = {
												backgroundColor: backgroundColor.color,
												color: textColor.color,
												borderColor: borderColor.color,
												borderWidth: borderWidth + 'px',
												borderRadius: borderRadius + 'px',
												borderStyle: borderStyle,
												fontSize: fontSize + 'px',
												lineHeight: lineHeight + '%',
												letterSpacing: letterSpacing + 'px',
												width: buttonWidth + '%',
												maxWidth: maxWidth+ 'px',
												minWidth: minWidth + 'px',
												height: buttonHeight + 'px',
												maxHeight: maxHeight + 'px',
												minHeight: minHeight + 'px',
												textTransform: textTransform,
												paddingTop: paddingTop + 'px',
												paddingLeft: paddingLeft + 'px',
												paddingRight: paddingRight + 'px',
												paddingBottom: paddingBottom + 'px',
												marginTop: marginTop + 'px',
												marginLeft: marginLeft + 'px',
												marginRight: marginRight + 'px',
												marginBottom: marginBottom + 'px',
												};

								if (transition) {
												buttonStyles.transition = `${transition}s ${transitionType ? transitionType : ''}`;
								}

								return (
												<Fragment>
				<div className={ classnames( className, extraClassName, uniqueClass, uniqueHoverClass, buttonSize, buttonShape ) } title={ title } ref={ this.bindRef }>
					{ hoverClass && <style dangerouslySetInnerHTML={{__html: `.wp-block-gx-animation-button:hover .hover-${hoverClass}{${hoverStyles}}` }} /> }
					{ uniqueClass && <style dangerouslySetInnerHTML={{__html: `.${uniqueClass} .wp-block-button__link{${extraStyles}}` }} /> }
					{ uniqueHoverClass && <style dangerouslySetInnerHTML={{__html: `.${uniqueHoverClass} .wp-block-button__link:hover{${extraHoverStyles}}` }} /> }
					{ extraBeforeStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:before{${extraBeforeStyles}}` }} /> }
					{ extraAfterStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:after{${extraAfterStyles}}` }} /> }
					{ extraHoverBeforeStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:hover:before{${extraHoverBeforeStyles}}` }} /> }
					{ extraHoverAfterStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:hover:after{${extraHoverAfterStyles}}` }} /> }


					<RichText
						placeholder={ __( 'Add text…' ) }
						value={ text }
						onChange={ ( value ) => setAttributes( { text: value } ) }
						// allowedFormats={ [ 'bold', 'italic', 'strikethrough' ] }
						className={ classnames(
							'wp-block-button__link', `hover-${hoverClass}`, {
								'has-background': backgroundColor.color,
								[ backgroundColor.class ]: backgroundColor.class,
								'has-text-color': textColor.color,
								[ textColor.class ]: textColor.class,
								'has-border-color': borderColor.color,
								[ borderColor.class ]: borderColor.class,
							},
							animation
						) }
						style={ buttonStyles }
						keepPlaceholderOnFocus
						title={ linkTitle }
						target={ opensInNewWindow ? '_blank' : '_self' }
						rel= { (addNofollow ? 'nofollow ' : '') + (addNoreferrer ? 'noreferrer ' : '')  + (addNoopener ? 'noopener ' : '') + (addSponsored ? 'sponsored ' : '') + (addUgc ? 'ugc' : '')}

					/>
					{/* Sidebar Settings */}
					<InspectorControls>
						<PanelColorSettings
							title={ __( 'Color Settings' ) }
							className='gx-general-tab'
							colorSettings={ [
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Background Color' ),
								},
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Text Color' ),
								},
							] }
						>
						<ContrastChecker
							{ ...{
								isLargeText: true,
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackBackgroundColor,
								fallbackTextColor,
							} }
						/>
					</PanelColorSettings>
						<PanelColorSettings
							title={ __( 'Hover' ) }
							className='gx-hover-tab'
							colorSettings={ [
								{
									value: backgroundHoverColor,
									onChange: value => {
										setAttributes({
											backgroundHoverColor: value
										});
									},
									label: __( 'Hover Background Color' ),
								},
								{
									value: textHoverColor,
									onChange: value => {
										setAttributes({
											textHoverColor: value
										});
									},
									label: __( 'Hover Text Color' ),
								},
							] }
						/>
					<PanelBody initialOpen={ false } title={ __( 'Border settings' ) } className='gx-general-tab'>
						<PanelColorSettings
							title={ false }
							className='gx-hidden-header'
							colorSettings={ [
								{
									value: borderColor.color,
									onChange: setBorderColor,
									label: __( 'Border Color' ),
								},
							] }
						/>
					<RangeControl
                            label="Border Width (px)"
                            value={borderWidth}
                            onChange={ ( value ) => this.props.setAttributes({ borderWidth: value }) }
                            min={ 0 }
                        />
                        <SelectControl
					        label="Border Style"
					        value={ borderStyle }
					        options={ [
					        	{ label: 'None', value: 'none' },
					            { label: 'Dotted', value: 'dotted' },
					            { label: 'Dashed', value: 'dashed' },
					            { label: 'Solid', value: 'solid' },
					            { label: 'Double', value: 'double' },
					            { label: 'Groove', value: 'groove' },
					            { label: 'Ridge', value: 'ridge' },
					            { label: 'Inset', value: 'inset' },
					            { label: 'Outset', value: 'outset' },
					        ] }
					        onChange={ ( value ) => this.props.setAttributes({ borderStyle: value }) }
						/>
						<RangeControl
                            label="Border Radius (px)"
                            value={borderRadius}
                            onChange={ ( value ) => this.props.setAttributes({ borderRadius: value }) }
                            min={ 0 }
                        />
					</PanelBody>

					<PanelBody initialOpen={ false } title={ __( 'Border on Hover' ) } className=''>
						<PanelColorSettings
							// title={ __( 'Hover' ) }
							className='gx-hidden-header'
							colorSettings={ [
								{
									value: borderHoverColor,
									onChange: value => {
										setAttributes({
											borderHoverColor: value
										});
									},
									label: __( 'Hover Border Color' ),
								},
							] }
						/>
						<RangeControl
                            label="Border Hover Width"
                            value={50}
                            //onChange={ onChangeWidth }
                            min={ 0 }
                            max={ 100 }
                        />
                     </PanelBody>
                     <PanelBody className="link-setting" initialOpen={ false } title={ __( 'Link Settings' ) }>
                     <TextControl
								label={ __( 'Link\'s Title' ) }
								value={ linkTitle || '' }
								onChange={ (e) => {
									setAttributes( {
										linkTitle: e,
									} );
								} }
							/>
                        <ToggleControl
								label={ __( 'Open in New Window' ) }
								id='gx-new-window'
								checked={ opensInNewWindow }
								onChange={ () => setAttributes( { opensInNewWindow: ! opensInNewWindow } ) }
							/>
						<ToggleControl
								label={ __( 'Add "nofollow" attribute' ) }
								checked={ addNofollow }
								onChange={ () => setAttributes( { addNofollow: ! addNofollow } ) }
							/>  

						<ToggleControl
								label={ __( 'Add "noopener" attribute' ) }
								checked={ addNoopener }
								onChange={ () => setAttributes( { addNoopener : ! addNoopener  } ) }
							/>  

						<ToggleControl
								label={ __( 'Add "noreferrer" attribute' ) }
								checked={ addNoreferrer  }
								onChange={ () => setAttributes( {addNoreferrer: ! addNoreferrer } ) }
							/> 

						<ToggleControl
								label={ __( 'Add "sponsored" attribute' ) }
								checked={ addSponsored }
								onChange={ () => setAttributes( { addSponsored: ! addSponsored } ) }
							/>  

						<ToggleControl
								label={ __( 'Add "ugc" attribute' ) }
								checked={ addUgc }
								onChange={ () => setAttributes( { addUgc: ! addUgc } ) }
							/>          
					</PanelBody>
					<PanelBody initialOpen={ false } title={ __( 'Text Settings' ) }>
							<FontSizePicker
								lebel={"Font Size"}
					            fontSizes={ fontSizes }
					            value={ fontSize }
					            fallbackFontSize={ fallbackFontSize }
					            withSlider = {true}
					            onChange={ ( value ) => this.props.setAttributes({ fontSize: value }) }
					        />
					        <RangeControl
                            label="Line height (%)"
                            value={lineHeight}
                            onChange={ ( value ) => this.props.setAttributes({ lineHeight: value }) }
							allowReset = {true}
                        	/>
                        	<RangeControl
                            label="Letter Spacing (px)"
                            value={letterSpacing}
                            step={0.1}
                            onChange={ ( value ) => this.props.setAttributes({ letterSpacing: value }) }
							allowReset = {true}
                        	/>
                        	<SelectControl
					        label="Text Transform"
					        value={ textTransform }
					        options={ [
					        	{ label: 'None', value: 'none' },
					            { label: 'Uppercase', value: 'uppercase' },
					            { label: 'Capitalize', value: 'capitalize' },
					            { label: 'Lowercase', value: 'lowercase' },
					        ] }
					        onChange={ ( value ) => this.props.setAttributes({ textTransform: value }) }
					    />
					</PanelBody>
					<PanelBody initialOpen={ false } title={ __( 'Size Settings' ) }>
							<RangeControl
                            label="Max Width (px)"
                            value={maxWidth}
                            onChange={ ( value ) => this.props.setAttributes({ maxWidth: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
                        	<RangeControl
                            label="Width (%)"
                            value={buttonWidth}
                            onChange={ ( value ) => this.props.setAttributes({ buttonWidth: value }) }
							min={ 0 }
                            max={ 100 }
                            allowReset = {true}
                        	/>
                        	<RangeControl
                            label="Min Width (px)"
                            value={minWidth}
                            onChange={ ( value ) => this.props.setAttributes({ minWidth: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
                        	<RangeControl
                            label="Max Height (px)"
                            value={maxHeight}
                            onChange={ ( value ) => this.props.setAttributes({ maxHeight: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
                        	<RangeControl
                            label="Height (px)"
                            value={buttonHeight}
                            onChange={ ( value ) => this.props.setAttributes({ buttonHeight: value }) }
                            allowReset = {true}
                        	/>
                        	<RangeControl
                            label="Min Height (px)"
                            value={minHeight}
                            onChange={ ( value ) => this.props.setAttributes({ minHeight: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
					</PanelBody>
					<PanelBody initialOpen={ false } title={ __( 'Space Settings' ) }>
						<TextControl
								label={ __( 'Padding Top (px)' ) }
								value={ paddingTop }
								onChange={ ( value ) => this.props.setAttributes({ paddingTop: value }) }
							/>
							<TextControl
								label={ __( 'Padding Left (px)' ) }
								value={ paddingLeft }
								onChange={ ( value ) => this.props.setAttributes({ paddingLeft: value }) }
							/>
							<TextControl
								label={ __( 'Padding Right (px)' ) }
								value={ paddingRight }
								onChange={ ( value ) => this.props.setAttributes({ paddingRight: value }) }
							/>
							<TextControl
								label={ __( 'Padding Bottom (px)' ) }
								value={ paddingBottom }
								onChange={ ( value ) => this.props.setAttributes({ paddingBottom: value }) }
							/>
							<TextControl
								label={ __( 'Margin Top (px)' ) }
								value={ marginTop }
								onChange={ ( value ) => this.props.setAttributes({ marginTop: value }) }
							/>
							<TextControl
								label={ __( 'Margin Left (px)' ) }
								value={ marginLeft }
								onChange={ ( value ) => this.props.setAttributes({ marginLeft: value }) }
							/>
							<TextControl
								label={ __( 'Margin Right (px)' ) }
								value={ marginRight }
								onChange={ ( value ) => this.props.setAttributes({ marginRight: value }) }
							/>
							<TextControl
								label={ __( 'Margin Bottom (px)' ) }
								value={ marginBottom }
								onChange={ ( value ) => this.props.setAttributes({ marginBottom: value }) }
							/>
					</PanelBody>
					<PanelBody initialOpen={ false } title={ __( 'Advanced Settings' ) }>
							<TextControl
								label={ __( 'Additional CSS Classes' ) }
								value={ extraClassName || '' }
								onChange={ (e) => {
									setAttributes( {
										extraClassName: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Styles' ) }
								value={ extraStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Hover Styles' ) }
								value={ extraHoverStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraHoverStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Before Styles' ) }
								value={ extraBeforeStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraBeforeStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS After Styles' ) }
								value={ extraAfterStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraAfterStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Hover Before Styles' ) }
								value={ extraHoverBeforeStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraHoverBeforeStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Hover After Styles' ) }
								value={ extraHoverAfterStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraHoverAfterStyles: e,
									} );
								} }
							/>
						</PanelBody>
					</InspectorControls>
				</div>
				{ isSelected && (
					<form
						className="block-library-button__inline-link"
						onSubmit={ ( event ) => event.preventDefault() }>
						<Dashicon icon="admin-links" />
						<URLInput
							value={ url }
							onChange={ ( value ) => setAttributes( { url: value } ) }
						/>
						<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
					</form>
				) }
			</Fragment>
								);
				}
}

export default compose([
				withColors('backgroundColor', 'borderColor', { textColor: 'color' }),
				FallbackStyles,
])(AnimationButtonEdit);
