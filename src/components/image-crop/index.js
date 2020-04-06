/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Spinner } = wp.components;
const {
    Component,
    Fragment
} = wp.element;
const {
    withSelect,
    dispatch,
    select
} = wp.data;

/**
 * External dependencies
 */
import ReactCrop from 'react-image-crop';
import {
    debounce,
    capitalize,
    isNil
} from 'lodash';


/**
 * Styles
 */
import './editor.scss';

/**
 * Block
 */

const GeneralInput = props => {
    const {
        target,
        value,
        onChange
    } = props;

    return (
        <label for={`gx-imagecrop-${target}-control`}>
            {capitalize(target)}
            <input
                type="number"
                id={`gx-imagecrop-${target}-control`}
                name={`gx-imagecrop-${target}-control`}
                value={value.toFixed(0)}
                onChange={e => onChange(parseInt(e.target.value))}
            />
        </label>
    )
}

class ImageCrop extends Component {

    componentDidMount() {
        this.forceUpdate();     // solves issue when diselecting and selecting block again
        this.blockId = select('core/block-editor').getSelectedBlockClientId();
    }

    componentWillUnmount() {
        if (isNil(select('core/block-editor').getBlocksByClientId(this.blockId)[0])) {
            this.deleteFile(this.props.imageData);
        }
    }

    state = {
        crop: {
            unit: 'px',
            x: this.props.cropOptions ? this.props.cropOptions.crop.x : 0,
            y: this.props.cropOptions ? this.props.cropOptions.crop.y : 0,
            width: this.props.cropOptions ? this.props.cropOptions.crop.width : 0,
            height: this.props.cropOptions ? this.props.cropOptions.crop.height : 0,
        },
        scale: this.props.cropOptions ? this.props.cropOptions.scale : 100,
    }

    get getScale() {
        return this.state.scale / 100;
    }

    get scaleX() {
        return this.image.naturalWidth / this.image.width;
    }

    get scaleY() {
        return this.image.naturalHeight / this.image.height;
    }

    get getX() {
        return this.state.crop.x * this.scaleX;
    }

    get getY() {
        return this.state.crop.y * this.scaleY;
    }

    get getWidth() {
        return (this.state.crop.width * this.scaleX).toFixed(0);
    }

    get getHeight() {
        return (this.state.crop.height * this.scaleY).toFixed(0);
    }

    get getMimeType() {
        return this.originalImageData.mime_type;
    }

    get getFileType() {
        let extension = this.originalImageData.file;
        extension = extension.substr(extension.lastIndexOf('.') + 1);
        return extension;
    }

    get getFileName() {
        let name = this.originalImageData.file;
        name = name.substr(0, name.lastIndexOf('.'));
        name = `${name}-crop-${(this.getWidth * this.getScale).toFixed(0)}-${(this.getHeight * this.getScale).toFixed(0)}-${Date.now()}.${this.getFileType}`;
        return name;
    }

    get getFilePath() {
        let path = this.originalImageData.source_url.substr(0, this.originalImageData.source_url.lastIndexOf('/'));
        return path;
    }

    get getOldFileName() {
        if(
            !this.imageData.media_details.sizes.custom ||
            !this.imageData.media_details.sizes.custom.source_url ||
            this.imageData.media_details.sizes.custom.source_url === this.imageData.media_details.sizes.full.source_url
        )
            return '';
        else
            return this.imageData.media_details.sizes.custom.source_url; 
    }

    onImageLoad(image) {
        this.image = image;
        this.mediaID = this.props.mediaID;
        return false;
    }

    onCropComplete() {
        this.setData();
        this.props.onChange(this.imageData, this.state);
        this.createHiddenCanvas();
        this.cropper();
        this.uploadNewFile();
    }

    debounceComplete = debounce(this.onCropComplete.bind(this), 1000);

    onInputChange(target, value) {
        let crop = this.state.crop;
        crop[target] = value;
        this.setState({ crop });
        this.debounceComplete();
    }

    onScaleChange(scale) {
        this.setState({ scale });
        this.debounceComplete();
    }

    setData() {
        this.imageData = this.props.imageData;
        this.originalImageData = this.imageData ? this.imageData.media_details.sizes.full : '';
    }

