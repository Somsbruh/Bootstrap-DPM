'use client'

import { useState } from 'react'
import { FileText, CheckCircle2, Clock } from 'lucide-react'
import RecordPaymentModal from './record-payment-modal'

export default function SalesList({ transactions }: { transactions: any[] }) {
    const [paymentModalTx, setPaymentModalTx] = useState<any>(null)

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <FileText size={32} />
                </div>
                <p className="text-slate-500 font-medium">No transactions found</p>
                <p className="text-slate-400 text-sm">Create a new invoice to get started.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Items Summary</th>
                            <th className="px-6 py-4 text-right">Total</th>
                            <th className="px-6 py-4 text-right">Paid</th>
                            <th className="px-6 py-4 text-right">Balance</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => {
                            const paid = tx.payments.reduce((acc: number, p: any) => acc + p.amount, 0)
                            const balance = tx.totalAmount - paid
                            const isFullyPaid = balance <= 0

                            return (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        {tx.patient.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {tx.items.length} items
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                        ${tx.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600">
                                        ${paid.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                                        ${balance.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {isFullyPaid ? (
                                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                                                <CheckCircle2 size={12} /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-1 rounded-full text-xs font-bold">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {!isFullyPaid && (
                                            <button
                                                onClick={() => setPaymentModalTx(tx)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {paymentModalTx && (
                <RecordPaymentModal
                    transaction={paymentModalTx}
                    onClose={() => setPaymentModalTx(null)}
                />
            )}
        </div>
    )
}
