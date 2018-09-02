<template>
    <div>
        <div id="toolbar" style="text-align:left">
            <button type="button" @click="tempData.mode='select'">选择</button>
            <button type="button" @click="tempData.mode='connect'">连接</button>
            <span>|</span>
            <button type="button" @click="tempData.mode='delete'">删除</button>
        </div>
        <div id="container">
            <div :style="{width:paperWidth+'px',height:paperHeight+'px'}" class="backgroud">
            </div>
            <svg :width="paperWidth" :height="paperHeight" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" @mousemove="moving($event)" @mouseup="drop($event)">
                <defs>
                    <marker id="arrow-unselect" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
                        <path stroke="none" class='unselect' transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
                    </marker>
                    <marker id="arrow-select" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
                        <path stroke="none" class='select' transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
                    </marker>
                </defs>
                <g v-for="item in nodes" :key="'node'+item.id" :id="item.id" class="pointer" @dblclick="nodeDblClick(item)" @mousedown="beginMove($event)" @click="select('node',item.id)" :class="tempData.currentSelect.type=='node'&&tempData.currentSelect.id==item.id?'select':'unselect'">
                    <rect :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y" rx="2" ry="2" stroke-width="2" fill="transparent" stroke-dasharray="0" />1
                    <text :x="item.x+item.nodeWidth/2" :y="item.y+item.nodeHeight/2" text-anchor="middle" font-size="12" stroke-width="0">
                        {{item.text}}
                    </text>
                </g>
                <g v-for="item in lines" :key="'line'+item.id" class="pointer" @dblclick="lineDblClick(item)" @click="select('line',item.id)" :class="tempData.currentSelect.type=='line'&&tempData.currentSelect.id==item.id?'select':'unselect'">
                    {{ lineData = getLineInfo(item)}}
                    <path :d="lineData.path" fill="none" stroke="transparent" stroke-width="10" />
                    <path :d="lineData.path" fill="none" stroke-width="2" :marker-end="tempData.currentSelect.type=='line'&&tempData.currentSelect.id==item.id?'url(#arrow-select)':'url(#arrow-unselect)'" />
                    <text :x="lineData.textx" :y="lineData.texty" text-anchor="middle" font-size="12" stroke-width="0">
                        {{item.text}}
                    </text>
                </g>
                <path :d="tempData.connectLine.path" v-if="tempData.connectLine.path" fill="none" class="unselect" stroke-width="2" marker-end="arrow-unselect" />
            </svg>
        </div>
    </div>
