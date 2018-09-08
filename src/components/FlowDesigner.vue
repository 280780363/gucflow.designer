<template>
    <div>

        <div id="container" :style="{width:paperWidth+60+'px',height:paperHeight+'px'}">
            <div id="toolbar">
                <div @click="switchMode('select','mode-select')" id="mode-select" :class="{current:tempData.mode.currentDivId=='mode-select'}">
                    <img src="../assets/mouse.svg">
                    <p>选择</p>
                </div>
                <div @click="switchMode('connect','mode-connect')" id="mode-connect" :class="{current:tempData.mode.currentDivId=='mode-connect'}">
                    <img src="../assets/connect.svg">
                    <p>连接</p>
                </div>
                <hr/>
                <div @click="switchMode('addNode','mode-add-normal','normal','任务')" id="mode-add-normal" :class="{current:tempData.mode.currentDivId=='mode-add-normal'}">
                    <img src="../assets/users1.svg">
                    <p>任务</p>
                </div>
                <div @click="switchMode('addNode','mode-add-switchBegin','switchBegin','分支')" id="mode-add-switchBegin" :class="{current:tempData.mode.currentDivId=='mode-add-switchBegin'}">
                    <img src="../assets/branch.svg">
                    <p>分支</p>
                </div>
                <div @click="switchMode('addNode','mode-add-switchEnd','switchEnd','合并')" id="mode-add-switchEnd" :class="{current:tempData.mode.currentDivId=='mode-add-switchEnd'}">
                    <img src="../assets/merge.svg">
                    <p>合并</p>
                </div>
                <div @click="switchMode('addNode','mode-add-switchBeginAndEnd','switchBeginAndEnd','分支合并')" id="mode-add-switchBeginAndEnd" :class="{current:tempData.mode.currentDivId=='mode-add-switchBeginAndEnd'}">
                    <img src="../assets/switchBeginAndEnd.svg">
                    <p>分支合并</p>
                </div>
                <div @click="switchMode('addNode','mode-add-subflow','subflow','子流程')" id="mode-add-subflow" :class="{current:tempData.mode.currentDivId=='mode-add-subflow'}">
                    <img src="../assets/subflow.svg">
                    <p>子流程</p>
                </div>
            </div>
            <div :style="{width:paperWidth+'px',height:paperHeight+'px'}" class="backgroud">
            </div>
            <svg :width="paperWidth" :height="paperHeight" class="paper" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" @mousemove="moving($event)" @mouseup="drop($event)" @click.stop="paperClick">
                <defs>
                    <marker id="arrow-unselect" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
                        <path stroke="none" class='unselect' transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
                    </marker>
                    <marker id="arrow-select" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
                        <path stroke="none" class='select' transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
                    </marker>
                </defs>
                <g v-for="item in nodes" :key="'node'+item.id" :id="item.id" class="pointer" @dblclick="nodeDblClick(item)" @mousedown.stop="beginMove($event)" @click.stop="select('node',item.id)" :class="tempData.currentSelect.type=='node'&&tempData.currentSelect.id==item.id?'select':'unselect'">
                    <NormalNode v-if="item.type=='normal'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</NormalNode>
                    <StartNode v-if="item.type=='start'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</StartNode>
                    <StopNode v-if="item.type=='stop'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</StopNode>
                    <SwitchBeginNode v-if="item.type=='switchBegin'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</SwitchBeginNode>
                    <SwitchEndNode v-if="item.type=='switchEnd'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</SwitchEndNode>
                    <SwitchBeginAndEnd v-if="item.type=='switchBeginAndEnd'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</SwitchBeginAndEnd>
                    <Subflow v-if="item.type=='subflow'" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{item.text}}</Subflow>
                </g>
                <g v-for="item in lines" :key="'line'+item.id" class="pointer" @dblclick="lineDblClick(item)" @click.stop="select('line',item.id)" :class="tempData.currentSelect.type=='line'&&tempData.currentSelect.id==item.id?'select':'unselect'">
                    {{ lineData = getLineInfo(item)}}
                    <path :d="lineData.path" fill="none" stroke="transparent" stroke-width="10" />
                    <path :d="lineData.path" fill="none" stroke-width="2" :marker-end="tempData.currentSelect.type=='line'&&tempData.currentSelect.id==item.id?'url(#arrow-select)':'url(#arrow-unselect)'" />
                    <text :x="lineData.textx" :y="lineData.texty">
                        {{item.text}}
                    </text>
                </g>
                <path :d="tempData.connectLine.path" v-if="tempData.connectLine.path" fill="none" class="unselect" stroke-width="2" marker-end="url(#arrow-unselect)" /> {{ deleteInfo = getDeleteIconInfo()}}
                <svg v-if="deleteInfo" @click.stop="remove" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="delete" :x="deleteInfo.x" :y="deleteInfo.y" :width="deleteInfo.r" :height="deleteInfo.r" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                    <metadata> Svg Vector Icons : http://www.sfont.cn </metadata>
                    <g>
                        <path d="M500,10C228.7,10,10,229.9,10,500c0,271.3,219.9,490,490,490c271.3,0,490-219.9,490-490S771.3,10,500,10z M500,936.2c-240.2,0-435-194.8-435-435S259.8,65,501.2,65c240.2,0,436.2,194.8,436.2,436.2C936.2,741.4,741.4,936.2,500,936.2z" />
                        <path d="M686.4,369.7l-55-56.2L500,445L369.7,313.6l-56.2,56.2L445,501.2L313.6,631.5l56.2,56.2L500,556.2l131.5,131.5l55-56.2L556.2,501.2L686.4,369.7z" />
                    </g>
                </svg>
            </svg>
        </div>
    </div>
