import { Phone, Calendar, User, Clock, AlertCircle } from 'lucide-react'

export default function PatientProfile({ patient }: { patient: any }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-4">
                    {patient.name.substring(0, 2).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <span>{patient.sex === 'M' ? 'Male' : patient.sex === 'F' ? 'Female' : 'Other'}</span>
                    <span>•</span>
                    <span>{patient.age} years old</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="text-slate-400" size={20} />
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Phone Number</p>
                        <p className="text-slate-900 font-medium">{patient.phone || 'No phone number'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="text-slate-400" size={20} />
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">First Visit</p>
                        <p className="text-slate-900 font-medium">
                            {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock className="text-slate-400" size={20} />
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Last Visit</p>
                        <p className="text-slate-900 font-medium">
                            {new Date(patient.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="text-orange-500" size={18} />
                    <h3 className="font-bold text-slate-900 text-sm">Medical Alerts</h3>
                </div>
                <p className="text-sm text-slate-500 italic">No medical alerts recorded.</p>
            </div>
        </div>
    )
}
