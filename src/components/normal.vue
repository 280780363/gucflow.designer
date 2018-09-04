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
                <path d="M762.7,532.6c-5-1.6-38,8.8-14.9-63.1h-0.3c50.9-71.9,89.7-133.1,89.7-216.1c0-127.6-84.9-192.7-183.5-192.7c-17.5,0-34.4,3.7-50.6,8c39.6,36.3,65.2,86.5,65.2,159.8c0,92.2-20.8,179-77.2,254.7c-21.9,27.5-15.4,71.1,7,77C720.5,593,822.9,673.8,851.3,754.2l2.4,22.5c0,31.8-37.8,59.1-52.9,78.6C912.4,844,990,815,990,749.3v-25.1C990,654.9,871,568.5,762.7,532.6z M511.7,599.4c-5.4-1.8-40.1-17.5-18.5-83.3h-0.3c56.5-58.2,99.7-151.9,99.7-244c0-141.7-94.2-216-203.8-216c-109.5,0-203.3,74.3-203.3,216c0,92.6,42.9,186.6,99.8,244.6c22.2,58.1-17.5,79.7-25.8,82.7C144.6,640.9,10,716.5,10,791.2v27.9C10,920.9,207.2,944,389.7,944c182.7,0,377.5-23.2,377.5-124.9v-27.9C767.3,714.3,632.1,639.2,511.7,599.4z" />
            </g>
        </svg>
    </g>
</template>
<script>
export default {
    props: ['x', 'y', 'width', 'height'],
};
</script>