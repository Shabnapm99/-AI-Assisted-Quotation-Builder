import { toast } from "react-toastify";

export const validateForm = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const name = (data?.name || '').trim();
    const company = (data?.company || '').trim();
    const email = (data?.email || '').trim();

    if (!name) {
        toast.error('Client name is required');
        return false;
    }
    if (name.length < 2) {
        toast.error('Name must be at least 2 characters long');
        return false;
    }
    if (!company) {
        toast.error('Company name is required');
        return false;
    }
    if (!email) {
        toast.error('Email address is required');
        return false;
    }
    if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
    }
        // Phone is optional, validate only if the user typed something
        // if (data.phone.trim() && !phoneRegex.test(data.phone.trim())) {
        //     toast.error('Please enter a valid phone number format');
        //     return false;
        // }

        return true;
    };