import { __ } from '@wordpress/i18n';
import { ToolbarGroup } from '@wordpress/components';
import { reset } from '@wordpress/icons';

export default function ButtonControl( { value, onChange } ) {
    return (
        <ToolbarGroup
            controls={ [
                {
                    icon: reset,
                    title: __( 'Reset', 'maxi-blocks' ),
                    onClick: () => onChange( '' ),
                    isActive: value !== '',
                },
            ] }
        />
    );
}
