import cl from './MyInput.module.css'

const MyInput = ({ type, value, label, required, changeFunc, fontSize}) => {
  return (
    <div className={cl.input__container}>
      <input placeholder={label} style={{ fontSize: fontSize }} value={value} type={type} onChange={(e) => changeFunc(e.target.value)} className={cl.input} required={required}/>
    </div>
  );
};

export default MyInput;
