const Heading = (props) => {
  const { title, style } = props;
  return <h1 style={{ ...style }}>{title}</h1>;
};
export default Heading;
