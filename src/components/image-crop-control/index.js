/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Spinner from '@components/spinner';

/**
 * External dependencies
 */
import ReactCrop from 'react-image-crop';
import classnames from 'classnames';
import { capitalize, isEqual, isNumber } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import 'react-image-crop/src/ReactCrop.scss';

/**
 * Component
 */
const GeneralInput = props => {
	const { target, value, onChange, inputState } = props;
	const minValue = 0;

	return (
		<label
			htmlFor={`maxi-image-crop-${target}-control`}
			className='maxi-base-control'
		>
			<span className='maxi-base-control__label-crop'>
				{capitalize(target)}
			</span>
			<div className='maxi-image-crop-control__input-wrapper'>
				<input
					type='number'
					id={`maxi-image-crop-${target}-control`}
					name={`maxi-image-crop-${target}-control`}
					value={isNumber(value) ? +value.toFixed() : ''}
					onChange={e => onChange(+e.target.value)}
					disabled={!inputState}
				/>
				<div className='maxi-image-crop-control__spinner-container'>
					<button
						type='button'
						className='maxi-image-crop-control__spinner-button maxi-image-crop-control__spinner-button--up'
						onClick={e => {
							e.preventDefault();
							onChange((value || 0) + 1);
						}}
						disabled={!inputState}
					>
						<svg
							width='8'
							height='5'
							viewBox='0 0 8 5'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M1 4L4 1L7 4'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
					<button
						type='button'
						className='maxi-image-crop-control__spinner-button maxi-image-crop-control__spinner-button--down'
						onClick={e => {
							e.preventDefault();
							onChange(Math.max(minValue, (value || 0) - 1));
						}}
						disabled={!inputState || (value || 0) <= minValue}
					>
						<svg
							width='8'
							height='5'
							viewBox='0 0 8 5'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M7 1L4 4L1 1'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
				</div>
			</div>
		</label>
	);
};

