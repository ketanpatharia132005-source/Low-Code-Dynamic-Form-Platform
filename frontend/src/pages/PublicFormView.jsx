import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FieldRenderer from "../components/builder/FieldRenderer";
import { submitPublicForm } from "../api/api";

const PublicFormView = () => {
    const { token } = useParams(); // Grabs the token from the URL
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rules, setRules] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                // Call your backend to get the form by the token
                const response = await fetch(`http://localhost:8001/api/v1/forms/share/${token}`);

                
                if (!response.ok) {
                    throw new Error("Could not find form");
                }
                
                const data = await response.json();
                setForm(data);

                const rulesResponse = await fetch(
                    `http://localhost:8001/api/v1/forms/${data.id}/rules`
                );

                const rulesData = await rulesResponse.json();

                setRules(rulesData);
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


    const shouldDisplayField = (fieldId) => {
       const fieldRules = rules.filter(
         (r) => String(r.target_field_id) === String(fieldId)
       );

       if (fieldRules.length === 0) return true;

       for (const rule of fieldRules) {
         const fieldValue = formValues[rule.trigger_field_id] ?? "";
         const compareValue = rule.comparison_value;

         let result = false;

         switch (rule.operator) {
           case "equals":
           result = String(fieldValue) === String(compareValue);
           break;

           case "not_equals":
           result = String(fieldValue) !== String(compareValue);
           break;

           case "greater_than":
           result = Number(fieldValue) > Number(compareValue);
           break;

           case "less_than":
           result = Number(fieldValue) < Number(compareValue);
           break;
 
           case "greater_than_or_equal":
           result = Number(fieldValue) >= Number(compareValue);
           break;

           case "less_than_or_equal":
           result = Number(fieldValue) <= Number(compareValue);
           break;

           case "contains":
           result = String(fieldValue).includes(String(compareValue));
           break;

           case "starts_with":
           result = String(fieldValue).startsWith(String(compareValue));
           break;

           case "ends_with":
           result = String(fieldValue).endsWith(String(compareValue));
           break;

           case "is_empty":
           result = fieldValue === "";
           break;

           case "is_not_empty":
           result = fieldValue !== "";
           break;

           default:
           result = false;
        }

        if (rule.action === "hide" && result) {
          return false;
        }

        if (rule.action === "show" && !result) {
          return false;
        }
      

  return true;
};

return rule.action === "hide" ? !result : result;
};

const validateField = (field, value) => {
    const required =
        field.required ||
        field.is_required ||
        field.config?.required;

    const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);
    const fieldType = field.field_type || field.type;

    if (
        fieldType === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
        return {
            message: "Please enter a valid email address.",
        };
    }

    const config =
        typeof field.config === "string"
            ? JSON.parse(field.config)
            : field.config || {};

    const minLength = config.min_length;
    const maxLength = config.max_length;

    if (
       (fieldType === "text" || fieldType === "textarea") &&
       value
    ) {
        if (minLength && value.length < minLength) {
            return {
               message: `${field.label} must be at least ${minLength} characters.`,
            };
        }

        if (maxLength && value.length > maxLength) {
            return {
               message: `${field.label} must not exceed ${maxLength} characters.`,
            };
       }
    }
   
    if (fieldType === "number" && value !== "") {
        const numberValue = Number(value);

        if (isNaN(numberValue)) {
            return {
                message: `${field.label} must be a valid number.`,
            };
        }

        if (
           config.min !== undefined &&
           numberValue < Number(config.min)
        ) {
            return {
                message: `${field.label} must be at least ${config.min}.`,
            };
        }

        if (
            config.max !== undefined &&
            numberValue > Number(config.max)
        ) {
            return {
                message: `${field.label} must not exceed ${config.max}.`,
            };
        }

        if (
            config.integer_only &&
            !Number.isInteger(numberValue)
        ) {
            return {
               message: `${field.label} must be a whole number.`,
            };
       }
    }

    if (fieldType === "date" && value) {
        const selectedDate = new Date(value);

        if (isNaN(selectedDate.getTime())) {
            return {
                message: "Please select a valid date.",
            };
        }

        if (config.min_date) {
            const minDate = new Date(config.min_date);

            if (selectedDate < minDate) {
                return {
                   message: `${field.label} cannot be before ${config.min_date}.`,
                };
            }
        }

        if (config.max_date) {
            const maxDate = new Date(config.max_date);

            if (selectedDate > maxDate) {
                return {
                   message: `${field.label} cannot be after ${config.max_date}.`,
                };
            }
        }
    }

    if (fieldType === "dropdown" && value) {
        const options = config.options || [];

        const allowedValues = options.map((option) =>
            typeof option === "object"
              ? option.value || option.label
              : option
            );

        if (!allowedValues.includes(value)) {
            return {
                message: `Please select a valid ${field.label}.`,
            };
       }
    }

    if (fieldType === "checkbox") {
        const options = config.options || [];

        const allowedValues = options.map((option) =>
           typeof option === "object"
              ? option.value || option.label
              : option
        );

        const selectedValues = Array.isArray(value) ? value : [];

        const invalidOption = selectedValues.find(
            (selected) => !allowedValues.includes(selected)
        );

        if (invalidOption) {
            return {
               message: `Please select valid ${field.label} option(s).`,
            };
        }
    }

    if (fieldType === "rating" && value !== "") {
        const rating = Number(value);
        const maxRating = config.scale || 5;

        if (isNaN(rating)) {
            return {
               message: `${field.label} must be a valid rating.`,
            };
        }

        if (rating < 1 || rating > maxRating) {
            return {
               message: `${field.label} must be between 1 and ${maxRating}.`,
            };
       }
    } 


    return null;
};

