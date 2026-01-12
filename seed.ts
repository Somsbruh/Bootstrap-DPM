import prisma from './src/lib/prisma'

async function main() {
    const clinic = await prisma.clinic.create({
        data: {
            name: 'Bayon Dental Clinic',
            address: 'Phnom Penh Branch',
            phone: '012 345 678',
            systemSettings: {
                create: {
                    exchangeRate: 4100,
                },
            },
            categories: {
                create: [
                    { name: 'General' },
                    { name: 'X-Ray' },
                    { name: 'Orthodontics' },
                    { name: 'Surgery' },
                ],
            },
        },
    })

    console.log({ clinic })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