const ImageCropControl = props => {
	const { cropOptions, mediaID, className, onChange } = props;

	const classes = classnames('maxi-image-crop-control', className);

	const { imageData } = useSelect(
		select => {
			const { getMedia } = select('core');

			return {
				imageData: getMedia(mediaID),
			};
		},
		[mediaID]
	);

	const defaultCropOptions = {
		image: {
			source_url: '',
			width: '',
			height: '',
		},
		crop: {
			unit: 'px',
			x: '',
			y: '',
			width: undefined,
			height: undefined,
			scale: 100,
		},
	};

	const imgNode = useRef(null);
	const [crop, setCrop] = useState(cropOptions || defaultCropOptions);
	const [isFirstRender, changeIsFirstRender] = useState(true);
	const [imageID, setImageId] = useState(mediaID);

	const getInputState = cropValue => {
		const elements = ['height', 'width', 'x', 'y', 'scale'];

		const val = cropValue || crop.crop;

		return elements.every(el => isNumber(val[el]));
	};
	const [inputState, setInputState] = useState(getInputState());
	useEffect(() => {
		setInputState(getInputState());
	});

	const ajaxurl = wp.ajax.settings.url;

	const getScale = () => {
		return crop.crop.scale / 100;
	};

	const scaleX = () => {
		return imgNode.current.naturalWidth / imgNode.current.width;
	};

	const scaleY = () => {
		return imgNode.current.naturalHeight / imgNode.current.height;
	};

	const getX = () => {
		return crop.crop.x * scaleX();
	};

	const getY = () => {
		return crop.crop.y * scaleY();
	};

	const getWidth = () => {
		return +(crop.crop.width * scaleX()).toFixed(0);
	};

	const getHeight = () => {
		return +(crop.crop.height * scaleY()).toFixed(0);
	};

	const deleteFile = () => {
		if (
			!!imageData &&
			!!crop.image.source_url &&
			crop.image.source_url !==
				imageData.media_details.sizes.full.source_url
		) {
			const data = new FormData();
			data.append('old_media_src', cropOptions.image.source_url);

			fetch(
				`${
					window.location.origin + ajaxurl
				}?action=maxi_remove_custom_image_size`,
				{
					method: 'POST',
					data,
					body: data,
				}
			).catch(err => {
				console.error(
					__(`Error cropping the image: ${err}`, 'maxi-blocks')
				);
			});
		}
	};

	const cropper = () => {
		const data = new FormData();
		data.append('old_media_src', imageData.id);
		data.append('src', imageData.id);
		data.append('src_x', getX());
		data.append('src_y', getY());
		data.append('src_w', getWidth());
		data.append('src_h', getHeight());
		data.append('dst_w', getWidth() * getScale());
		data.append('dst_h', getHeight() * getScale());

		fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_add_custom_image_size`,
			{
				method: 'POST',
				data,
				body: data,
			}
		)
			.then(data => {
				return data.json();
			})
			.then(res => {
				deleteFile();

				const newCropOptions = {
					...crop,
					image: {
						...crop.image,
						source_url: res,
					},
				};

				setCrop(newCropOptions);
				setInputState(getInputState(newCropOptions));
				onChange(newCropOptions);
			})
			.catch(err => {
				console.error(
					__(`Error cropping the image: ${err}`, 'maxi-blocks')
				);
			});
	};

	useEffect(() => {
		if (mediaID !== imageID) {
			setCrop(defaultCropOptions);
			setInputState(getInputState(defaultCropOptions));
			deleteFile();
			onChange(defaultCropOptions);
		} else setImageId(mediaID);
	}, [mediaID]);

	const saveData = newCrop => {
		const newCropOptions = {
			...crop,
			image: {
				...crop.image,
				width: newCrop.width || imgNode.current.width,
				height: newCrop.height || imgNode.current.height,
			},
			crop: {
				...crop.crop,
				x: newCrop.x || 0,
				y: newCrop.y || 0,
				width: newCrop.width || imgNode.current.width,
				height: newCrop.height || imgNode.current.height,
			},
		};

		setCrop(newCropOptions);
		setInputState(getInputState(newCropOptions));
	};

	const onImageLoad = () => {
		const newCropOptions = {
			...crop,
			image: {
				...crop.image,
				...(!crop.image.source_url && {
					source_url: imageData.media_details.sizes.full.source_url,
				}),
				...(!!crop.image.width && {
					width: +imageData.media_details.sizes.full.width,
				}),
				...(!!crop.image.height && {
					height: +imageData.media_details.sizes.full.height,
				}),
			},
		};

		setCrop(newCropOptions);
		setInputState(getInputState(newCropOptions));
		onChange(newCropOptions);
	};

	const onInputChange = (target, value) => {
		const newCropOptions = {
			...crop,
			crop: {
				...crop.crop,
				[target]: value,
			},
		};

		if (!isEqual(newCropOptions.crop, crop.crop)) {
			onChange(newCropOptions);
			crop.crop = newCropOptions.crop;

			cropper();
		}
	};

	const onCropComplete = newCrop => {
		const letsCrop =
			!!newCrop.height &&
			!!newCrop.width &&
			!isEqual(defaultCropOptions.crop, crop.crop) &&
			!isFirstRender;

		if (letsCrop) {
			saveData(newCrop);

			cropper();
		} else {
			changeIsFirstRender(false);
		}
	};

	return (
		<div className={classes}>
			{imageData && (
				<>
					<ReactCrop
						crop={crop.crop}
						onChange={newCrop => {
							if (
								Object.keys(newCrop).every(el => {
									if (el !== 'unit' && el !== 'aspect') {
										return isNumber(newCrop[el]);
									}
									return true;
								})
							) {
								setCrop({
									...crop,
									crop: { ...crop.crop, ...newCrop },
								});
								setInputState(
									getInputState({
										...crop,
										crop: { ...crop.crop, ...newCrop },
									})
								);
							}
						}}
						onComplete={crop => onCropComplete(crop)}
						keepSelection={false}
					>
						<img
							src={imageData.media_details.sizes.full.source_url}
							onLoad={onImageLoad}
							ref={imgNode}
							alt='crop'
						/>
					</ReactCrop>
					{imgNode.current && (
						<div className='maxi-image-crop-control__options'>
							<div className='maxi-image-crop-control__row maxi-image-crop-control__row--top'>
								<GeneralInput
									target='width'
									value={
										(crop.crop.width &&
											crop.crop.width *
												scaleX() *
												getScale()) ||
										null
									}
									onChange={value =>
										onInputChange(
											'width',
											value / scaleX() / getScale()
										)
									}
									inputState={inputState}
								/>
								<GeneralInput
									target='height'
									value={
										(crop.crop.height &&
											crop.crop.height *
												scaleY() *
												getScale()) ||
										null
									}
									onChange={value =>
										onInputChange(
											'height',
											value / scaleY() / getScale()
										)
									}
									inputState={inputState}
								/>
							</div>
							<div className='maxi-image-crop-control__row maxi-image-crop-control__row--bottom'>
								<GeneralInput
									target='x'
									value={crop.crop.x}
									onChange={value => onInputChange('x', value)}
									inputState={inputState}
								/>
								<GeneralInput
									target='y'
									value={crop.crop.y}
									onChange={value => onInputChange('y', value)}
									inputState={inputState}
								/>
								<GeneralInput
									target='scale'
									value={Number(crop.crop.scale)}
									onChange={scale =>
										onInputChange('scale', scale)
									}
									inputState={inputState}
								/>
							</div>
						</div>
					)}
				</>
			)}
			{!imageData && <Spinner />}
		</div>
	);
};

export default ImageCropControl;
