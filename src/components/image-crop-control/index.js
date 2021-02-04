/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Spinner } = wp.components;
const { Fragment, useState, useEffect, useRef } = wp.element;
const { useSelect } = wp.data;

/**
 * External dependencies
 */
import ReactCrop from 'react-image-crop';
import classnames from 'classnames';
import { capitalize, isEqual } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const GeneralInput = props => {
	const { target, value, onChange } = props;

	return (
		<label htmlFor={`maxi-image-crop-${target}-control`}>
			{capitalize(target)}
			<input
				type='number'
				id={`maxi-image-crop-${target}-control`}
				name={`maxi-image-crop-${target}-control`}
				value={value ? +value.toFixed() : ''}
				onChange={e => onChange(+e.target.value)}
			/>
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
			deleteFile();
			onChange(defaultCropOptions);
		} else setImageId(mediaID);
	}, [mediaID]);

	const saveData = newCrop => {
		const newCropOptions = {
			...crop,
			image: {
				...crop.image,
				width: newCrop.width ? newCrop.width : imgNode.current.width,
				height: newCrop.height
					? newCrop.height
					: imgNode.current.height,
			},
			crop: {
				...crop.crop,
				x: crop.width ? crop.x : 0,
				y: crop.height ? crop.y : 0,
				width: crop.width ? crop.width : imgNode.current.width,
				height: crop.height ? crop.height : imgNode.current.height,
			},
		};

		setCrop(newCropOptions);
		// onChange(newCropOptions);
	};

	const onImageLoad = newImage => {
		imgNode.current = newImage;

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
				<Fragment>
					<ReactCrop
						src={imageData.media_details.sizes.full.source_url}
						crop={crop.crop}
						onImageLoaded={image => onImageLoad(image)}
						onChange={newCrop =>
							!!newCrop.height &&
							!!newCrop.width &&
							setCrop({
								...crop,
								crop: { ...crop.crop, ...newCrop },
							})
						}
						onComplete={crop => onCropComplete(crop)}
						keepSelection={false}
					/>
					{imgNode.current && (
						<div className='maxi-image-crop-control__options'>
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
							/>
							<GeneralInput
								target='x'
								value={crop.crop.x}
								onChange={value => onInputChange('x', value)}
							/>
							<GeneralInput
								target='y'
								value={crop.crop.y}
								onChange={value => onInputChange('y', value)}
							/>
							<GeneralInput
								target='scale'
								value={Number(crop.crop.scale)}
								onChange={scale =>
									onInputChange('scale', scale)
								}
							/>
						</div>
					)}
				</Fragment>
			)}
			{!imageData && <Spinner />}
		</div>
	);
};

export default ImageCropControl;
