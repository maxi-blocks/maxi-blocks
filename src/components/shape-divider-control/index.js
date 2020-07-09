/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    RangeControl,
    SelectControl,
    RadioControl,
    Dropdown,
    Button,
} = wp.components;

/**
 * Internal dependencies
 */
import { MaxiComponent } from '../index';
//import { shapeDivider } from '../../extensions/styles/defaults';
import {
    BackgroundControl,
    SizeControl,
} from '../../components';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    alignLeft,
    alignRight,
    alignCenter,
    alignJustify,
} from '../../icons';
import { Icon } from '@wordpress/icons';

/**
 * Component
 */
export default class ShapeDividerControl extends MaxiComponent {

    render() {

        const {
            shapeDividerOptions,
            onChange,
        } = this.props;

        let value = typeof shapeDividerOptions === 'object' ?
        shapeDividerOptions :
        JSON.parse(shapeDividerOptions);

        const getOptions = () => {
            let options = [];
            options.push({ label: <Icon icon={alignLeft} />, value: 'left' });
            options.push({ label: <Icon icon={alignCenter} />, value: 'center' });
            options.push({ label: <Icon icon={alignRight} />, value: 'right' });
            options.push({ label: <Icon icon={alignJustify} />, value: 'justify' })

            return options;
        }

        return (
            <div>
                <Dropdown
                    className="my-container-class-name"
                    contentClassName="my-popover-content-classname"
                    position="bottom center"
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <Button isPrimary onClick={ onToggle } aria-expanded={ isOpen }>
                            Toggle Popover!
                        </Button>
                    ) }
                    renderContent={ () => (
                        <RadioControl
                            //label={ label }
                            //className={classes}
                            //selected={value}
                            options={getOptions()}
                            //onChange={value => onChange(value)}
                        />
                    ) }
                />
                <RangeControl
                    label={__('Opacity', 'maxi-blocks')}
                    className='maxi-opacity-control'
                    value={value.opacity * 100}
                    onChange={val => {
                        value.opacity = val / 100;
                        onChange(JSON.stringify(value))
                    }}
                    min={0}
                    max={100}
                    allowReset={true}
                    initialPosition={0}
                />
                {/* <BackgroundControl
                    backgroundOptions={{background}}
                    onChange={background => setAttributes({ background })}
                    disableImage
                    disableVideo
                /> */}
                <SizeControl
                    label={__('Divider Height', 'maxi-blocks')}
                    unit={value.heightUnit}
                    onChangeUnit={val => {
                        value.heightUnit = val;
                        onChange(JSON.stringify(value))
                    }}
                    value={value.height}
                    onChangeValue={val => {
                        value.height = val;
                        onChange(JSON.stringify(value))
                    }}
                />
                <SelectControl
                    label={__('Direction', 'maxi-blocks')}
                    //value={}
                    options={[
                        { label: 'Scale Up', value: 'xxx' },
                    ]}
                    //onChange={}
                />
                <SizeControl
                    label={__('Speed', 'maxi-blocks')}
                    unit='%'
                    onChangeUnit={value => onChangeValue('max-widthUnit', value)}
                    value={0}
                    //onChangeValue={value => onChangeValue('max-width', value)}
                />
            </div>
        )
    }

}