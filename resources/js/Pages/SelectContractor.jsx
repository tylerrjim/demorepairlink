import { router } from '@inertiajs/react';

export default function SelectContractor({ repair, contractors }) {

    function selectContractor(id) {
        router.post(`/assign-contractor/${repair.id}`, {
            contractor_id: id
        });
    }

    return (
        <div className="p-6">

            <h2 className="text-2xl mb-4">
                Select Contractor for: {repair.title}
            </h2>

            <div className="grid gap-4">

                {contractors.map(c => (
                    <div key={c.id} className="border p-4 flex justify-between">

                        <div>
                            <p className="font-bold">{c.name}</p>
                            <p>{c.contractor_profile?.trade}</p>
                        </div>

                        <button
                            onClick={() => selectContractor(c.id)}
                            className="bg-green-600 text-white px-3 py-1"
                        >
                            Select
                        </button>

                    </div>
                ))}

            </div>
        </div>
    );
}