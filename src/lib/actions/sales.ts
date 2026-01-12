'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTransaction(data: {
    clinicId: string
    patientId: string
    items: {
        treatmentId?: string
        medicineId?: string
        quantity: number
        unitPrice: number
    }[]
}) {
    if (!data.clinicId || !data.patientId || data.items.length === 0) {
        throw new Error('Missing required fields')
    }

    const totalAmount = data.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)

    await prisma.transaction.create({
        data: {
            clinicId: data.clinicId,
            patientId: data.patientId,
            totalAmount,
            status: 'PENDING',
            items: {
                create: data.items.map(item => ({
                    treatmentId: item.treatmentId,
                    medicineId: item.medicineId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.unitPrice * item.quantity
                }))
            }
        }
    })

    revalidatePath('/sales')
    revalidatePath(`/patients/${data.patientId}`)
}

export async function recordPayment(formData: FormData) {
    const transactionId = formData.get('transactionId') as string
    const amount = parseFloat(formData.get('amount') as string)
    const method = formData.get('method') as string

    if (!transactionId || !amount || !method) {
        throw new Error('Missing payment details')
    }

    // 1. Create Payment
    await prisma.payment.create({
        data: {
            transactionId,
            amount,
            method,
        }
    })

    // 2. Check if fully paid
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { payments: true }
    })

    if (transaction) {
        const totalPaid = transaction.payments.reduce((acc, p) => acc + p.amount, 0)
        if (totalPaid >= transaction.totalAmount) {
            await prisma.transaction.update({
                where: { id: transactionId },
                data: { status: 'COMPLETED' }
            })
        }
    }

    revalidatePath('/sales')
}
