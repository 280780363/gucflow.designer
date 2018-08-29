<template>
  <div id="container">

  </div>
</template>
<script>
import Raphael from 'raphael';

const nodeWidth = 100;
const nodeHeight = 50;

export default {
  name: 'flow-designer',
  data() {
    return {
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
      paper: {},
    };
  },
  mounted() {
    this.paper = new Raphael('container', 1000, 600);
    this.nodes.forEach(node => this.renderNode(node));
    this.lines.forEach(line => this.renderLine(line));
  },
  methods: {
    renderNode(node) {
      this.paper
        .text(node.x + nodeWidth / 2, node.y + nodeHeight / 2, node.text)
        .attr({
          fill: 'red',
          cursor: 'point',
        });
      this.paper.rect(node.x, node.y, nodeWidth, nodeHeight, 10).attr({
        cursor: 'point',
      });
    },
    renderLine(line) {
      let fromNode = this.nodes.find(r => r.id == line.from);
      let toNode = this.nodes.find(r => r.id == line.to);

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
      this.paper.text(textx, texty, line.text).attr({
        fill: 'red',
      });
      this.paper.path(`M${fromx} ${fromy}L${tox} ${toy}`).attr({
        'arrow-end': 'classic-wide-long',
        stroke: 'red',
        'stroke-width': 2,
      });
    },
  },
};
</script>
<style scoped>
#container {
  width: 1000px;
  height: 600px;
  border: 1px solid red;
}
</style>
