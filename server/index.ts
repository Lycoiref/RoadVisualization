import Koa from 'koa'
import cors from 'koa2-cors'
import { Series, EchartsOption, getMax, getColor } from './data_structure/data'
import { PrismaClient } from '@prisma/client'

const app = new Koa()
const prisma: any = new PrismaClient()

async function getOption(day: number, section: number) {
    let options = new EchartsOption()
    // 获取道路线
    let roadLine = await getRoadLine()
    // 获取当天数据
    console.log(`day${day}`);

    let dayData = await prisma[`day${day}`].findMany()
    let maxTable = await prisma['max_carflow'].findFirst({
        where: {
            day: day
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
                // if (day === 2) color = 'rgb(0, 0, 0)'
                let series = new Series(roadLine[road.road_id - 1], speed, color, max)
                seriesArr.push(series)
            }
        }
        // console.log(roads);
        options.timeline.data.push(`2014-01-${day} ${Math.floor(j / 2)}:${j % 2 === 0 ? '00' : '30'}`)
        options.options.push({
            title: {
                text: `2014-01-${day} ${Math.floor(j / 2)}:${j % 2 === 0 ? '00' : '30'}`,
                textStyle: {
                    color: '#EFEFEF',
                    fontSize: 90,
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                },
                right: 50
            },
            series: seriesArr
        })
        if (j === 1)
            options.series = seriesArr
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
    if (ctx.url.match('/api/roads')) {
        let options = await getOption(Number(ctx.query.day), Number(ctx.query.section))
        ctx.body = options
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

