import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { GradientPickerPopover } from 'react-linear-gradient-picker';
// import './index.css';

const addOpacityToHex = (color, opacity = 1) => {
    if (opacity === 1 || color.length > 9) {
        return color;
    }

    return color + Math.floor(opacity * 255).toString(16);
};

const WrappedSketchPicker = ({ onSelect, ...rest }) => (
    <SketchPicker {...rest}
                  color={addOpacityToHex(rest.color, rest.opacity)}
                  onChange={c => {
                      const { rgb } = c;
                      const rgba = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
                      onSelect(rgba, rgb.a);
                  }}
    />
);

const initialPallet = [
    { offset: '0.00', color: 'rgb(238, 241, 11, 1)' },
    { offset: '1.00', color: 'rgb(126, 32, 207, 1)' }
];

const GradientPicker = (props) => {
    const [open, setOpen] = useState(false);
    const [angle, setAngle] = useState(90);
    const [palette, setPalette] = useState( props.palette ?  props.palette : initialPallet);

    // will get changed pallets
    const handlePaletteChange = event => {
        setPalette(event);
        if(props.onPaletteChange !== undefined)
            props.onPaletteChange(event);
    };

    return (
        <GradientPickerPopover {...{
            open,
            setOpen,
            angle,
            setAngle,
            showAnglePicker: true,
            width: 220,
            maxStops: initialPallet.length,
            paletteHeight: 32,
            palette,
            onPaletteChange: handlePaletteChange
        }}
        >
            <WrappedSketchPicker/>
        </GradientPickerPopover>
    );
};

export default function ({ ...props }) {
    return <GradientPicker  { ...props } />;
}