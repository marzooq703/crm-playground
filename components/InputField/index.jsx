const InputField = (props) => {
  const {
    fieldName,
    placeholder,
    type = "text",
    defaultValue,
    id,
    value,
  } = props;
  return (
    <div style={{ textAlign: "center" }}>
      <p>{fieldName}</p>
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        value={value}
      />
    </div>
  );
};

export default InputField;
