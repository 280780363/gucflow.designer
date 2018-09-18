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
                <path d="M500,10C229.4,10,10,229.4,10,500s219.4,490,490,490s490-219.4,490-490S770.6,10,500,10z M500,945.5C254,945.5,54.5,746,54.5,500C54.5,254,254,54.5,500,54.5C746,54.5,945.5,254,945.5,500C945.5,746,746,945.5,500,945.5z" />
                <path d="M321.8,321.8h356.4v356.4H321.8V321.8z" />
            </g>
        </svg>
    </g>
</template>
<script>
export default {
    props: ['x', 'y', 'width', 'height'],
};
</script>