import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { AdminSettings } from '@wordpress/icons';
import { Fragment } from '@wordpress/element';

const {
    RangeControl,
    SelectControl,
    TextareaControl,
    TextControl,
    RadioControl,
} = wp.components;

const PluginSidebarMoreMenuItemTest = () => (
    <Fragment>
        <PluginSidebarMoreMenuItem
            target='maxi-blocks--customizer-sidebar'
            icon={AdminSettings}
        >
            Style Card Editor
        </PluginSidebarMoreMenuItem>
        <PluginSidebar
            name='maxi-blocks--customizer-sidebar'
            icon={AdminSettings}
            title='Style Card Editor'
        >
            <SelectControl
                value='full'
                options={[
                    { label: __('No', 'maxi-blocks'), value: 'normal' },
                    { label: __('Yes', 'maxi-blocks'), value: 'full' },
                ]}
                // onChange={imageSize => setAttributes({ imageSize })}
            />
        </PluginSidebar>
    </Fragment>
);

registerPlugin('maxi-blocks-customizer-sidebar', {
    render: PluginSidebarMoreMenuItemTest,
});