</template>
<script>
import common from '../utils/common.js';
import NormalNode from './normal.vue';
import StartNode from './start.vue';
import StopNode from './stop.vue';
import SwitchBeginNode from './switchBegin.vue';
import SwitchEndNode from './switchEnd.vue';
import SwitchBeginAndEnd from './switchBeginAndEnd.vue';
import Subflow from './subflow.vue';

common.useArrayExtends();
const mode = {
    select: 'select',
    connect: 'connect',
    addNode: 'addNode',
};
const nodeType = {
    start: 'start', //开始
    stop: 'stop', //结束
    normal: 'normal', //普通类型
    switchBegin: 'switchBegin', //并行分支开始
    switchEnd: 'switchEnd', //并行分支结束
    switchBeginAndEnd: 'switchBeginAndEnd',
    subflow: 'subflow',
};

export default {
    components: {
        NormalNode,
        StartNode,
        StopNode,
        SwitchBeginNode,
        SwitchEndNode,
        SwitchBeginAndEnd,
        Subflow,
    },
    data() {
        return {
            paperWidth: 1000,
            paperHeight: 600,
            tempData: {
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
                // 当前新增的节点类型数据
                mode: {
                    currentDivId: 'mode-select',
                    addNodeType: null,
                    addNodeText: null,
                    mode: mode.select,
                },
            },
            nodes: [
                {
                    id: '1',
                    type: nodeType.start,
                    text: '开始',
                    x: 150,
                    y: 50,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '2',
                    type: nodeType.normal,
                    text: '经理审批',
                    x: 300,
                    y: 150,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '3',
                    type: nodeType.switchBegin,
                    text: '总监审批',
                    x: 500,
                    y: 50,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '4',
                    type: nodeType.switchEnd,
                    text: '董事长审批',
                    x: 500,
                    y: 200,
                    nodeWidth: 100,
                    nodeHeight: 50,
                },
                {
                    id: '5',
                    type: nodeType.stop,
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
            // 上 下 左 右
            let fromPoints = [
                {x: fromNode.x, y: fromNode.y - fromNode.nodeHeight / 2},
                {
                    x: fromNode.x,
                    y: fromNode.y + fromNode.nodeHeight / 2,
                },
                {x: fromNode.x - fromNode.nodeWidth / 2, y: fromNode.y},
                {
                    x: fromNode.x + fromNode.nodeWidth / 2,
                    y: fromNode.y,
                },
            ];

            let toPoints = [
                {x: toNode.x, y: toNode.y - toNode.nodeHeight / 2},
                {
                    x: toNode.x,
                    y: toNode.y + toNode.nodeHeight / 2,
                },
                {x: toNode.x - toNode.nodeWidth / 2, y: toNode.y},
                {
                    x: toNode.x + toNode.nodeWidth / 2,
                    y: toNode.y,
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
                fromx,
                fromy,
                tox,
                toy,
            };
        },
        beginMove(ev) {
            // 开始拖动 记录拖动数据
            if (this.tempData.mode.mode == mode.select) {
                this.beginDrag(ev);
            } else if (this.tempData.mode.mode == mode.connect) {
                this.beginConnect(ev);
            }
        },
        moving(ev) {
            if (this.tempData.mode.mode == mode.select) this.dragMoving(ev);
            else if (this.tempData.mode.mode == mode.connect)
                this.connectMoving(ev);
        },
        drop(ev) {
            if (this.tempData.mode.mode == mode.select) this.dragDrop(ev);
            else if (this.tempData.mode.mode == mode.connect)
                this.connectDrop(ev);
        },
        beginDrag(ev) {
            let node = this.getMousePointNode(ev);
            if (!node) console.error(ev);
            // 开始拖动 记录拖动数据
            this.tempData.dragData.nodeid = this.getMousePointNode(ev).id;
            this.tempData.dragData.sourceMouseX = ev.screenX;
            this.tempData.dragData.sourceMouseY = ev.screenY;
        },
        beginConnect(ev) {
            this.tempData.connectLine.nodeId = this.getMousePointNode(ev).id;
        },
        // 拖动移动
        dragMoving(ev) {
            if (!this.tempData.dragData.nodeid) return;
            // 鼠标偏移量
            let offsetX = ev.screenX - this.tempData.dragData.sourceMouseX;
            let offsetY = ev.screenY - this.tempData.dragData.sourceMouseY;
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
            this.tempData.dragData.sourceMouseX = ev.screenX;
            this.tempData.dragData.sourceMouseY = ev.screenY;
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
                {x: fromNode.x, y: fromNode.y - fromNode.nodeHeight / 2},
                {
                    x: fromNode.x,
                    y: fromNode.y + fromNode.nodeHeight / 2,
                },
                {x: fromNode.x - fromNode.nodeWidth / 2, y: fromNode.y},
                {
                    x: fromNode.x + fromNode.nodeWidth / 2,
                    y: fromNode.y,
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
            this.tempData.connectLine = {
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
                    x >= r.x - r.nodeWidth / 2 &&
                    x <= r.x + r.nodeWidth / 2 &&
                    y >= r.y - r.nodeHeight / 2 &&
                    y <= r.y + r.nodeHeight / 2
            );
        },
        extendPaperIfNeed(node) {
            // 正在拖动,且拖出画布范围,将画布尺寸*2
            if (node.x + node.nodeWidth > this.paperWidth) this.paperWidth *= 2;
            if (node.y + node.nodeHeight > this.paperHeight)
                this.paperHeight *= 2;
        },
        select(type, id) {
            this.switchMode(mode.select, 'mode-select');
            this.tempData.currentSelect.type = type;
            this.tempData.currentSelect.id = id;
        },
        paperClick(ev) {
            this.tempData.currentSelect.type = null;
            this.tempData.currentSelect.id = null;
            // 新增节点模式
            if (this.tempData.mode.mode == mode.addNode) {
                this.nodes.push({
                    id: common.guid(),
                    type: this.tempData.mode.addNodeType,
                    text: this.tempData.mode.addNodeText || '新步骤',
                    x: ev.offsetX,
                    y: ev.offsetY,
                    nodeWidth: 100,
                    nodeHeight: 50,
                });
            }
        },
        remove() {
            if (
                this.tempData.currentSelect.id &&
                this.tempData.currentSelect.type
            ) {
                if (this.tempData.currentSelect.type == 'node') {
                    // 删除响应的连接线
                    this.lines.remove(
                        r => r.from == this.tempData.currentSelect.id
                    );
                    this.lines.remove(
                        r => r.to == this.tempData.currentSelect.id
                    );
                    // 删除节点
                    this.nodes.remove(
                        r => r.id == this.tempData.currentSelect.id
                    );
                } else if (this.tempData.currentSelect.type == 'line') {
                    this.lines.remove(
                        r => r.id == this.tempData.currentSelect.id
                    );
                }
            }
        },
        // 获取删除图标位置信息
        getDeleteIconInfo() {
            if (
                !this.tempData.currentSelect.id ||
                !this.tempData.currentSelect.type
            )
                return null;
            if (this.tempData.currentSelect.type == 'node') {
                let node = this.nodes.find(
                    r => r.id == this.tempData.currentSelect.id
                );
                if (!node) return null;
                let r = (node.nodeWidth + node.nodeHeight) * 0.2;

                return {
                    x: node.x + node.nodeWidth / 2,
                    y: node.y - node.nodeHeight / 2 - r,
                    r: r,
                };
            } else if (this.tempData.currentSelect.type == 'line') {
                let line = this.lines.find(
                    r => r.id == this.tempData.currentSelect.id
                );
                if (!line) return null;
                let r = 32;
                let lineInfo = this.getLineInfo(line);
                return {
                    x: lineInfo.textx + 9,
                    y: lineInfo.texty + 4,
                    r: r,
                };
            }
        },
        switchMode(mode, currentDivId, addNodeType, addNodeText) {
            this.tempData.mode.mode = mode;
            this.tempData.mode.currentDivId = currentDivId;
            this.tempData.mode.addNodeType = addNodeType;
            this.tempData.mode.addNodeText = addNodeText;
        },
    },
};
</script>

<style lang="less" scoped>
@unselectColor: rgb(49, 208, 198);
@selectColor: #ea6f5a;

.pointer {
    cursor: pointer;
}

#container {
    position: relative;
    margin: 5px auto;
    border: @unselectColor 1px solid;
    overflow: auto;
    .paper {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 60px;
        text {
            text-anchor: middle;
            font-size: 14px;
            stroke-width: 0;
        }
    }
    .backgroud {
        position: absolute;
        top: 0;
        left: 60px;
        z-index: -1;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzIGlkPSJ2LTYiPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3QgaWQ9InYtOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtMTAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==');
    }
    #toolbar {
        position: absolute;
        width: 58px;
        top: 0;
        left: 0;
        padding-top: 10px;
        div {
            width: 50px;
            background: @unselectColor;
            margin: 10px auto;
            cursor: pointer;
            z-index: 20;
            padding: 2px;
            img {
                width: 30px;
                height: 30px;
            }
            p {
                margin: 0;
                padding: 0;
                height: 12px;
                line-height: 12px;
                font-size: 12px;
            }
        }
        .current {
            background: @selectColor;
        }
    }
}

.select {
    fill: @selectColor;
    stroke: @selectColor;
}
.unselect {
    fill: @unselectColor;
    stroke: @unselectColor;
}
.delete {
    cursor: pointer;
    fill: @selectColor;
    stroke: @selectColor;
    z-index: 11;
}
</style>
