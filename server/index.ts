import Koa from 'koa'
import cors from 'koa2-cors'
import { Series, EchartsOption, getMax, getColor } from './data_structure/data'
import { PrismaClient } from '@prisma/client'

const app = new Koa()
const prisma: any = new PrismaClient()
let days: any = []

async function getOption() {
    let options = new EchartsOption()
    // 15天数据循环
    for (let i = 1; i <= 15; i++) {
        // 获取当天数据
        let day = await prisma[`day${i}`].findMany()
        // 一天内48个半小时循环
        for (let j = 1; j <= 48; j++) {
            // 遍历取出每个半小时的数据
            for (let road of day) {
                if (road.half_hour === j) {
                    options.timeline.data.push(`2014-01-${i} ${Math.floor(j / 2)}:${j % 2 === 0 ? '30' : '00'}`)
                }
            }
        }
    }

}

async function getHalfHourRoads(day: number, halfHour: number, roads_table: any, max_flow_in: number) {
}

app.use(cors())
app.use(async (ctx, next) => {
    console.log(ctx.url);
    if (ctx.url.match('/api/roads')) {
        // if (Number(day)) {
        // } 
        let options = await getOption()
        ctx.body = options
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

