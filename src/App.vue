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
    GeoComponent,
    TimelineComponent
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
    LinesChart,
    TimelineComponent
])

const chartDom = ref()
let day = 1
let days = []
let loaded = ref(false)
let myChart
onMounted(async () => {
    // 从./world.json中读入地图数据
    let res = await axios.get('./wenzhou.json')
    let worldgeoJSON = res.data
    res = await axios.get('http://localhost:3000/api/roads', {
        params: {
            day: day,
            section: 1
        }
    })
    let roadData = res.data
    console.log(roadData)
    // console.log(worldgeoJSON)
    echarts.registerMap('world', worldgeoJSON)
    myChart = echarts.init(chartDom.value)
    myChart.setOption(roadData)
    // 监听鼠标滚轮事件
    myChart.on('timelinechanged', function (params) {
        console.log(params)
    })
    // console.log(myChart)
    // 为了之后的数据更新速度，提前把15天的数据都请求好
    for (let i = 0; i < 15; i++) {
        let res = await axios.get('http://localhost:3000/api/roads', {
            params: {
                day: i + 1,
                section: 1
            }
        })
        days.push(res.data)
    }
    loaded.value = true
    // console.log(myChart)
})

const lastYear = async () => {
    console.log('lastYear', day)
    if (day < 2) {
        day = 15
    } else {
        day--
    }
    // let roadData = await axios.get('http://localhost:3000/api/roads', {
    //     params: {
    //         day: day,
    //         section: 1
    //     }
    // })
    // console.log(roadData)
    myChart.setOption(days[day - 1])
}

const nextYear = async () => {
    console.log('nextYear', day)
    if (day > 14) {
        day = 1
    } else {
        day++
    }
    myChart.setOption(days[day - 1])
}
</script>

<template>
    <div class="page">
        <div class="echarts" ref="chartDom"></div>
        <div class="mask" v-if="loaded">
            <div class="last-year change-year">
                <svg
                    t="1682299097125"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1113"
                    width="200"
                    height="200"
                    @click="lastYear"
                >
                    <path
                        d="M685.226667 168.106667a64 64 0 0 1 0 90.453333l-256.426667 256.469333 256.426667 256.426667a64 64 0 0 1-90.453334 90.538667l-301.738666-301.696a64 64 0 0 1 0-90.538667l301.696-301.653333a64 64 0 0 1 90.538666 0z"
                        fill="#dbdbdb"
                        p-id="1114"
                    ></path>
                </svg>
            </div>
            <div class="next-year change-year">
                <svg
                    t="1682299117017"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1313"
                    width="200"
                    height="200"
                    @click="nextYear"
                >
                    <path
                        d="M346.282667 854.442667a53.333333 53.333333 0 0 1 0-75.434667l263.978666-263.978667-263.978666-263.978666a53.333333 53.333333 0 1 1 75.434666-75.434667l301.696 301.696a53.333333 53.333333 0 0 1 0 75.434667l-301.696 301.696a53.333333 53.333333 0 0 1-75.434666 0z"
                        fill="#dbdbdb"
                        p-id="1314"
                    ></path>
                </svg>
            </div>
        </div>
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

.mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 不阻挡鼠标事件 */
    pointer-events: none;
}

.icon {
    width: 50px;
    pointer-events: all;
}
.icon :hover {
    cursor: pointer;
}
</style>
