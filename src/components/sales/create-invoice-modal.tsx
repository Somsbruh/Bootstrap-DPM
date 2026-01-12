'use client'

import { useState } from 'react'
import { Plus, X, Search, Trash2 } from 'lucide-react'
import { createTransaction } from '@/lib/actions/sales'

type Props = {
    clinicId: string
    patients: any[]
    treatments: any[]
    medicines: any[]
}

export default function CreateInvoiceModal({ clinicId, patients, treatments, medicines }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    // Form State
    const [selectedPatientId, setSelectedPatientId] = useState('')
    const [selectedItems, setSelectedItems] = useState<any[]>([])

    const [searchPatient, setSearchPatient] = useState('')

    const addItem = (type: 'treatment' | 'medicine', id: string) => {
        const item = type === 'treatment'
            ? treatments.find(t => t.id === id)
            : medicines.find(m => m.id === id)

        if (!item) return

        setSelectedItems([...selectedItems, {
            type,
            id: item.id,
            name: item.name,
            unitPrice: type === 'treatment' ? item.defaultPrice : item.salePrice,
            quantity: 1
        }])
    }

    const removeItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!selectedPatientId || selectedItems.length === 0) return

        setIsPending(true)
        try {
            await createTransaction({
                clinicId,
                patientId: selectedPatientId,
                items: selectedItems.map(item => ({
                    treatmentId: item.type === 'treatment' ? item.id : undefined,
                    medicineId: item.type === 'medicine' ? item.id : undefined,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            })
            setIsOpen(false)
            setSelectedItems([])
            setSelectedPatientId('')
        } catch (error) {
            console.error(error)
            alert('Failed to create invoice')
        } finally {
            setIsPending(false)
        }
    }

    const filteredPatients = searchPatient
        ? patients.filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase()))
        : patients.slice(0, 5)

    const totalAmount = selectedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm"
            >
                <Plus size={18} /> New Invoice
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-900">Create New Invoice</h3>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Selection */}
                    <div className="w-1/2 border-r border-slate-100 p-6 overflow-y-auto space-y-6">
                        {/* Patient Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Select Patient</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search patient..."
                                    value={searchPatient}
                                    onChange={(e) => setSearchPatient(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                                {filteredPatients.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPatientId(p.id)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${selectedPatientId === p.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Items Select */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900 border-b pb-2">Add Items</h4>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Treatments</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addItem('treatment', e.target.value)
                                            e.target.value = ''
                                        }
                                    }}
                                >
                                    <option value="">Select Treatment...</option>
                                    {treatments.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} - ${t.defaultPrice}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Medicines</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addItem('medicine', e.target.value)
                                            e.target.value = ''
                                        }
                                    }}
                                >
                                    <option value="">Select Medicine...</option>
                                    {medicines.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} - ${m.salePrice}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="w-1/2 p-6 bg-slate-50 flex flex-col">
                        <h4 className="font-bold text-slate-900 mb-4">Invoice Summary</h4>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {selectedItems.map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center group">
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-slate-500">${item.unitPrice} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                        <button onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {selectedItems.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-sm">
                                    No items added yet.
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
                            <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                                <span>Total Amount</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isPending || !selectedPatientId || selectedItems.length === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                            >
                                {isPending ? 'Processing...' : 'Create Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
