<template>
    <g>
        <rect :width="width" :height="height" :x="x-width/2" :y="y-height/2" rx="2" ry="2" stroke-width="2" fill="transparent" stroke-dasharray="0" />
        <text :x="x" :y="y+2" text-anchor="middle" font-size="12" stroke-width="0">
            <slot></slot>
        </text>
        <image xlink:href="../assets/normalNode.png" :x="x-width/2+2" :y="y-height/2+2" height="18" width="18" />
    </g>
</template>
<script>
export default {
    props: ['x', 'y', 'width', 'height'],
};
</script>