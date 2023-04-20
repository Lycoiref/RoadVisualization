import Koa from 'koa'
import { PrismaClient } from '@prisma/client'

const app = new Koa()
const prisma = new PrismaClient();

(async () => {
    let day1 = await prisma.five_carflow20140101.findMany()
    console.log(day1);
})()


app.use(async (ctx, next) => {
    ctx.body = 'Hello World'
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

