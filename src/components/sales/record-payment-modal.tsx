'use client'

import { useState } from 'react'
import { DollarSign, X } from 'lucide-react'
import { recordPayment } from '@/lib/actions/sales'

export default function RecordPaymentModal({ transaction, onClose }: { transaction: any, onClose: () => void }) {
    const [isPending, setIsPending] = useState(false)
    const balance = transaction.totalAmount - transaction.payments.reduce((acc: number, p: any) => acc + p.amount, 0)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        const formData = new FormData(e.currentTarget)

        try {
            await recordPayment(formData)
            onClose()
        } catch (error) {
            console.error(error)
            alert('Payment failed')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-900">Record Payment</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <input type="hidden" name="transactionId" value={transaction.id} />

                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-blue-600 font-medium mb-1">Outstanding Balance</p>
                        <p className="text-3xl font-bold text-blue-700">${balance.toFixed(2)}</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Amount to Pay ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                required
                                name="amount"
                                type="number"
                                step="0.01"
                                max={balance}
                                defaultValue={balance}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-semibold text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Payment Method</label>
                        <select
                            name="method"
                            defaultValue="CASH"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                        >
                            <option value="CASH">Cash</option>
                            <option value="ABA">ABA Transfer</option>
                            <option value="CARD">Credit Card</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-bold shadow-md shadow-green-500/20 transition-all"
                    >
                        {isPending ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </form>
            </div>
        </div>
    )
}