const validateForm = () => {
    const errors = {};

    form.fields
        .filter((field) => shouldDisplayField(field.id))
        .forEach((field) => {
            const error = validateField(
                field,
                formValues[field.id]
            );

            if (error) {
                errors[String(field.id)] = error;
            }
        });

    return errors;
};
const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double-clicks
    if (submitting) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
       setFieldErrors(validationErrors);
       return;
    }

    setFieldErrors({});

    setSubmitting(true);

    try {
        const responses = Object.entries(formValues).map(([field_id, value]) => {
    // Convert File objects into JSON-friendly metadata
            if (value instanceof File) {
                return {
                    field_id,
                    value: {
                        name: value.name,
                        size: value.size,
                        type: value.type,
                    },
                };
            }

            return {
                field_id,
                value,
            };
        });

        const response = await submitPublicForm(token, responses);

        setFieldErrors({});
        setFormValues({});
        
         navigate("/submission-success", {
            state: response.data,
        });

    } catch (error) {
        console.error("Submission failed:", error);

        const errors = error.response?.data?.detail?.errors;

        if (errors) {
           setFieldErrors(errors);
        } else {
            alert(
              error.response?.data?.detail?.message ||
              "Failed to submit form."
            );
        }
    }finally{
       setSubmitting(false);
    }

};


    return (
        <div className="form-card">
            <h1>{form.title}</h1>
            <form noValidate onSubmit={handleSubmit}>
                {form.fields &&
                   form.fields
                      .filter((field) => shouldDisplayField(field.id))
                      .map((field) => (
        <div key={field.id} style={{ marginBottom: "20px" }}>
          <FieldRenderer
            field={field}
            value={formValues[field.id] || ""}
            error={fieldErrors[String(field.id)]}
            onChange={(value) => {
               setFormValues((prev) => ({
                    ...prev,
                    [field.id]: value,
               }));

               const error = validateField(field, value);


                setFieldErrors((prev) => {
                      const updated = { ...prev };
                       if (error) {
                            updated[String(field.id)] = error;
                       } else {
                           delete updated[String(field.id)];
                       }
                      return updated;
                });
            }}
            setFieldErrors={setFieldErrors}

        />

        {fieldErrors[String(field.id)] && (
            <p
                style={{
                   color: "#dc2626",
                   fontSize: "14px",
                   marginTop: "6px",
                }}
            >
                {fieldErrors[String(field.id)].message}
            </p>
        )}
    </div>
  ))}
                <button
                   type="submit"
                   disabled={submitting}
                   style={{
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? "not-allowed" : "pointer",
                   }}
                >
                    {submitting ? "Submitting..." : "Submit Form"}
                </button>
            </form>
        </div>
    );
};


export default PublicFormView;