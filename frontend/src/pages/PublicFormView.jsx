import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FieldRenderer from "../components/builder/FieldRenderer";

const PublicFormView = () => {
    const { token } = useParams(); // Grabs the token from the URL
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                // Call your backend to get the form by the token
                const response = await fetch(`http://localhost:8001/forms/share/${token}`);

                
                if (!response.ok) {
                    throw new Error("Could not find form");
                }
                
                const data = await response.json();
                console.log("Full data from server:", data);
                setForm(data);
            } catch (err) {
                console.error("Error fetching form:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [token]);

    if (loading) return <div>Loading form...</div>;
    
    // If we finished loading, but still have no form, show the error
    if (!form) return <div>Form not found or invalid link.</div>;

    return (
        <div className="form-card">
            <h1>{form.title}</h1>
            <form>
                {form.fields && form.fields.map((field) => (
                    <div key={field.id} style={{ marginBottom: '20px' }}>
                        <FieldRenderer field={field} />
                    </div>
                ))}
                <button type="submit">Submit Form</button>
            </form>
        </div>
    );
};


export default PublicFormView;