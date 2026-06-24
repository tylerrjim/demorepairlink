import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function ReviewModal({ request, onClose }) {
    const [hoveredStar, setHoveredStar] = useState(0);
    
    // Wire up Inertia form handling
    const { data, setData, post, processing, errors } = useForm({
        repair_request_id: request.id,
        rating: 0,
        review: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviews.store'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl transform transition-all border border-gray-100 overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                    <h3 className="font-bold text-lg">Rate Your Experience</h3>
                    <p className="text-xs text-green-100 mt-1">
                        How did {request.contractor?.name || 'the contractor'} do with your repair?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Error Display */}
                    {errors.rating && (
                        <div className="mb-4 text-sm text-red-600 font-semibold bg-red-50 p-2 rounded border border-red-200">
                            ⚠️ Please select a star rating before submitting.
                        </div>
                    )}

                    {/* Star Interactive Row */}
                    <div className="flex flex-col items-center justify-center my-4">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="text-4xl transition transform hover:scale-110 focus:outline-none"
                                >
                                    <span className={(hoveredStar || data.rating) >= star ? 'text-amber-400' : 'text-gray-300'}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium mt-2">
                            {data.rating > 0 ? `${data.rating} out of 5 Stars` : 'Tap to rate'}
                        </span>
                    </div>

                    {/* Review Input Box */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Optional Comments
                        </label>
                        <textarea
                            rows="3"
                            value={data.review}
                            onChange={(e) => setData('review', e.target.value)}
                            placeholder="Type a short note about the work quality, punctuality, or communication..."
                            className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 border"
                            maxLength="1000"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || data.rating === 0}
                            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow transition"
                        >
                            {processing ? 'Saving...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}