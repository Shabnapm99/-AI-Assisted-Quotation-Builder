import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { validateForm } from '../utility/formValidation';
import { axiosInstance } from '../axios/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setClients, setIsEditing, setSelectedClient } from '../features/clientSlice';


function NewClient({ onClose }) {
    let dispatch = useDispatch();
    const clients = useSelector((state) => state.client.clients);
    const isEditing = useSelector((state) => state.client.isEditing);
    const id = useSelector((state) => state.client.uniqueId);

    const [formData, setFormData] = useState(() => {
        if (isEditing && id) {
            const editingClient = clients.find((client) => client?._id === id);
            if (editingClient) {
                return {
                    name: editingClient.name || '',
                    company: editingClient.company || '',
                    email: editingClient.email || '',
                    phone: editingClient.phone || '',
                    notes: editingClient.notes || ''
                };
            }
        }
        return {
            name: '',
            company: '',
            email: '',
            phone: '',
            notes: ''
        };
    });

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(formData)) return;
        const success = await addClientData();
        if (success) {
            onClose();
        }
    };

    const addClientData = async () => {
        try {
            // Edit Client
            if (isEditing) {
                try {
                    let response = await axiosInstance.put(`/clients/${id}`, formData);
                    if (response.status === 200) {
                        let updatedClient = response?.data?.client;
                        dispatch(setSelectedClient(updatedClient));
                        dispatch(setClients(clients.map((client) => client._id === id ? updatedClient : client)));
                        dispatch(setIsEditing({
                            boolean: false,
                            id: null
                        }));
                        toast.success('Client profile edited successfully');
                        return true;
                    }
                } catch (error) {
                    console.error(`Error editing client: ${error.message}`);
                    toast.error(error.response?.data?.message || 'Could not complete edit request');
                    return false;
                }
            } else {
                // Add client
                try {
                    let response = await axiosInstance.post('/clients', formData);
                    const newClient = response?.data?.client;
                    if (newClient) {
                        dispatch(setClients([newClient, ...clients]));
                    }
                    toast.success('Client profile added successfully');
                    return true;
                } catch (error) {
                    console.error(`Error adding client: ${error.message}`);
                    toast.error(error.response?.data?.message || 'Could not complete add request');
                    return false;
                }
            }
        } catch (error) {
            toast.error(`Something went wrong: ${error.message}`);
            return false;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in">
            {/* Backdrop overlay closer */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant flex flex-col z-10 transform transition-all">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-outline-variant">
                    <div>
                        <h3 className="text-xl font-semibold text-on-surface tracking-tight">
                            {isEditing ? "Edit Client" : "Add New Client"}
                        </h3>
                        <p className="text-sm text-on-surface-variant mt-0.5">
                            Fill in the details to create a new enterprise profile.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Client Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">
                            Client Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className="w-full px-3.5 py-2 rounded-lg border border-outline bg-background text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-on-surface-variant mb-1">
                            Company *
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. ABC Corp"
                            className="w-full px-3.5 py-2 rounded-lg border border-outline bg-background text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                        />
                    </div>

                    {/* Grid Layout for Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@company.com"
                                className="w-full px-3.5 py-2 rounded-lg border border-outline bg-background text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-on-surface-variant mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+973 9999 0000"
                                className="w-full px-3.5 py-2 rounded-lg border border-outline bg-background text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-on-surface-variant mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add contract terms, project scope details, or partnership status..."
                            className="w-full px-3.5 py-2 rounded-lg border border-outline bg-background text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none transition-all"
                        />
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 bg-surface-container border border-outline-variant text-on-surface font-medium text-sm rounded-lg hover:bg-surface-container-high transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-secondary text-on-secondary font-medium text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                            Save Client
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default NewClient;