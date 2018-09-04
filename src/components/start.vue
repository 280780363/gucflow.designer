<template>
    <g>
        <rect :width="width" :height="height" :x="x-width/2" :y="y-height/2" rx="2" ry="2" stroke-width="2" fill="transparent" stroke-dasharray="0" />
        <text :x="x" :y="y+2" text-anchor="middle" font-size="14" stroke-width="0">
            <slot></slot>
        </text>
        <!-- <image xlink:href="../assets/normalNode.png" :x="x-width/2+2" :y="y-height/2+2" height="18" width="18" /> -->
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :x="x-width/2+2" :y="y-height/2+2" height="18" width="18" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
            <metadata> Svg Vector Icons : http://www.sfont.cn </metadata>
            <g>
                <path d="M500,10C229,10,10,229,10,500s219,490,490,490s490-219,490-490S771,10,500,10z M500,937.9c-241.9,0-437.9-196-437.9-437.9S258.1,60.5,500,60.5s437.9,196,437.9,437.9S741.9,937.9,500,937.9z M383.6,706.7L771,500L383.6,293.3V706.7z" />
            </g>
        </svg>
    </g>
</template>
<script>
export default {
    props: ['x', 'y', 'width', 'height'],
};
</script>