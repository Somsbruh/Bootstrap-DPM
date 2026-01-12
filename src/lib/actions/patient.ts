'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPatient(formData: FormData) {
    const name = formData.get('name') as string
    const sex = formData.get('sex') as string
    const age = parseInt(formData.get('age') as string) || null
    const phone = formData.get('phone') as string
    const clinicId = formData.get('clinicId') as string

    if (!name || !clinicId) {
        throw new Error('Missing required fields')
    }

    await prisma.patient.create({
        data: {
            name,
            sex,
            age,
            phone,
            clinicId,
        },
    })

    revalidatePath('/patients')
    revalidatePath('/')
}

export async function updatePatient(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const sex = formData.get('sex') as string
    const age = parseInt(formData.get('age') as string) || null
    const phone = formData.get('phone') as string

    if (!id || !name) {
        throw new Error('Missing required fields')
    }

    await prisma.patient.update({
        where: { id },
        data: {
            name,
            sex,
            age,
            phone,
        },
    })

    revalidatePath('/patients')
    revalidatePath('/')
}

export async function deletePatient(id: string) {
    if (!id) {
        throw new Error('Missing patient ID')
    }

    await prisma.patient.delete({
        where: { id },
    })

    revalidatePath('/patients')
    revalidatePath('/')
}