</template>
<script>
import common from '../utils/common.js';
const mode = {
    select: 'select',
    connect: 'connect',
};
const nodeType = {
    begin: 'begin', //开始
    end: 'end', //结束
    normal: 'normal', //普通类型
    switchStart: 'switchStart', //并行分支开始
    switchEnd: 'switchEnd', //并行分支结束
};
export default {
    data() {
        return {
            paperWidth: 1000,
            paperHeight: 600,
            tempData: {
                mode: mode.select,
                dragData: {
                    nodeid: null,
                    sourceMouseX: null,
                    sourceMouseY: null,
                },
                // 正在连接的连接线
                connectLine: {
                    path: null,
                    nodeId: null,
                },
                // 当前已选择的对象
                currentSelect: {
                    type: null,
                    id: null,
                },
            },
            nodes: [
                {
                    id: '1',
                    type: nodeType.begin,
                    text: '开始',
                    x: 10,
                    y: 10,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '2',
                    type: nodeType.normal,
                    text: '经理审批',
                    x: 200,
                    y: 10,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '3',
                    type: nodeType.normal,
                    text: '总监审批',
                    x: 500,
                    y: 10,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '4',
                    type: nodeType.normal,
                    text: '董事长审批',
                    x: 500,
                    y: 200,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '5',
                    type: nodeType.end,
                    text: '结束',
                    x: 500,
                    y: 300,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
            ],
            lines: [
                {
                    id: '1',
                    from: '1',
                    to: '2',
                    text: '开始到经理',
                },
                {
                    id: '2',
                    from: '2',
                    to: '3',
                    text: '经理到总监',
                },
                {
                    id: '3',
                    from: '3',
                    to: '4',
                    text: '总监到董事长',
                },
                {
                    id: '4',
                    from: '4',
                    to: '5',
                    text: '董事长到结束',
                },
            ],
        };
    },
    mounted() {
        // 拖动时取消选择文本
        document.getElementById('container').onselectstart = function() {
            return false;
        };
    },
    methods: {
        // 获取连接线 具体的path属性以及文本位置
        getLineInfo(line) {
            let fromNode = this.nodes.find(r => r.id == line.from);
            let toNode = this.nodes.find(r => r.id == line.to);

            let fromPoints = [
                {x: fromNode.x + fromNode.nodeWidth / 2, y: fromNode.y},
                {
                    x: fromNode.x + fromNode.nodeWidth / 2,
                    y: fromNode.y + fromNode.nodeHeight,
                },
                {x: fromNode.x, y: fromNode.y + fromNode.nodeHeight / 2},
                {
                    x: fromNode.x + fromNode.nodeWidth,
                    y: fromNode.y + fromNode.nodeHeight / 2,
                },
            ];

            let toPoints = [
                {x: toNode.x + toNode.nodeWidth / 2, y: toNode.y},
                {
                    x: toNode.x + toNode.nodeWidth / 2,
                    y: toNode.y + toNode.nodeHeight,
                },
                {x: toNode.x, y: toNode.y + toNode.nodeHeight / 2},
                {
                    x: toNode.x + toNode.nodeWidth,
                    y: toNode.y + toNode.nodeHeight / 2,
                },
            ];

            let lengArr = [];
            for (let i = 0; i < 4; i++) {
                let fromPoint = fromPoints[i];
                for (let j = 0; j < 4; j++) {
                    let toPoint = toPoints[j];
                    let length = Math.sqrt(
                        Math.pow(Math.abs(toPoint.x - fromPoint.x), 2) +
                            Math.pow(Math.abs(toPoint.y - fromPoint.y), 2)
                    );
                    lengArr.push({
                        fromIndex: i,
                        toIndex: j,
                        length: length,
                    });
                }
            }
            lengArr = lengArr.sort((a, b) => a.length - b.length);
            let result = lengArr[0];
            let fromx = fromPoints[result.fromIndex].x;
            let fromy = fromPoints[result.fromIndex].y;
            let tox = toPoints[result.toIndex].x;
            let toy = toPoints[result.toIndex].y;
            let textx = (tox + fromx) / 2;
            let texty = (toy + fromy) / 2;
            return {
                path: `M${fromx} ${fromy}L${tox} ${toy}`,
                textx,
                texty,
            };
        },
        beginMove(ev) {
            // 开始拖动 记录拖动数据
            if (this.tempData.mode == mode.select) {
                this.beginDrag(ev);
            } else if (this.tempData.mode == mode.connect) {
                this.beginConnect(ev);
            }
        },
        moving(ev) {
            if (this.tempData.mode == mode.select) this.dragMoving(ev);
            else if (this.tempData.mode == mode.connect) this.connectMoving(ev);
        },
        drop(ev) {
            if (this.tempData.mode == mode.select) this.dragDrop(ev);
            else if (this.tempData.mode == mode.connect) this.connectDrop(ev);
        },
        beginDrag(ev) {
            // 开始拖动 记录拖动数据
            this.tempData.dragData.nodeid = ev.target.parentNode.id;
            this.sourceMouseX = ev.screenX;
            this.sourceMouseY = ev.screenY;
        },
        beginConnect(ev) {
            this.tempData.connectLine.nodeId = ev.target.parentNode.id;
        },
        // 拖动移动
        dragMoving(ev) {
            if (!this.tempData.dragData.nodeid) return;
            // 鼠标偏移量
            let offsetX = ev.screenX - this.sourceMouseX;
            let offsetY = ev.screenY - this.sourceMouseY;
            // 拖动范围小于5 不处理
            if (Math.abs(offsetX) + Math.abs(offsetY) < 5) return;
            let node = this.nodes.find(
                r => r.id == this.tempData.dragData.nodeid
            );
            if (!node) return;
            node.x += offsetX;
            node.y += offsetY;
            this.extendPaperIfNeed(node);
            // 重置鼠标位置
            this.sourceMouseX = ev.screenX;
            this.sourceMouseY = ev.screenY;
        },
        // 拖动完成
        dragDrop() {
            // 拖动完成 情况拖动数据
            this.tempData.dragData = {};
        },
        // 连接移动
        connectMoving(ev) {
            let node = this.nodes.find(
                r => r.id == this.tempData.connectLine.nodeId
            );
            if (!node) return;
            let fromNode = node;
            let fromPoints = [
                {x: fromNode.x + fromNode.nodeWidth / 2, y: fromNode.y},
                {
                    x: fromNode.x + fromNode.nodeWidth / 2,
                    y: fromNode.y + fromNode.nodeHeight,
                },
                {x: fromNode.x, y: fromNode.y + fromNode.nodeHeight / 2},
                {
                    x: fromNode.x + fromNode.nodeWidth,
                    y: fromNode.y + fromNode.nodeHeight / 2,
                },
            ];
            let toPoints = [{x: ev.offsetX, y: ev.offsetY}];
            let lengArr = [];
            for (let i = 0; i < 4; i++) {
                let fromPoint = fromPoints[i];
                for (let j = 0; j < 1; j++) {
                    let toPoint = toPoints[j];
                    let length = Math.sqrt(
                        Math.pow(Math.abs(toPoint.x - fromPoint.x), 2) +
                            Math.pow(Math.abs(toPoint.y - fromPoint.y), 2)
                    );
                    lengArr.push({
                        fromIndex: i,
                        toIndex: j,
                        length: length,
                    });
                }
            }
            lengArr = lengArr.sort((a, b) => a.length - b.length);
            let result = lengArr[0];
            let fromx = fromPoints[result.fromIndex].x;
            let fromy = fromPoints[result.fromIndex].y;
            let tox = toPoints[result.toIndex].x;
            let toy = toPoints[result.toIndex].y;
            this.tempData.connectLine.path = `M${fromx} ${fromy}L${tox} ${toy}`;
        },
        // 连接完成
        connectDrop(ev) {
            let targetNode = this.getMousePointNode(ev);
            if (targetNode) {
                let exists = this.lines.some(
                    r =>
                        r.from == this.tempData.connectLine.nodeId &&
                        r.to == targetNode.id
                );
                debugger;
                if (
                    !exists &&
                    this.tempData.connectLine.nodeId != targetNode.id
                ) {
                    this.lines.push({
                        id: common.guid(),
                        from: this.tempData.connectLine.nodeId,
                        to: targetNode.id,
                        text: '',
                    });
                }
            }
            this.connectLine = {
                path: null,
                nodeId: null,
            };
        },
        // 节点双击事件
        nodeDblClient(node) {
            console.log(node);
        },
        // 连接线双击事件
        lineDblClient(line) {
            console.log(line);
        },
        // 获取鼠标事件当前位置的节点
        getMousePointNode(ev) {
            let x = ev.offsetX;
            let y = ev.offsetY;
            return this.nodes.find(
                r =>
                    x >= r.x &&
                    x <= r.x + r.nodeWidth &&
                    y >= r.y &&
                    y <= r.y + r.nodeHeight
            );
        },
        extendPaperIfNeed(node) {
            // 正在拖动,且拖出画布范围,将画布尺寸*2
            if (node.x + node.nodeWidth > this.paperWidth) this.paperWidth *= 2;
            if (node.y + node.nodeHeight > this.paperHeight)
                this.paperHeight *= 2;
        },
        select(type, id) {
            this.tempData.currentSelect.type = type;
            this.tempData.currentSelect.id = id;
        }
    },
};
</script>

<style lang="less" scoped>
@selectColor: rgb(49, 208, 198);
@unselectColor: #d9534f;

.pointer {
    cursor: pointer;
}

#container {
    position: relative;
    margin: 5px auto;
    border: @selectColor 1px solid;
    width: 1000px;
    height: 600px;
    overflow: auto;
    svg {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
    }
    .backgroud {
        position: 'absolute';
        top: 0;
        left: 0;
        z-index: -1;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzIGlkPSJ2LTYiPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3QgaWQ9InYtOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtMTAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==');
    }
}

.select {
    fill: @unselectColor;
    stroke: @unselectColor;
}
.unselect {
    fill: @selectColor;
    stroke: @selectColor;
}
</style>
