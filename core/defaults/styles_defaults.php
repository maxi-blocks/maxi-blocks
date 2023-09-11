<?php
class StylesDefaults
{
    public $transitionDefault;

    public function __construct()
    {
        // Define the transitionDefault associative array
        $this->transitionDefault  = [
            'canvas' => [
                'border' => [
                    'title' => 'Border',
                    'target' => ['', ' > .maxi-background-displayer'],
                    'property' => ['border', 'border-radius', 'top', 'left'],
                    'hoverProp' => 'border-status-hover',
                ],
                'box shadow' => [
                    'title' => 'Box shadow',
                    'target' => '',
                    'property' => 'box-shadow',
                    'hoverProp' => 'box-shadow-status-hover',
                ],
                'background / layer' => [
                    'title' => 'Background / Layer',
                    'target' => [' > .maxi-background-displayer > div', ' > .maxi-background-displayer > div > svg'],
                    'property' => false,
                    'hoverProp' => 'block-background-status-hover',
                ],
                'opacity' => [
                    'title' => 'Opacity',
                    'target' => '',
                    'property' => 'opacity',
                    'hoverProp' => 'opacity-status-hover',
                ],
            ],
        ];
    }
}
