<?php

function maxi_blocks_allowed_html()
{
    $allowed_tags = array(
        'address'    => array(),
        'a'          => array(
            'id'       => true,
            'class'    => true,
            'href'     => true,
            'rel'      => true,
            'rev'      => true,
            'name'     => true,
            'target'   => true,
            'download' => array(
                'valueless' => 'y',
            ),
        ),
        'abbr'       => array(),
        'acronym'    => array(),
        'area'       => array(
            'alt'    => true,
            'coords' => true,
            'href'   => true,
            'nohref' => true,
            'shape'  => true,
            'target' => true,
        ),
        'article'    => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'aside'      => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'audio'      => array(
            'autoplay' => true,
            'controls' => true,
            'loop'     => true,
            'muted'    => true,
            'preload'  => true,
            'src'      => true,
        ),
        'b'          => array(),
        'bdo'        => array(
            'dir' => true,
        ),
        'big'        => array(),
        'blockquote' => array(
            'cite'     => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'br'         => array(),
        'button'     => array(
            'disabled' => true,
            'name'     => true,
            'type'     => true,
            'value'    => true,
            'id'       => true,
            'class'    => true,
            'data-filename' => true,
        ),
        'caption'    => array(
            'align' => true,
        ),
        'cite'       => array(
            'dir'  => true,
            'lang' => true,
        ),
        'code'       => array(),
        'col'        => array(
            'align'   => true,
            'char'    => true,
            'charoff' => true,
            'span'    => true,
            'dir'     => true,
            'valign'  => true,
            'width'   => true,
        ),
        'colgroup'   => array(
            'align'   => true,
            'char'    => true,
            'charoff' => true,
            'span'    => true,
            'valign'  => true,
            'width'   => true,
        ),
        'del'        => array(
            'datetime' => true,
        ),
        'dd'         => array(),
        'dfn'        => array(),
        'details'    => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'open'     => true,
            'xml:lang' => true,
        ),
        'div'        => array(
            'id'       => true,
            'class'    => true,
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'dl'         => array(),
        'dt'         => array(),
        'em'         => array(),
        'fieldset'   => array(),
        'figure'     => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'figcaption' => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'font'       => array(
            'color' => true,
            'face'  => true,
            'size'  => true,
        ),
        'footer'     => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'h1'         => array(
            'id'       => true,
            'class'    => true,
            'align' => true,
        ),
        'h2'         => array(
            'id'       => true,
            'class'    => true,
            'align' => true,
        ),
        'h3'         => array(
            'id'       => true,
            'class'    => true,
            'align' => true,
        ),
        'h4'         => array(
            'id'       => true,
            'class'    => true,
            'align' => true,
        ),
        'h5'         => array(
            'id'       => true,
            'class'    => true,
            'align' => true,
        ),
        'h6'         => array(
            'id'       => true,
            'class'    => true,
            'align' => true,
        ),
        'header'     => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'hgroup'     => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'hr'         => array(
            'align'   => true,
            'noshade' => true,
            'size'    => true,
            'width'   => true,
        ),
        'i'          => array(),
        'img'        => array(
            'id'       => true,
            'class'    => true,
            'alt'      => true,
            'align'    => true,
            'border'   => true,
            'height'   => true,
            'hspace'   => true,
            'loading'  => true,
            'longdesc' => true,
            'vspace'   => true,
            'src'      => true,
            'usemap'   => true,
            'width'    => true,
        ),
        'ins'        => array(
            'datetime' => true,
            'cite'     => true,
        ),
        'g'        => array(
            'class'    => true,
            'd'    => true,
            'fill' => true,
            'stroke' => true,
            'data-fill'     => true,
            'data-stroke'       => true,
        ),
        'kbd'        => array(),
        'label'      => array(
            'for' => true,
        ),
        'legend'     => array(
            'align' => true,
        ),
        'li'         => array(
            'align' => true,
            'value' => true,
        ),
        'map'        => array(
            'name' => true,
        ),
        'mark'       => array(),
        'menu'       => array(
            'type' => true,
        ),
        'nav'        => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'option'       => array(
            'id'       => true,
            'class'    => true,
            'value'    => true,
            'name'      => true,
        ),
        'p'          => array(
            'id'       => true,
            'class'    => true,
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'pre'        => array(
            'width' => true,
        ),
        'q'          => array(
            'cite' => true,
        ),
        'path'          => array(
            'class'    => true,
            'd'    => true,
            'fill' => true,
            'stroke' => true,
            'data-fill'     => true,
            'data-stroke'       => true,
        ),
        's'          => array(),
        'samp'       => array(),
        'script'       => array(),
        'select'       => array(
            'id'       => true,
            'class'    => true,
            'onchange'    => true,
            'name'      => true,
        ),
        'span'       => array(
            'id'       => true,
            'class'    => true,
            'style'    => true,
            'dir'      => true,
            'align'    => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'section'    => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'small'      => array(),
        'strike'     => array(),
        'strong'     => array(),
        'sub'        => array(),
        'summary'    => array(
            'align'    => true,
            'dir'      => true,
            'lang'     => true,
            'xml:lang' => true,
        ),
        'sup'        => array(),
        'style'        => array(),
        'svg'      => array(
            'class'    => true,
            'width'       => true,
            'height'     => true,
            'stroke'      => true,
            'fill' => true,
            'stroke-width' => true,
            'stroke-linejoin'         => true,
            'stroke-miterlimit'       => true,
            'data-fill'     => true,
            'data-stroke'       => true,
        ),
        'table'      => array(
            'id'       => true,
            'class'    => true,
            'align'       => true,
            'bgcolor'     => true,
            'border'      => true,
            'cellpadding' => true,
            'cellspacing' => true,
            'dir'         => true,
            'rules'       => true,
            'summary'     => true,
            'width'       => true,
        ),
        'tbody'      => array(
            'id'       => true,
            'class'    => true,
            'align'   => true,
            'char'    => true,
            'charoff' => true,
            'valign'  => true,
        ),
        'td'         => array(
            'id'       => true,
            'class'    => true,
            'abbr'    => true,
            'align'   => true,
            'axis'    => true,
            'bgcolor' => true,
            'char'    => true,
            'charoff' => true,
            'colspan' => true,
            'dir'     => true,
            'headers' => true,
            'height'  => true,
            'nowrap'  => true,
            'rowspan' => true,
            'scope'   => true,
            'valign'  => true,
            'width'   => true,
        ),
        'textarea'   => array(
            'id'       => true,
            'class'    => true,
            'cols'     => true,
            'rows'     => true,
            'disabled' => true,
            'name'     => true,
            'readonly' => true,
        ),
        'tfoot'      => array(
            'id'       => true,
            'class'    => true,
            'align'   => true,
            'char'    => true,
            'charoff' => true,
            'valign'  => true,
        ),
        'th'         => array(
            'id'       => true,
            'class'    => true,
            'abbr'    => true,
            'align'   => true,
            'axis'    => true,
            'bgcolor' => true,
            'char'    => true,
            'charoff' => true,
            'colspan' => true,
            'headers' => true,
            'height'  => true,
            'nowrap'  => true,
            'rowspan' => true,
            'scope'   => true,
            'valign'  => true,
            'width'   => true,
        ),
        'thead'      => array(
            'id'       => true,
            'class'    => true,
            'align'   => true,
            'char'    => true,
            'charoff' => true,
            'valign'  => true,
        ),
        'title'      => array(),
        'tr'         => array(
            'id'       => true,
            'class'    => true,
            'align'   => true,
            'bgcolor' => true,
            'char'    => true,
            'charoff' => true,
            'valign'  => true,
        ),
        'track'      => array(
            'default' => true,
            'kind'    => true,
            'label'   => true,
            'src'     => true,
            'srclang' => true,
        ),
        'tt'         => array(),
        'u'          => array(),
        'ul'         => array(
            'id'       => true,
            'class'    => true,
            'type' => true,
        ),
        'ol'         => array(
            'id'       => true,
            'class'    => true,
            'start'    => true,
            'type'     => true,
            'reversed' => true,
        ),
        'var'        => array(),
        'video'      => array(
            'autoplay'    => true,
            'controls'    => true,
            'height'      => true,
            'loop'        => true,
            'muted'       => true,
            'playsinline' => true,
            'poster'      => true,
            'preload'     => true,
            'src'         => true,
            'width'       => true,
        ),
        'iframe' => array(
            'class'  => true,
            'id'     => true,
            'name'   => true,
            'style'  => true,
            'height' => true,
            'src'    => true,
            'width'  => true,
            'allowfullscreen'  => true,
            'frameborder'  => true,
            'allow'  => true,
        ),
        'input' => array(
            'class'  => true,
            'id'     => true,
            'name'   => true,
            'type'   => true,
            'value' => true,
            'checked' => true,
            'min' => true,
        ),
        'label' => array(
            'class'  => true,
            'id'     => true,
            'name'   => true,
            'for'   => true,
        ),
    );

    return $allowed_tags;
}
