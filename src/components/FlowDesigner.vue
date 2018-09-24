<template>
    <div id="designer">
        <!-- 工具栏 -->
        <div id="toolbar">
            <div @click="switchMode(enums.mode.select)" :class="{active:tempData.mode.current==enums.mode.select}">
                <img src="../assets/mouse.svg">
                <p>选择</p>
            </div>
            <div @click="switchMode(enums.mode.connect)" :class="{active:tempData.mode.current==enums.mode.connect}">
                <img src="../assets/connect.svg">
                <p>连接</p>
            </div>
            <hr/>
            <div @click="switchMode(enums.mode.addNode_task)" :id="enums.mode.addNode_task" :nodetype="enums.nodeType.task" :class="{active:tempData.mode.current==enums.mode.addNode_task}">
                <img src="../assets/users1.svg">
                <p>任务</p>
            </div>
            <div @click="switchMode(enums.mode.addNode_parallel)" :id="enums.mode.addNode_parallel" :nodetype="enums.nodeType.task" :class="{active:tempData.mode.current==enums.mode.addNode_parallel}">
                <img src="../assets/branch.svg">
                <p>分支</p>
            </div>
            <div @click="switchMode(enums.mode.addNode_merge)" :id="enums.mode.addNode_merge" :nodetype="enums.nodeType.task" :class="{active:tempData.mode.current==enums.mode.addNode_merge}">
                <img src="../assets/merge.svg">
                <p>合并</p>
            </div>
            <div @click="switchMode(enums.mode.addNode_subflow)" :id="enums.mode.addNode_subflow" :nodetype="enums.nodeType.task" :class="{active:tempData.mode.current==enums.mode.addNode_subflow}">
                <img src="../assets/subflow.svg">
                <p>子流程</p>
            </div>
        </div>
        <div id="container">
            <!-- 画布 -->
            <svg :width="flowData.paperWidth" @keyup.46="remove" @keyup.ctrl.67.exact="copy" @keyup.ctrl.86.exact="paste" @keyup.ctrl.90.exact="undo" tabindex="0" :height="flowData.paperHeight" id="paper" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" @mousemove="moving" @mouseup="drop" @click.stop="paperClick">
                <defs>
                    <marker id="arrow-unselect" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
                        <path stroke="none" class='unselect' transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
                    </marker>
                    <marker id="arrow-select" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
                        <path stroke="none" class='select' transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
                    </marker>
                </defs>
                <!-- 节点 -->
                <g v-for="item in flowData.nodes" :key="'node'+item.id" :id="item.id" cursor="pointer" @dblclick="nodeDblClick(item)" @mousedown.stop="beginMove" @mouseup="select('node',item.id,$event)" :class="tempData.currentSelect.type=='node'&&tempData.currentSelect.id==item.id?'select':'unselect'">
                    <title>{{item.text}}</title>
                    {{ shortText = item.text.substringIfTooLong(6) }}
                    <TaskNode v-if="item.type==enums.nodeType.task" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{shortText}}</TaskNode>
                    <StartNode v-if="item.type==enums.nodeType.start" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{shortText}}</StartNode>
                    <StopNode v-if="item.type==enums.nodeType.stop" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{shortText}}</StopNode>
                    <ParallelNode v-if="item.type==enums.nodeType.parallel" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{shortText}}</ParallelNode>
                    <MergeNode v-if="item.type==enums.nodeType.merge" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{shortText}}</MergeNode>
                    <SubflowNode v-if="item.type==enums.nodeType.subflow" :width="item.nodeWidth" :height="item.nodeHeight" :x="item.x" :y="item.y">{{shortText}}</SubflowNode>
                </g>
                <!-- 连线 -->
                <g v-for="item in flowData.lines" :key="'line'+item.id" cursor="pointer" @dblclick="lineDblClick(item)" @click.stop="select('line',item.id)" :class="tempData.currentSelect.type=='line'&&tempData.currentSelect.id==item.id?'select':'unselect'">
                    {{ lineData = getLineInfo(item)}}
                    <title>{{item.text}}</title>
                    <path :d="lineData.path" fill="none" stroke="transparent" stroke-width="10" />
                    <path :d="lineData.path" fill="none" stroke-width="2" :marker-end="tempData.currentSelect.type=='line'&&tempData.currentSelect.id==item.id?'url(#arrow-select)':'url(#arrow-unselect)'" />
                    <text :x="lineData.textx" :y="lineData.texty">
                        {{item.text.substringIfTooLong(12)}}
                    </text>
                </g>
                <!-- 动态连线 -->
                <path :d="tempData.connectLine.path" v-if="tempData.connectLine.path" fill="none" class="unselect" stroke-width="2" marker-end="url(#arrow-unselect)" />
            </svg>
        </div>
    </div>
