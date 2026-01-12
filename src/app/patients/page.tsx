import Link from 'next/link';
import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { User } from 'lucide-react';
import AddPatientModal from '@/components/patients/add-patient-modal';
import PatientSearch from '@/components/patients/patient-search';
import PatientActions from '@/components/patients/patient-actions';

export default async function PatientsPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // For now, we mock the current clinic ID (Bayon Dental)
    // In a real SaaS, this would come from the Auth session or subdomain
    let clinic = await prisma.clinic.findFirst({
        where: { name: 'Bayon Dental Clinic' }
    });

    // Simple auto-onboarding if not seeded
    if (!clinic) {
        clinic = await prisma.clinic.create({
            data: {
                name: 'Bayon Dental Clinic',
                address: 'Phnom Penh Branch',
                phone: '012 345 678',
                systemSettings: {
                    create: { exchangeRate: 4100 }
                }
            }
        });
    }

    const query = typeof searchParams.q === 'string' ? searchParams.q : undefined

    const patients = await prisma.patient.findMany({
        where: {
            clinicId: clinic.id,
            OR: query ? [
                { name: { contains: query } },
                { phone: { contains: query } }
            ] : undefined
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all patient records and history for {clinic.name}.</p>
                </div>
                <AddPatientModal clinicId={clinic.id} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
                    <Suspense fallback={<div>Loading search...</div>}>
                        <PatientSearch />
                    </Suspense>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                                <th className="px-6 py-4">Patient Name</th>
                                <th className="px-6 py-4">Sex / Age</th>
                                <th className="px-6 py-4">Phone Number</th>
                                <th className="px-6 py-4">Last Visit</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.length > 0 ? patients.map((patient: any) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <Link href={`/patients/${patient.id}`} className="block">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {patient.name.substring(0, 2)}
                                                </div>
                                                <span className="font-semibold text-slate-900">{patient.name}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        <Link href={`/patients/${patient.id}`} className="block">
                                            {patient.sex || '-'} / {patient.age || '-'} yrs
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        <Link href={`/patients/${patient.id}`} className="block">
                                            {patient.phone || '-'}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        <Link href={`/patients/${patient.id}`} className="block">
                                            {patient.createdAt.toLocaleDateString()}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end">
                                        <PatientActions patient={patient} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                                <User size={32} />
                                            </div>
                                            <p className="text-slate-500 font-medium">No patients found</p>
                                            <p className="text-slate-400 text-sm">Try adjusting your search or add a new patient.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
