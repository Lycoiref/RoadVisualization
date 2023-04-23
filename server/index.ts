import Koa from 'koa'
import cors from 'koa2-cors'
import { Series, EchartsOption, getMax, getColor } from './data_structure/data'
import { PrismaClient } from '@prisma/client'
import { Readable } from 'stream'

const json = require('big-json')
const app = new Koa()
const prisma: any = new PrismaClient()

async function getOption(day: number, section: number) {
    let options = new EchartsOption()
    // 获取道路线
    let roadLine = await getRoadLine()
    // 15天数据循环
    for (let i = 1; i <= 1; i++) {
        // 获取当天数据
        let dayData = await prisma[`day${i}`].findMany()
        let maxTable = await prisma['max_carflow'].findFirst({
            where: {
                day: i
            }
        })
        let max = maxTable.max

        // 一天内48个半小时循环
        for (let j = 1; j <= 48; j++) {
            // 取出每个半小时的数据
            let roads: any = []
            let seriesArr: any = []
            for (let road of dayData) {
                if (road.half_hour === j) {
                    roads.push(road)
                    let carflow = Math.round((road.car_flow_out + road.car_flow_in) / 2)
                    let speed = carflow
                    let color = getColor(carflow, max)
                    let series = new Series(roadLine[road.road_id - 1], speed, color)
                    seriesArr.push(series)
                }
            }
            // console.log(roads);
            options.timeline.data.push(`2014-01-${i} ${Math.floor(j / 2)}:${j % 2 === 0 ? '00' : '30'}`)
            options.options.push({
                title: {
                    text: `2014-01-${i} ${Math.floor(j / 2)}:${j % 2 === 0 ? '00' : '30'}`,
                },
                series: seriesArr
            })

        }
    }
    return options

}

async function getRoadLine() {
    let roads: any = await prisma.load_track_detail.findMany()
    let roadLine: any = []
    for (let item of roads as any) {
        let points: any = []
        for (let i = 1; i <= 4; i++) {
            if (item[`lat${i}`] === null) {
                break
            }
            let point = [item[`lng${i}`], item[`lat${i}`]]
            points.push(point)
        }
        roadLine.push(points)
    }
    return roadLine
}

app.use(cors())

app.use(async (ctx, next) => {
    console.log(ctx.url);
    if (ctx.url.match('/api/roads')) {
        let options = await getOption(Number(ctx.query.day), Number(ctx.query.section))
        ctx.body = options
    }
})

// app.use(async (ctx, next) => {
//     await next()
//     if (ctx.body && ctx.body.readable) {
//         ctx.type = 'application/octet-stream'
//         ctx.body = ctx.body.pipe(ctx.res)
//     }
// })

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

