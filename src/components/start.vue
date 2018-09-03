<template>
    <g>
        <circle ellipse :r="width/2" :cx="x" :cy="y" stroke-width="2" fill="transparent" stroke-dasharray="0" />
        <polygon fill-opacity="0.3" stroke-width="0" fill="#00CC99" :points="points" />
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
            let w = this.width / 3 * Math.cos(Math.PI / 3);
            let h = this.width / 3 * Math.sin(Math.PI / 3);
            return `${this.x - w},${this.y - h} ${this.x + this.width / 3},${
                this.y
            } ${this.x - w},${this.y + h} `;
        },
    },
};
</script>