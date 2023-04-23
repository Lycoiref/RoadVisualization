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
    let res = await axios.get('./wenzhou.json')
    let worldgeoJSON = res.data
    res = await axios.get('http://localhost:3000/api/roads', {
        params: {
            day: 1
        }
    })
    let roadData = res.data
    // res = await axios.get('http://localhost:3000/api/days', {
    //     params: {
    //         day: 1
    //     }
    // })
    // let dayData = res.data
    // console.log(dayData)
    console.log(roadData)
    console.log(worldgeoJSON)
    echarts.registerMap('world', worldgeoJSON)
    let myChart = echarts.init(chartDom.value)
    myChart.setOption({
    })
    console.log(myChart)
    // setTimeout(() => {
    // }, 5000)
    // console.log(myChart)
})
</script>

<template>
    <div class="page">
        <div class="echarts" ref="chartDom"></div>
        <!-- <el-amap :zoom="zoom" :center="center"></el-amap> -->
    </div>
</template>

<style scoped>
.page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.echarts {
    width: 100%;
    height: 100%;
}
</style>
