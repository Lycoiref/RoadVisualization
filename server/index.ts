import Koa from 'koa'
import cors from 'koa2-cors'
import { PrismaClient } from '@prisma/client'

const app = new Koa()
const prisma = new PrismaClient()
let roads: any = [];

(async () => {
    // let days = await prisma.five_carflow20140101.findMany()
    // console.log(days)
    let roads_table = await prisma.load_track_detail.findMany()
    // console.log(roads_table);
    for (let item of roads_table as any) {
        // console.log(item);
        let points: any = []
        for (let i = 1; i <= 4; i++) {
            if (item[`lat${i}`] === null) {
                break
            }
            let point = [item[`lng${i}`], item[`lat${i}`]]
            // console.log(point);
            points.push(point)
            // road.push([item[`x${i}`], item[`y${i}`]])
        }
        roads.push({
            coords: points,
            // lineStyle: {
            //     color: 'orange',
            //     width: 0.5,
            //     opacity: 0.3
            // }
        })
    }
})()

app.use(cors())
app.use(async (ctx, next) => {
    ctx.body = roads
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

