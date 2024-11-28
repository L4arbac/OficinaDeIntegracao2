import React from "react";

const InputField = ({ label, type, id, value, onChange, required }) => {
    return (
        <div style={styles.inputGroup}>
            <label htmlFor={id} style={styles.label}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                style={styles.input}
                required={required}
            />
        </div>
    );
};

const styles = {
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%", 
    },
    label: {
        alignSelf: "center",
        marginBottom: "5px",
        fontWeight: "bold",
        marginRight: "40%",
    },
    input: {
        width: "45%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "16px",
    },
};

export default InputField;
