import React from "react";

const SubmitButton = ({ children }) => {
    return (
        <button type="submit" style={styles.button}>
            {children}
        </button>
    );
};

const styles = {
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2%",
        backgroundColor: "#F58E2F",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        width: "30%",
        alignSelf: "center",
        maxHeight: "20%",
    },
};

export default SubmitButton;
