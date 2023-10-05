import cl from './Button.module.css'

const MyButton = ({text, clickFunction, textColor, backColor, icon}) => {
  return (
    <button onClick={clickFunction ? clickFunction : null} style={{color: textColor, backgroundColor: backColor}}  className={cl.MyButton}>
      {icon ? icon : ''}
      {text}
    </button>
  )
}

export default MyButton