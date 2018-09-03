<template>
    <g>
        <circle ellipse :r="width/2" :cx="x" :cy="y" stroke-width="2" fill="transparent" stroke-dasharray="0" />
        <polygon fill-opacity="0.2" stroke-width="0" fill="#CC0000" :points="points" />
        <text :x="x" :y="y+2" text-anchor="middle" font-size="14" font-weight="bold" stroke-width="0">
            <slot></slot>
        </text>
    </g>
</template>
<script>
export default {
    props: ['x', 'y', 'width', 'height'],
    computed: {
        points() {
            let w = this.width / 4.5;
            return `${this.x - w},${this.y - w} ${this.x + w},${this.y -
                w} ${this.x + w},${this.y + w} ${this.x - w},${this.y + w}`;
        },
    },
};
</script>