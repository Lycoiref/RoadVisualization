import { PrismaClient } from '@prisma/client'

async function main() {
    let prisma = new PrismaClient()
    for (let i = 1; i <= 15; i++) {
        let dayData = await prisma[`day${i}`].findMany()
        
    }
}
