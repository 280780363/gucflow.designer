<template>
  <div id="container" class="paper">
    <svg height="1000" version="1.1" width="1000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="paper">
      <defs>
        <marker id="markerArrow" orient="auto" overflow="visible" markerUnits="userSpaceOnUse">
          <path stroke="none" fill="#8f8f8f" transform="rotate(180)" d="M 10 -5 0 0 10 5 z"></path>
        </marker>
      </defs>
      <g v-for="item in nodes" :key="item.id" class="pointer">
        <rect :width="nodeWidth" :height="nodeHeight" :x="item.x" :y="item.y" rx="2" ry="2" stroke="rgb(49, 208, 198)" stroke-width="2" fill="transparent" stroke-dasharray="0" />
        <text :x="item.x+nodeWidth/2" :y="item.y+nodeHeight/2" fill="rgb(49, 208, 198)" text-anchor="middle" font-size="12" stroke-width="0">
          {{item.text}}
        </text>
      </g>
      <g v-for="item in lines" :key="item.text" class="pointer">
        {{ lineData = getLineInfo(item)}}
        <path :d="lineData.path" fill="none" stroke="transparent" stroke-width="10" />
        <path :d="lineData.path" fill="none" stroke="#8f8f8f" stroke-width="2" marker-end="url(#markerArrow)" />
        <text :x="lineData.textx" :y="lineData.texty" fill="#8f8f8f" text-anchor="middle" font-size="12" stroke-width="0">
          {{item.text}}
        </text>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nodeWidth: 100,
      nodeHeight: 50,
      nodes: [
        {
          id: '1',
          text: '开始',
          x: 10,
          y: 10,
        },
        {
          id: '2',
          text: '经理审批',
          x: 200,
          y: 10,
        },
        {
          id: '3',
          text: '总监审批',
          x: 500,
          y: 10,
        },
        {
          id: '4',
          text: '董事长审批',
          x: 500,
          y: 200,
        },
      ],
      lines: [
        {
          from: '1',
          to: '2',
          text: '开始到经理',
        },
        {
          from: '2',
          to: '3',
          text: '经理到总监',
        },
        {
          from: '3',
          to: '4',
          text: '总监到董事长',
        },
        {
          from: '1',
          to: '4',
          text: '开始到董事长',
        },
        {
          from: '2',
          to: '4',
          text: '经理到董事长',
        },
      ],
    };
  },
  methods: {
    getLineInfo(line) {
      let fromNode = this.nodes.find(r => r.id == line.from);
      let toNode = this.nodes.find(r => r.id == line.to);
      let nodeWidth = this.nodeWidth;
      let nodeHeight = this.nodeHeight;
      let fromPoints = [
        {x: fromNode.x + nodeWidth / 2, y: fromNode.y},
        {x: fromNode.x + nodeWidth / 2, y: fromNode.y + nodeHeight},
        {x: fromNode.x, y: fromNode.y + nodeHeight / 2},
        {x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2},
      ];

      let toPoints = [
        {x: toNode.x + nodeWidth / 2, y: toNode.y},
        {x: toNode.x + nodeWidth / 2, y: toNode.y + nodeHeight},
        {x: toNode.x, y: toNode.y + nodeHeight / 2},
        {x: toNode.x + nodeWidth, y: toNode.y + nodeHeight / 2},
      ];

      let lengArr = [];
      for (let i = 0; i < 4; i++) {
        let fromPoint = fromPoints[i];
        for (let j = 0; j < 4; j++) {
          let toPoint = toPoints[j];
          var length = Math.sqrt(
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
  },
};
</script>
<style scoped>
.paper {
  width: 1000px;
  height: 1000px;
}
.pointer {
  cursor: pointer;
}
</style>
