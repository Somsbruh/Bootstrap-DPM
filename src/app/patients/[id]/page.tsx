import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PatientProfile from '@/components/patients/patient-profile'
import TreatmentTimeline from '@/components/patients/treatment-timeline'
import PhotoGallery from '@/components/patients/photo-gallery'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    const patient = await prisma.patient.findUnique({
        where: { id: params.id },
        include: {
            photos: true,
            transactions: {
                include: {
                    items: {
                        include: {
                            treatment: true,
                            medicine: true
                        }
                    },
                    payments: true
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!patient) notFound()

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <Link href="/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors">
                <ArrowLeft size={18} /> Back to Patients
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Sidebar Profile */}
                <div className="lg:col-span-1">
                    <PatientProfile patient={patient} />

                    <button className="w-full mt-4 bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <Edit size={16} /> Edit Details
                    </button>
                </div>

                {/* Right Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-500 text-sm font-medium">Total Spend</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">
                                ${patient.transactions.reduce((acc, tx) => acc + tx.totalAmount, 0).toFixed(2)}
                            </h3>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-500 text-sm font-medium">Visits</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{patient.transactions.length}</h3>
                        </div>
                    </div>

                    {/* Tabs / Sections */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Treatment History</h2>
                            <TreatmentTimeline transactions={patient.transactions} />
                        </div>

                        <div>
                            <PhotoGallery photos={patient.photos} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