</template>
<script>
import common from '../utils/common.js';
import TaskNode from './nodes/task.vue';
import StartNode from './nodes/start.vue';
import StopNode from './nodes/stop.vue';
import ParallelNode from './nodes/parallel.vue';
import MergeNode from './nodes/merge.vue';
import SubflowNode from './nodes/subflow.vue';

common.useExtends();
let mode = {
        // 操作模式
        select: 'select', // 选择
        connect: 'connect', // 连接
        addNode_task: 'addNode-task', // 新增任务
        addNode_parallel: 'addNode-parallel', // 新增并行分支
        addNode_merge: 'addNode-merge', // 新增合并
        addNode_subflow: 'addNode-subflow', // 新增子流程
    },
    nodeType = {
        // 节点类型
        start: 'start', //开始
        stop: 'stop', //结束
        task: 'task', //普通类型
        parallel: 'parallel', //并行分支开始
        merge: 'merge', //并行分支合并
        subflow: 'subflow',
    },
    // 元素类型
    eleType = {
        node: 'node',
        line: 'line',
    };
export default {
    components: {
        TaskNode,
        StartNode,
        StopNode,
        ParallelNode,
        MergeNode,
        SubflowNode,
    },
    data() {
        return {
            enums: {mode, nodeType, eleType},
            tempData: {
                dragData: {
                    nodeid: null,
                    // 拖动开始的位置
                    sourceMouseX: null,
                    sourceMouseY: null,
                    // 上一次记录的位置
                    prevMouseX: null,
                    prevMouseY: null,
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
                mode: {
                    current: 'select',
                },
                // 撤销数据
                historyData: [],
                // 复制数据
                clipboard: {
                    nodeId: null,
                },
            },
            flowData: {
                paperWidth: 1000,
                paperHeight: 600,
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
                        type: nodeType.task,
                        text: '经理审批',
                        x: 300,
                        y: 150,
                        nodeWidth: 100,
                        nodeHeight: 50,
                    },
                    {
                        id: '3',
                        type: nodeType.parallel,
                        text: '总监审批',
                        x: 500,
                        y: 50,
                        nodeWidth: 100,
                        nodeHeight: 50,
                    },
                    {
                        id: '4',
                        type: nodeType.merge,
                        text: '董事长审批啊啊啊啊啊啊',
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
            },
        };
    },
    created() {
        // 枚举设为只读
        common.readonly(this.enums);
    },
    mounted() {
        // 拖动时取消选择文本
        document.getElementById('designer').onselectstart = function() {
            return false;
        };
    },
    methods: {
        // 获取连接线 具体的path属性以及文本位置
        getLineInfo(line) {
            let fromNode = this.flowData.nodes.find(r => r.id == line.from);
            let toNode = this.flowData.nodes.find(r => r.id == line.to);
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
            if (this.tempData.mode.current == mode.select) {
                this.beginDrag(ev);
            } else if (this.tempData.mode.current == mode.connect) {
                this.beginConnect(ev);
            }
        },
        moving(ev) {
            if (this.tempData.mode.current == mode.select) this.dragMoving(ev);
            else if (this.tempData.mode.current == mode.connect)
                this.connectMoving(ev);
        },
        drop(ev) {
            if (this.tempData.mode.current == mode.select) this.dragDrop(ev);
            else if (this.tempData.mode.current == mode.connect)
                this.connectDrop(ev);
        },
        beginDrag(ev) {
            let node = this.getMousePointNode(ev);
            if (!node) console.error(ev);
            // 添加到更改历史
            this.tempData.historyData.push(common.clone(this.flowData));
            // 开始拖动 记录拖动数据
            this.tempData.dragData.nodeid = this.getMousePointNode(ev).id;
            this.tempData.dragData.sourceMouseX = ev.screenX;
            this.tempData.dragData.sourceMouseY = ev.screenY;
            this.tempData.dragData.prevMouseX = ev.screenX;
            this.tempData.dragData.prevMouseY = ev.screenY;
        },
        beginConnect(ev) {
            this.tempData.connectLine.nodeId = this.getMousePointNode(ev).id;
        },
        // 拖动移动
        dragMoving(ev) {
            if (!this.tempData.dragData.nodeid) return;
            // 鼠标偏移量
            let offsetX = ev.screenX - this.tempData.dragData.prevMouseX;
            let offsetY = ev.screenY - this.tempData.dragData.prevMouseY;
            // 拖动范围小于5 不处理
            if (Math.abs(offsetX) + Math.abs(offsetY) < 5) return;
            let node = this.flowData.nodes.find(
                r => r.id == this.tempData.dragData.nodeid
            );
            if (!node) return;
            node.x += offsetX;
            node.y += offsetY;
            this.extendPaperIfNeed(node);
            // 重置鼠标位置
            this.tempData.dragData.prevMouseX = ev.screenX;
            this.tempData.dragData.prevMouseY = ev.screenY;
        },
        // 拖动完成
        dragDrop() {
            // 拖动完成 情况拖动数据
            this.tempData.dragData.nodeid = null;
            this.tempData.dragData.sourceMouseX = null;
            this.tempData.dragData.sourceMouseY = null;
            this.tempData.dragData.prevMouseX = null;
            this.tempData.dragData.prevMouseY = null;
        },
        // 连接移动
        connectMoving(ev) {
            let node = this.flowData.nodes.find(
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
                let exists = this.flowData.lines.some(
                    r =>
                        r.from == this.tempData.connectLine.nodeId &&
                        r.to == targetNode.id
                );
                if (
                    !exists &&
                    this.tempData.connectLine.nodeId != targetNode.id
                ) {
                    // 添加到更改历史
                    this.tempData.historyData.push(common.clone(this.flowData));
                    this.flowData.lines.push({
                        id: common.guid(),
                        from: this.tempData.connectLine.nodeId,
                        to: targetNode.id,
                        text: '',
                    });
                    this.tempData.connectLine = {
                        path: null,
                        nodeId: null,
                    };
                }
            }
        },
        // 节点双击事件
        nodeDblClick(node) {
            alert('nodeid:' + node.id);
        },
        // 连接线双击事件
        lineDblClick(line) {
            alert('lineid:' + line.id);
        },
        // 获取鼠标事件当前位置的节点
        getMousePointNode(ev) {
            let x = ev.offsetX;
            let y = ev.offsetY;
            return this.flowData.nodes.find(
                r =>
                    x >= r.x - r.nodeWidth / 2 &&
                    x <= r.x + r.nodeWidth / 2 &&
                    y >= r.y - r.nodeHeight / 2 &&
                    y <= r.y + r.nodeHeight / 2
            );
        },
        extendPaperIfNeed(node) {
            // 正在拖动,且拖出画布范围,将画布尺寸*2
            if (node.x + node.nodeWidth > this.flowData.paperWidth)
                this.flowData.paperWidth *= 2;
            if (node.y + node.nodeHeight > this.flowData.paperHeight)
                this.flowData.paperHeight *= 2;
        },
        // 选择某个对象
        select(type, id, ev) {
            // 使用mouseup作为点击事件,以免拖动时触发click,判断鼠标位置是否有变化,没有变化才是为单击
            if (
                !this.tempData.dragData.sourceMouseX ||
                !this.tempData.dragData.sourceMouseY ||
                (ev.screenX == this.tempData.dragData.sourceMouseX &&
                    ev.screenY == this.tempData.dragData.sourceMouseY)
            ) {
                this.switchMode(mode.select);
                this.tempData.currentSelect.type = type;
                this.tempData.currentSelect.id = id;
            }
        },
        // 画布单击
        paperClick(ev) {
            if (ev.target.id != 'paper') return;
            this.tempData.currentSelect.type = null;
            this.tempData.currentSelect.id = null;
            // 新增节点模式
            if (
                this.tempData.mode.current == mode.addNode_task ||
                this.tempData.mode.current == mode.addNode_parallel ||
                this.tempData.mode.current == mode.addNode_merge ||
                this.tempData.mode.current == mode.addNode_subflow
            ) {
                let $div = document.getElementById(this.tempData.mode.current);
                let text = $div.getElementsByTagName('p')[0].innerText;
                let nodeType = $div.getAttribute('nodetype');
                // 添加到更改历史
                this.tempData.historyData.push(common.clone(this.flowData));
                this.flowData.nodes.push({
                    id: common.guid(),
                    type: nodeType,
                    text: text,
                    x: ev.offsetX,
                    y: ev.offsetY,
                    nodeWidth: 100,
                    nodeHeight: 50,
                });
            }
        },
        // 移除某个对象
        remove() {
            if (
                this.tempData.currentSelect.id &&
                this.tempData.currentSelect.type
            ) {
                // 添加到更改历史
                this.tempData.historyData.push(common.clone(this.flowData));
                if (this.tempData.currentSelect.type == eleType.node) {
                    // 删除响应的连接线
                    this.flowData.lines.remove(
                        r => r.from == this.tempData.currentSelect.id
                    );
                    this.flowData.lines.remove(
                        r => r.to == this.tempData.currentSelect.id
                    );
                    // 删除节点
                    this.flowData.nodes.remove(
                        r => r.id == this.tempData.currentSelect.id
                    );
                } else if (this.tempData.currentSelect.type == eleType.line) {
                    this.flowData.lines.remove(
                        r => r.id == this.tempData.currentSelect.id
                    );
                }
            }
        },
        // 切换操作模式
        switchMode(mode) {
            this.tempData.mode.current = mode;
        },
        // 复制节点
        copy() {
            if (this.tempData.currentSelect.type == eleType.node) {
                this.tempData.clipboard.nodeId = this.tempData.currentSelect.id;
            }
        },
        // 粘贴
        paste() {
            if (this.tempData.clipboard.nodeId) {
                var node = this.flowData.nodes.find(
                    r => r.id == this.tempData.clipboard.nodeId
                );
                var cloneNode = common.clone(node);
                cloneNode.x += 20;
                cloneNode.y += 20;
                cloneNode.id = common.guid();
                // 添加到更改历史
                this.tempData.historyData.push(common.clone(this.flowData));
                this.flowData.nodes.push(cloneNode);
            }
        },
        // 撤销
        undo() {
            if (this.tempData.historyData.length) {
                let last = this.tempData.historyData.last();
                if (last) {
                    this.flowData = common.clone(last);
                    this.tempData.historyData.pop();
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
@unselectColor: rgb(49, 208, 198);
@selectColor: #ea6f5a;

#designer {
    width: 1060px;
    height: 600px;
    position: relative;
    margin: 5px auto;
}
#container {
    position: absolute;
    top: 0;
    left: 58px;
    border: @unselectColor 1px solid;
    overflow: auto;
    width: 1000px;
    height: 600px;
    #paper {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzIGlkPSJ2LTYiPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3QgaWQ9InYtOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtMTAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==');
        text {
            text-anchor: middle;
            font-size: 14px;
            stroke-width: 0;
        }
    }
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
    .active {
        background: @selectColor;
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
    z-index: 11;
    fill: @selectColor;
}
</style>
