/* eslint-disable no-use-before-define */
/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Spinner } = wp.components;
const { Fragment, useState, useEffect } = wp.element;
const { useSelect } = wp.data;

/**
 * External dependencies
 */
import ReactCrop from 'react-image-crop';
import classnames from 'classnames';
import { capitalize, isEmpty, isObject } from 'lodash';

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
				value={Number(value).toFixed()}
				onChange={e => onChange(parseInt(e.target.value))}
			/>
		</label>
	);
};

const ImageCropControl = props => {
	const { cropOptions, mediaID, className, onChange } = props;

	const classes = classnames('maxi-image-crop-control', className);

	const cropOptionsValue = !isObject(cropOptions)
		? JSON.parse(cropOptions)
		: cropOptions;

	const { imageData } = useSelect(
		select => {
			const { getMedia } = select('core');

			return {
				imageData: getMedia(mediaID),
			};
		},
		[mediaID]
	);

	const [imageID, setImageID] = useState(mediaID);
	const [image, setImage] = useState(null);
	const [originalImageData, setOriginalImageData] = useState(
		imageData ? imageData.media_details.sizes.full : ''
	);
	const [crop, setCrop] = useState({
		x: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.x : 0,
		y: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.y : 0,
		width: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.width : 0,
		height: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.height : 0,
	});

	useEffect(() => {
		if (imageID !== mediaID) {
			setImageID(mediaID);
			setCrop({
				x: '',
				y: '',
				width: '',
				height: '',
			});
			deleteFile();
			onChange({
				image: {
					source_url: '',
					width: '',
					height: '',
				},
				crop: {
					unit: '',
					x: '',
					y: '',
					width: '',
					height: '',
					scale: 100,
				},
			});
		}
	}, [imageID, mediaID]);

	const getScale = () => {
		return cropOptionsValue.crop.scale / 100;
	};

	const scaleX = () => {
		return image.naturalWidth / image.width;
	};

	const scaleY = () => {
		return image.naturalHeight / image.height;
	};

	const getX = () => {
		return cropOptionsValue.crop.x * scaleX();
	};

	const getY = () => {
		return cropOptionsValue.crop.y * scaleY();
	};

	const getWidth = () => {
		return (cropOptionsValue.crop.width * scaleX()).toFixed(0);
	};

	const getHeight = () => {
		return (cropOptionsValue.crop.height * scaleY()).toFixed(0);
	};

	const getMimeType = () => {
		return originalImageData.mime_type;
	};

	const getFileDate = () => {
		const date = new Date(Date.now());
		const response =
			date.getDate().toString() +
			date.getMonth().toString() +
			date.getFullYear().toString() +
			date.getHours().toString() +
			date.getMinutes().toString() +
			date.getSeconds().toString();
		return response;
	};

	const getFileType = () => {
		let extension = originalImageData.file;
		extension = extension.substr(extension.lastIndexOf('.') + 1);
		return extension;
	};

	const getFileName = () => {
		let name = originalImageData.file;
		name = name.substr(0, name.lastIndexOf('.'));
		name = `${name}-crop-${(getWidth() * getScale()).toFixed(0)}-${(
			getHeight() * getScale()
		).toFixed(0)}-${getFileDate()}.${getFileType()}`;
		return name;
	};

	const getOldFile = () => {
		if (isEmpty(cropOptionsValue)) return '';
		return cropOptionsValue.image.source_url;
	};

	const saveData = crop => {
		if (crop) {
			cropOptionsValue.crop.x = crop.width ? crop.x : 0;
			cropOptionsValue.crop.y = crop.height ? crop.y : 0;
			cropOptionsValue.crop.width = crop.width ? crop.width : image.width;
			cropOptionsValue.crop.height = crop.height
				? crop.height
				: image.height;
			cropOptionsValue.image.width = crop.width
				? crop.width
				: image.width;
			cropOptionsValue.image.height = crop.height
				? crop.height
				: image.height;
		}

		onChange(cropOptionsValue);
	};

	const onImageLoad = image => {
		setImage(image);
		cropOptionsValue.crop.width = image.width;
		cropOptionsValue.crop.height = image.height;
		cropOptionsValue.image.width = image.width;
		cropOptionsValue.image.height = image.height;

		onChange(cropOptionsValue);

		return false;
	};

	const onInputChange = (target, value) => {
		cropOptionsValue.crop[target] = value;
		onChange(cropOptionsValue);
		cropper();
	};

	const onCropComplete = crop => {
		saveData(crop);
		setData();
		cropper();
	};

	const setData = () => {
		setOriginalImageData(
			imageData ? imageData.media_details.sizes.full : ''
		);
	};

	const cropper = () => {
		const hiddenCanvas = document.createElement('canvas');
		const hiddenCtx = hiddenCanvas.getContext('2d');
		hiddenCanvas.width = getWidth() * getScale();
		hiddenCanvas.height = getHeight() * getScale();

		hiddenCtx.drawImage(
			image,
			getX(),
			getY(),
			getWidth(),
			getHeight(),
			0,
			0,
			getWidth() * getScale(),
			getHeight() * getScale()
		);

		hiddenCanvas.toBlob(blob => {
			const newImage = new File([blob], getFileName(), {
				type: getMimeType(),
				lastModified: Date.now(),
			});

			const data = new FormData();
			data.append('file', newImage);
			data.append('old_media_src', getOldFile());

			fetch(
				`${
					// eslint-disable-next-line no-undef
					window.location.origin + ajaxurl
				}?action=gx_add_custom_image_size`,
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
					cropOptionsValue.image.source_url = res.url;
					onChange(cropOptionsValue);
				})
				.catch(err => {
					console.error(
						__(`Error cropping the image: ${err}`, 'maxi-blocks')
					);
				});
		});
	};

	const deleteFile = () => {
		const data = new FormData();
		data.append('old_media_src', getOldFile());

		fetch(
			`${
				// eslint-disable-next-line no-undef
				window.location.origin + ajaxurl
			}?action=gx_remove_custom_image_size`,
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
	};

	return (
		<div className={classes}>
			{imageData && (
				<Fragment>
					<ReactCrop
						src={imageData.media_details.sizes.full.source_url}
						crop={crop}
						onImageLoaded={image => onImageLoad(image)}
						onChange={crop => setCrop(crop)}
						onComplete={crop => onCropComplete(crop)}
						keepSelection={false}
					/>
					{image && (
						<div className='maxi-image-crop-control__options'>
							<GeneralInput
								target='width'
								value={
									cropOptionsValue.crop.width *
									scaleX() *
									getScale()
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
									cropOptionsValue.crop.height *
									scaleY() *
									getScale()
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
								value={cropOptionsValue.crop.x}
								onChange={value => onInputChange('x', value)}
							/>
							<GeneralInput
								target='y'
								value={cropOptionsValue.crop.y}
								onChange={value => onInputChange('y', value)}
							/>
							<GeneralInput
								target='scale'
								value={Number(cropOptionsValue.crop.scale)}
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
