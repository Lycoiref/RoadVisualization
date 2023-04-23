import Koa from 'koa'
import cors from 'koa2-cors'
import { Series, getMax, getColor } from './data_structure/data'
import { PrismaClient } from '@prisma/client'

const app = new Koa()
const prisma: any = new PrismaClient()
let days: any = []

async function getRoad(day: number) {
    // 读取所有的道路数据
    let roads_table = await prisma.load_track_detail.findMany()
    // 读取当天的车流量数据
    let [dayData, max_flow_in] = await getDay(day)
    let roads = await getHalfHourRoads(day, 1, roads_table, max_flow_in)
    return roads
}

async function getHalfHourRoads(day: number, halfHour: number, roads_table: any, max_flow_in: number) {
    let roads: any = []
    for (let item of roads_table as any) {
        let points: any = []
        for (let i = 1; i <= 4; i++) {
            if (item[`lat${i}`] === null) {
                break
            }
            let point = [item[`lng${i}`], item[`lat${i}`]]
            points.push(point)
        }
        // FIXME:不能这样写，相当慢
        // TODO: 优化
        let minuteData = await prisma[`five_carflow201401${day < 10 ? '0' : ''}${day}`].findFirst({
            where: {
                road_id: item['id'],
                time_minute: halfHour * 30
            },
        })
        let now_flow_in = minuteData['car_flow_in']    // 当前道路的车流量
        let speed = now_flow_in * 10
        let color = getColor(now_flow_in, max_flow_in)
        let series = new Series(points, speed, color)
        roads.push(series)
    }
    return roads
}

async function getDay(day: number) {
    let dayData: any = await prisma[`five_carflow201401${day < 10 ? '0' : ''}${day}`].findMany()
    let car_flow_in: number[] = dayData.map((item: any) => item['car_flow_in'])
    let max_flow_in = getMax(car_flow_in)
    console.log(max_flow_in)
    return [dayData, max_flow_in]
}

app.use(cors())
app.use(async (ctx, next) => {
    console.log(ctx.url);
    if (ctx.url.match('/api/roads')) {
        let day = ctx.query.day
        if (Number(day)) {
            let roads = await getRoad(Number(day))
            ctx.body = roads
        }
        // } else if (ctx.url.match('/api/days')) {
        //     let day = ctx.query.day
        //     if (Number(day)) {
        //         let dayData: any, max_flow_in = await getDay(Number(day))
        //         ctx.body = { dayData, max_flow_in }
        //     }
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

