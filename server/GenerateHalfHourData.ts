// 用于首先将数据整理为新的表
import { PrismaClient } from '@prisma/client'

async function main() {
    const prisma: any = new PrismaClient()
    for (let i = 1; i <= 15; i++) {
        // 删除原有的表
        await prisma[`day${i}`].deleteMany({})
        for (let j = 1; j <= 678; j++) {
            // 计算每个道路每半个小时的车流量并存入数据库
            let road: any = await prisma[`five_carflow201401${i < 10 ? '0' : ''}${i}`].findMany({
                where: {
                    road_id: j
                }
            })
            let road_id = j
            for (let halfHour = 1; halfHour <= 48; halfHour++) {
                let car_flow_in = 0
                let car_flow_out = 0
                for (let minute = 1; minute <= 6; minute++) {
                    car_flow_in += road[(halfHour - 1) * 6 + minute - 1]['car_flow_in']
                    car_flow_out += road[(halfHour - 1) * 6 + minute - 1]['car_flow_out']
                }
                await prisma[`day${i}`].create({
                    data: {
                        road_id: road_id,
                        car_flow_in: car_flow_in,
                        car_flow_out: car_flow_out,
                        half_hour: halfHour,
                    }
                })
                console.log(`[logger]: 目前正在进行day${i} road${j} halfHour${halfHour}`);

            }
        }
    }
    console.log('done');
}

// 执行
main()
