'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createMedicine(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const costPrice = parseFloat(formData.get('costPrice') as string) || 0
    const salePrice = parseFloat(formData.get('salePrice') as string) || 0
    const clinicId = formData.get('clinicId') as string
    const centralStock = parseInt(formData.get('centralStock') as string) || 0
    const dispensingStock = parseInt(formData.get('dispensingStock') as string) || 0
    const lowStockLevel = parseInt(formData.get('lowStockLevel') as string) || 5

    if (!name || !clinicId) {
        throw new Error('Missing required fields')
    }

    // specific to SQLite: transactions must be sequential or use $transaction
    await prisma.$transaction(async (tx) => {
        // 1. Create Medicine
        const medicine = await tx.medicine.create({
            data: {
                name,
                description,
                costPrice,
                salePrice,
                lowStockLevel,
                clinicId,
            }
        })

        // 2. Create Inventory Entry
        await tx.inventoryItem.create({
            data: {
                medicineId: medicine.id,
                clinicId,
                centralStock,
                dispensingStock,
            }
        })
    })

    revalidatePath('/inventory')
}