    createHiddenCanvas() {
        this.hiddenCanvas = document.createElement("canvas");
        this.hiddenCtx = this.hiddenCanvas.getContext("2d");
        this.hiddenCanvas.width = this.getWidth * this.getScale;
        this.hiddenCanvas.height = this.getHeight * this.getScale;
    }

    cropper() {
        this.hiddenCtx.drawImage(
            this.image,
            this.getX,
            this.getY,
            this.getWidth,
            this.getHeight,
            0,
            0,
            this.getWidth * this.getScale,
            this.getHeight * this.getScale,
        );
    }

    uploadNewFile() {
        this.hiddenCanvas.toBlob(blob => {
            const newImage = new File(
                [blob],
                this.getFileName,
                {
                    type: this.getMimeType,
                    lastModified: Date.now()
                }
            )

            var data = new FormData();
            data.append('id', this.mediaID);
            data.append('name', this.getFileName);
            data.append('width', this.getWidth);
            data.append('height', this.getHeight);
            data.append('mime_type', this.getMimeType);
            data.append('file', newImage);
            data.append('old_media_src', this.getOldFileName)

            fetch(
                window.location.origin + ajaxurl + '?action=gx_add_custom_image_size',
                {
                    method: 'POST',
                    data: data,
                    body: data
                }
            ).then(() => {
                this.imageData.media_details.sizes.custom = {
                    file: this.getFileName,
                    width: this.getWidth,
                    height: this.getHeight,
                    mime_type: this.getMimeType,
                    source_url: this.getFilePath + this.getFileName,
                }
                this.saveMedia(this.imageData);
            }).catch(err => {
                console.log(__('Error croping the image: ' + err, 'gutenberg-extra'));
            })
        })
    }

    deleteFile(imageData) {
        delete imageData.media_details.sizes.custom;

        var data = new FormData();
        data.append('id', imageData.id);

        fetch(
            window.location.origin + ajaxurl + '?action=gx_remove_custom_image_size',
            {
                method: 'POST',
                data: data,
                body: data
            }
        ).then(() => {
            this.saveMedia(imageData);
        }).catch(err => {
            console.log(__('Error croping the image: ' + err, 'gutenberg-extra'));
        })
    }

    async saveMedia(imageData) {
        imageData.status = 'publish';
        dispatch('core').saveMedia(imageData)
    }

    render() {
        const { imageData } = this.props;

        return (
            <div className="gx-imagecrop-control">
                {imageData &&
                    <Fragment>
                        <ReactCrop
                            src={imageData.media_details.sizes.full.source_url}
                            crop={this.state.crop}
                            onImageLoaded={image => this.onImageLoad(image)}
                            onChange={crop => this.setState({ crop })}
                            onComplete={crop => this.onCropComplete(crop)}
                        />
                        {this.image &&
                            <div className="gx-imagecrop-option-controls" >
                                <GeneralInput
                                    target='width'
                                    value={this.state.crop.width * this.scaleX * this.getScale}
                                    onChange={value => this.onInputChange('width', value / this.scaleX / this.getScale)}
                                />
                                <GeneralInput
                                    target='height'
                                    value={this.state.crop.height * this.scaleY * this.getScale}
                                    onChange={value => this.onInputChange('height', value / this.scaleY / this.getScale)}
                                />
                                <GeneralInput
                                    target='x'
                                    value={this.state.crop.x}
                                    onChange={value => this.onInputChange('x', value)}
                                />
                                <GeneralInput
                                    target='y'
                                    value={this.state.crop.y}
                                    onChange={value => this.onInputChange('y', value)}
                                />
                                <GeneralInput
                                    target='scale'
                                    value={this.state.scale}
                                    onChange={scale => this.onScaleChange(scale)}
                                />
                            </div>
                        }
                    </Fragment>
                }
                {!imageData &&
                    <Spinner />
                }
            </div>
        )
    }

}

export default ImageCrop = withSelect((select, ownProps) => {
    const {
        mediaID = ownProps.mediaID
    } = ownProps;
    const imageData = select('core').getMedia(mediaID);
    return {
        imageData,
    }
})(ImageCrop)
