import { useState } from "react";
const InputField = (props) => {
  const { fieldName, placeholder, type = "text", id } = props;
  const [value, setValue] = useState("");
  return (
    <div style={{ textAlign: "center" }}>
      <p>{fieldName}</p>
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default InputField;
