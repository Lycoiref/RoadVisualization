<script setup>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
import axios from 'axios'
import { ref, onMounted } from 'vue'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    GeoComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import { LinesChart } from 'echarts/charts'

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    GeoComponent,
    LinesChart
])


const chartDom = ref()
onMounted(async () => {
    // 从./world.json中读入地图数据
    let res = await axios.get('./world.json')
    let worldgeoJSON = res.data
    console.log(worldgeoJSON)
    echarts.registerMap('world', worldgeoJSON)
    console.log(chartDom.value)
    let myChart = echarts.init(chartDom.value)
    myChart.setOption({
        progressive: 20000,
        backgroundColor: '#111',
        geo: {
            center: [-74.04327099998152, 40.86737600240287],
            zoom: 360,
            map: 'world',
            roam: true,
            silent: true,
            itemStyle: {
                color: 'transparent',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }
        },
        series: [
            {
                type: 'lines',
                coordinateSystem: 'geo',
                blendMode: 'lighter',
                dimensions: ['value'],
                data: new Float64Array(),
                polyline: true,
                large: true,
                lineStyle: {
                    color: 'orange',
                    width: 0.5,
                    opacity: 0.3
                }
            }
        ]
    })
    // console.log(myChart)
})
</script>

<template>
    <div class="page">1111
        <div class="echarts" ref="chartDom"></div>
        <!-- <el-amap :zoom="zoom" :center="center"></el-amap> -->
    </div>
</template>

<style scoped>
.page {
    width: 100vw;
    height: 100vh;
}

.echarts {
    width: 500px;
    height: 500px;
}
</style>
