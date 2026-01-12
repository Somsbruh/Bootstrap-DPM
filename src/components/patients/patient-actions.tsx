'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { deletePatient } from '@/lib/actions/patient'
import EditPatientModal from './edit-patient-modal'

type Patient = {
    id: string
    name: string
    sex: string | null
    age: number | null
    phone: string | null
}

export default function PatientActions({ patient }: { patient: Patient }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(patient.id)
            } catch (error) {
                console.error(error)
                alert('Failed to delete patient')
            }
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            >
                <MoreHorizontal size={18} />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden py-1">
                    <button
                        onClick={() => {
                            setIsMenuOpen(false)
                            setIsEditModalOpen(true)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Pencil size={14} /> Edit Details
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Delete Record
                    </button>
                </div>
            )}

            <EditPatientModal
                patient={patient}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    )
}
