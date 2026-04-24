import { useForm } from '@inertiajs/react';


export default function CreateRequest() {

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/requests');
    }

    return (
        <div className="p-6 max-w-lg mx-auto">

            <h2 className="text-2xl mb-4">Create Repair Request</h2>

            <form onSubmit={submit} className="space-y-4">

                <input
                    type="text"
                    placeholder="Title"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className="w-full border p-2"
                />
                {errors.title && <div>{errors.title}</div>}

                <textarea
                    placeholder="Description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="w-full border p-2"
                />
                {errors.description && <div>{errors.description}</div>}

                <select
                    value={data.category}
                    onChange={e => setData('category', e.target.value)}
                    className="w-full border p-2"
                >
                    <option value="">Select Category</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                </select>
                {errors.category && <div>{errors.category}</div>}

                <input
                    type="text"
                    placeholder="Location (e.g. Nairobi, Westlands)"
                    value={data.location}
                    onChange={e => setData('location', e.target.value)}
                    className="w-full border p-2"
                />
                {errors.location && <div>{errors.location}</div>}

                <input
                    type="date"
                    value={data.scheduled_date}
                    onChange={e => setData('scheduled_date', e.target.value)}
                    className="w-full border p-2"
                />
                {errors.scheduled_date && <div>{errors.scheduled_date}</div>}

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2"
                >
                    Submit Request
                </button>

            </form>
        </div>
    );
}