import { PrismaClient } from '@prisma/client'

async function main() {
    let prisma: any = new PrismaClient()
    for (let i = 1; i <= 15; i++) {
        let dayData = await prisma[`day${i}`].findMany()
        let car_flow_in: number[] = dayData.map((item: any) => item['car_flow_in'])
        let max_flow_in = getMax(car_flow_in)
        console.log(max_flow_in)
        let car_flow_out: number[] = dayData.map((item: any) => item['car_flow_out'])
        let max_flow_out = getMax(car_flow_out)
        let max = Math.round((max_flow_in + max_flow_out) / 2)
        // 存入数据库
        await prisma[`max_carflow`].create({
            data: {
                day: i,
                max: max
            }
        })
        console.log(`[logger]: 目前正在进行day${i}`);
    }
    console.log('done');
}

main()

function getMax(data: number[]) {
    let max = 0
    for (let item of data) {
        if (item > max) {
            max = item
        }
    }
    return max
}
