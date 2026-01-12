import { Image as ImageIcon, Upload } from 'lucide-react'

export default function PhotoGallery({ photos }: { photos: any[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Clinical Photos</h3>
                <button className="text-blue-600 text-sm font-semibold flex items-center gap-2 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Upload size={16} /> Upload Photo
                </button>
            </div>

            {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div key={photo.id} className="aspect-square bg-slate-100 rounded-lg relative group overflow-hidden">
                            {/* In a real app, use Next.js Image */}
                            <img
                                src={photo.url}
                                alt={photo.caption || 'Patient photo'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <p className="text-white text-xs font-medium truncate">
                                    {photo.caption || new Date(photo.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-sm border border-slate-200">
                        <ImageIcon size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No photos yet</p>
                    <p className="text-slate-400 text-sm">Upload X-rays or clinical photos here.</p>
                </div>
            )}
        </div>
    )
}
