import classnames from "classnames";
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
	PanelColorSettings,
	MediaUpload,
	RichText,
	URLInputButton
} = wp.blockEditor;
const {
	PanelBody,
	BaseControl,
	Button,
	SelectControl
} = wp.components;

/**
 * External dependencies
 */
import {
	AlignmentControl,
	BlockStylesControl,
	ColorControl,
	DimensionsControl,
	

} from '../../components';

import Typography from "../../components/typography";
import GradientPickerPopover from '../../components/gradient-picker/';
import { BlockStyles } from '../../components/block-styles/index';
import { SizeControl } from '../../components/size-control/index';
import { PaddingMarginControl } from '../../components/padding-margin-control/index';
import { TextAlignment } from "../../components/text-alignment";

import { setBlockStyles, setNameSurnameStyles } from './data';

/**
 * External dependencies
 */
import React, { useEffect }from 'react'


/**
 * EDIT function
 * @param props
 * @return {*}
 */
const edit = (props) => {
	const {
		className,
		attributes: {
			testimonials,
			backgroundColor,
			backgroundImage,
			backgroundGradient,
			defaultPalette,
			titleStyle,
			titleAlignment,
			imageAlignment,
			imageRound,
			titlePopUpIsVisible,
			blockAlignment,
			textAlignment,
			blockStyle,
			defaultBlockStyle,
			fontOptions,
			uniqueID
		}
	} = props;

	useEffect(() => {
		if (!testimonialsList.length) {
			props.setAttributes({ testimonials: testimonialInstance })
		}
	}, []);

	let classes = classnames( className );
	if ( className.indexOf(uniqueID) === -1 ) {
		classes = classnames( classes, uniqueID )
	}

	const blockStyles = setBlockStyles(props);
	const nameSurnameStyles = setNameSurnameStyles(props);

	const handlePersonImageSelect =  ( media, testimonial ) => {
		const image = media.sizes.medium
			? media.sizes.medium.url
			: media.url;
		const newObject = Object.assign({}, testimonial, {
			image: image
		});
		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handleRemovePersonImageClick = testimonial => {
		const newObject = Object.assign(
			{},
			testimonial,
			{
				image: null
			}
		);
		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handleRemoveTestimonialClick = testimonial => {
		const newTestimonials = testimonials
			.filter(item => item.index != testimonial.index)
			.map(t => {
				if (t.index > testimonial.index) {
					t.index -= 1;
				}
				return t;
			});

		props.setAttributes({
			testimonials: newTestimonials
		});
	};

	const handlePersonNameSurnameChange = (personNameSurname, testimonial) => {
		const newObject = Object.assign({}, testimonial, {
			personNameSurname
		});

		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handlePersonsPositionChange = (personPosition, testimonial) => {
			const newObject = Object.assign({}, testimonial, {
				personPosition
			});

			props.setAttributes({
				testimonials: [
					...testimonials.filter(
						item => item.index != testimonial.index
					),
					newObject
				]
			});
	};

	const handleUrlButtonClick = (linkOptionHref, testimonial) => {
		const newObject = Object.assign({}, testimonial, {
			linkOptionHref
		});
		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handleTitleLinkChange = (linkOptionTitle, testimonial) => {
		const newObject = Object.assign({}, testimonial, {
			linkOptionTitle
		});
		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handleLinkOptionTargetSelect = (linkOptionTarget, testimonial) => {
		const newObject = Object.assign({}, testimonial, { linkOptionTarget });

		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handleTitleChange = (title, testimonial) => {
		const newObject = Object.assign({}, testimonial, {
			title
		});
		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	const handleContentChange = (content, testimonial) => {
		const newObject = Object.assign({}, testimonial, {
			content
		});
		props.setAttributes({
			testimonials: [
				...testimonials.filter(
					item => item.index != testimonial.index
				),
				newObject
			]
		});
	};

	/**
	 * Setup person image alignment and border radius
	 */
	const personImageAlign = (testimonial, imageAlignment, imageRound) => {

		return (
			<div className="gutenberg-extra__picture" style={ ['left', 'right'].includes(imageAlignment) ? {float: imageAlignment} : { } }>
				<MediaUpload
					onSelect={ media => handlePersonImageSelect(media, testimonial) }
					type="image"
					value={testimonial.image}
					render={({ open }) =>
						!!testimonial.image ? (
							<div className="gutenberg-extra__picture__actions">
								{/*{props.isSelected && (*/}
									<a
										href="#"
										onClick={() => handleRemovePersonImageClick(testimonial) }
									>
										× Remove
									</a>
								{/*)}*/}
								{/*just div,  set image as background*/}
								<div
									className="gutenberg-extra__picture__image"
									style={{
										backgroundImage: `url(${testimonial.image})`,
										borderRadius: imageRound
									}}
									onClick={open}
								/>
							</div>
						) : (
							<a
								href="#"
								className="gutenberg-extra__picture__image"
								onClick={open}
								style={{
									borderRadius: imageRound
								}}
							>
								Select Image
							</a>
						)
					}
				/>
			</div>);
	};

	const testimonialsList = testimonials
		.sort((a, b) => a.index - b.index)
		.map(testimonial => {

			return (
				<div className={ testimonials.length <= 2 ? 'gx-full-width-col' : 'col' } key={testimonial.index}>
					<div className="testimonial">
                        <span className="testimonial-index" style={{ display: "none" }}>
                            {testimonial.index}
                        </span>
						<p className={"remove-testimonial-block"}>
							<span
								className="remove-testimonial dashicons dashicons-trash"
								onClick={ () => handleRemoveTestimonialClick(testimonial) }
							>
							</span>
						</p>

						<div
							className=""
							style={ ['left', 'right'].includes(imageAlignment) ? ( {display: "flex"} ) : {} }
						>
							{ imageAlignment === 'top' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}
							{ imageAlignment === 'left' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}

							<div className={"gutenberg-extra_personal_info col-12"}>
								<RichText
									tagName='p'
									style={ nameSurnameStyles }
									placeholder={__("Person's Full Name", "gutenberg-extra")}
									value={ testimonial.personNameSurname }
									onChange={ (value) => handlePersonNameSurnameChange(value, testimonial) }
									className="gx-testimonial-name-surname fillable_field "
								/>
								<RichText
									tagName="p"
									style={{ height: 30 }}
									autoFocus
									placeholder={ __("Person's Position", "gutenberg-extra") }
									value={ testimonial.personPosition }
									onChange={ (value) => handlePersonsPositionChange(value, testimonial) }
									className="content-plain-text mb-10 fillable_field gx-testimonial-person-position"
								/>
							</div>
							<div className="person_link_options edit" style={
								{display: "flex", "justify-content": "space-between", "align-items": "center", "flex-flow": "row wrap"}
							}>
								<URLInputButton
									url={testimonial.linkOptionHref}
									className="url_editor_block"
									style={{ width: "16%"}}
									onChange={ value => handleUrlButtonClick(value, testimonial)}
								/>
								<RichText
									tagName="p"
									// style={{ height: '40px', width: "83%"}}
									placeholder={ __("Title of link", "gutenberg-extra") }
									value={testimonial.linkOptionTitle}
									onChange={ (value) => handleTitleLinkChange(value, testimonial) }
									className="title-plain-text fillable_field gx-testimonial-title-text"
								/>
								<SelectControl
									value={ testimonial.linkOptionTarget }
									options={ [
										{ label: 'Blank', value: '_blank' },
										{ label: 'Self', value: '_self' },
										{ label: 'Parent', value: '_parent' },
										{ label: 'Top', value: '_top' },
									] }
									onChange={ value => handleLinkOptionTargetSelect(value, testimonial) }
								/>
							</div>
							<div className="col-9 mt-3 testimonial_text">
								<RichText
									tagName="p"
									style={{ textAlign: titleAlignment, fontStyle: titleStyle }}
									placeholder={__("Title", "gutenberg-extra")}
									value={ testimonial.title }
									onChange={value => handleTitleChange(value, testimonial)}
									className="title-plain-text fillable_field"
								/>
								<RichText
									tagName="p"
									style={{ height: 58 }}
									autoFocus
									placeholder={__("Testimonial Text", "gutenberg-extra")}
									value={testimonial.content}
									onChange={ (value) => handleContentChange(value, testimonial) }
									className="content-plain-text fillable_field"
								/>
							</div>
							{ imageAlignment === 'bottom' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}
							{ imageAlignment === 'right' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}
						</div>
					</div>
				</div>
			);
		});

	let backgroundImageWithGradient = backgroundGradient.length
		? `linear-gradient(to left, ${backgroundGradient[0]},${backgroundGradient[1]})`
		: '';

	if (backgroundImage) {
		backgroundImageWithGradient += backgroundGradient.length
			? `, url(${backgroundImage})`
			: `url(${backgroundImage})`
	}

	blockStyles.backgroundColor = backgroundColor ? backgroundColor : undefined;
	blockStyles.backgroundImage = backgroundImageWithGradient ? backgroundImageWithGradient : undefined ;

	const testimonialInstance = [
		...props.attributes.testimonials,
		{
			index: props.attributes.testimonials.length,
			title: "",
			content: "",
			link: "",
			personNameSurname: "",
			personPosition: "",
			linkOptionTitle: "",
			linkOptionHref: "",
			linkOptionTarget: ""
		}
	];

	const handleAddMoreTestimonialClick = () =>
		props.setAttributes({
			testimonials: testimonialInstance
	});

	const backgroundColorSettings = [
		{
			onChange: ( value ) => {
				if (!value) {
					props.setAttributes({ backgroundColor: undefined });
					props.setAttributes({ backgroundGradient: [] });
					return;
				}
				props.setAttributes({ backgroundColor: value });
				props.setAttributes({ backgroundImage: null });
			},
			label: __( 'Background Colour', "gutenberg-extra" ),
			value: backgroundColor
		},
	];

	const handleGradientPickerChange = value => {
		props.setAttributes({ defaultPalette: value });

		let colors = [];
		Object.values(value).map(key => {
			const { color } = key;
			return colors.push(color)
		});

		props.setAttributes({ backgroundGradient: colors });
	};


	return (
		<div className={props.className + ' gx-block ' + blockStyle + ' gx-image-box ' + classes } style={ blockStyles }
			 data-gx_initial_block_class={defaultBlockStyle}>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ blockAlignment }
					onChange={ blockAlignment => props.setAttributes( { blockAlignment } ) }
				/>
			</BlockControls>

			{testimonialsList}

			{(testimonialsList.length <= 2) ?
				(<button
					className="gx-add-more-testimonial"
					onClick={ handleAddMoreTestimonialClick }
				>
					+
				</button>) : ''
			}
			<InspectorControls >
				<div className="gx-testimonial-sidebar-group">
				<BlockStyles { ...props }/>
				<PanelBody
					title={__("Background setting", "gutenberg-extra")}
					className="gx-testimonial-setting-panel gx-background-setting-panel gx-background-setting gx-content-tab-setting"
					initialOpen={ false }
				>
					<BaseControl
						className={"gx-bg-color-parent gx-settings-button gx-background-gradient"}
					>
						<PanelColorSettings
							title={ __( 'Background Colour', "gutenberg-extra" ) }
							colorSettings={ backgroundColorSettings }
						/>
						<div className={'gx-gradient'}>
							<GradientPickerPopover
								palette={defaultPalette}
								onPaletteChange={ handleGradientPickerChange }
							/>
						</div>
					</BaseControl>
					<BaseControl
						className={"gx-settings-button gx-background-image"}
					>
						<BaseControl.VisualLabel>{__("Background Image", "gutenberg-extra")}</BaseControl.VisualLabel>
						<div className={"gx-image-form-and-reset"}>
							{backgroundImage ?
								(<Button className={'gx-background-custom-reset-option gx-reset-background-image'}
										 onClick={() => {
										 	props.setAttributes({ backgroundImage: null })
										 }}>
								</Button>) : ''
							}
							<MediaUpload
								className={"gx-background-image-form"}
								label={__("Upload", "gutenberg-extra")}
								type="image/*"
								render={ ({open}) => (
									<Button
										onClick={ open }
										className={"dashicons dashicons-format-image"}
									>
									</Button>
								)}
								onSelect={(file) => {
									props.setAttributes({ backgroundColor: undefined });
									props.setAttributes({ backgroundImage: file.sizes.thumbnail.url })
								} }
							/>
						</div>
					</BaseControl>
				</PanelBody>
				<PanelBody
					title="Title setting"
					className=" gx-testimonial-setting-panel gx-sidebar gx-title-text-setting gx-content-tab-setting"
					initialOpen={ false }
				>
					<TextAlignment {...props} onChange={value => props.setAttributes({ titleAlignment: value })} />

					<SelectControl
						label={__("Position", "gutemberg-extra")}
						className="gx-block-style"
						value={ titleAlignment }
						width={"160px"}
						options={ [
							{ label: 'Top', value: 'top' },
							{ label: 'Bottom', value: 'bottom' }
						] }
						onChange={ ( value ) => props.setAttributes({ titlePosition: value }) }
					/>
					<SelectControl
						label={__("Style", "gutenberg-extra")}
						className="gx-block-style"
						value={ titleStyle }
						width={"160px"}
						options={ [
							{ label: 'Normal',	value: 'normal' },
							{ label: 'Italic', value: 'italic' },
							{ label: 'Oblique', value: 'oblique' },
						] }
						onChange={ ( value ) => props.setAttributes({ titleStyle : value }) }
					/>
				</PanelBody>
				<PanelBody
					title={__("Person's Image setting", "gutenberg-extra")}
					className="gx-testimonial-setting-panel gx-person-image-setting gx-content-tab-setting"
					initialOpen={ false }
				>
					<SelectControl
						label={__("Alignment", "gutenberg-extra")}
						className="gx-block-style"
						value={ imageAlignment }
						width={"160px"}
						options={ [
							{ label: __('Top', "gutenberg-extra"),	  value: 'top' },
							{ label: __('Right', "gutenberg-extra"),  value: 'right' },
							{ label: __('Bottom', "gutenberg-extra"), value: 'bottom' },
							{ label: __('Left', "gutenberg-extra"),   value: 'left' },
						] }
						onChange={ ( value ) => props.setAttributes({ imageAlignment : value }) }
					/>
					<SelectControl
						label={__("Border rounded", "gutenberg-extra")}
						className="gx-block-style"
						value={ imageRound }
						width={"160px"}
						options={ [
							{ label: 'Round',	value: '50%' },
							{ label: 'No Round', value: '0' },
						] }
						onChange={ ( value ) => props.setAttributes({ imageRound : value }) }
					/>
				</PanelBody>
				<PanelBody
					title={__("Testimonial text style", "gutenberg-extra")}
					className="gx-testimonial-setting-panel gx-testimonial-text-style gx-content-tab-setting"
					initialOpen={ false }
				>

					<Typography
						fontOptions={ fontOptions }
						onChange={value => {  props.setAttributes({ fontOptions: value}) }}
						target="gx-testimonial-name-surname"
					/>

				</PanelBody>
				<PanelBody
					title={__("Testimonial size-control", "gutenberg-extra")}
					className="gx-testimonial-setting-panel gx-testimonial-sizing gx-content-tab-setting"
					initialOpen={ false }
				>
					<SizeControl { ...props } />
				</PanelBody>
				<PanelBody
					title={__('Space Settings', 'gutenberg-extra')}
					className="gx-testimonial-setting-panel gx-space-setting gx-style-tab-setting"
					initialOpen={ false }
				>
					<PaddingMarginControl {...props} />
				</PanelBody>
				</div>
			</InspectorControls>
		</div>
	);
};

export default edit;