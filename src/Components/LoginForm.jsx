import { useEffect, useState } from 'react'
import MyInput from '../Components/UI/Input/MyInput'
import MyButton from '../Components/UI/Button/MyButton'
import { useDispatch } from 'react-redux'
import { addAllUsers, loginAction } from '../store/Reducers/authReducer'
import axios from 'axios'


const LoginForm = () => {

  const dispatch = useDispatch()
  const [usersList, setUsersList] = useState([]);

  const [stepAuth, setStepAuth] = useState(1)
  const [isUserHasPassword, setIsUserHasPassword] = useState(null)
  const [loginValue, setLoginValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [errorMsg, setErrorMsg] = useState('')


  useEffect(() => {
    axios.get('/get_users').then(response => {
      setUsersList(response.data)
    })
    .catch(e => {
      console.log(e);
    })
  }, []);

  useEffect(() => {
    if (usersList) {
      console.log(usersList);
      dispatch(addAllUsers(usersList))
    }
  }, [usersList])


  const readDataFile = (e) => {
    e.preventDefault()
    if (stepAuth === 1) {
      const isUser = usersList.find(user => user.login === loginValue)
      if (isUser) {
        setIsUserHasPassword(isUser.password)
        setErrorMsg('')
        setStepAuth(2)
      }
      else {
        setErrorMsg("Пользователя с таким логином не существует")
      }
      return
    }
    const foundedUser = usersList.find(user => user.login === loginValue && isUserHasPassword === passwordValue)
    if (foundedUser) {
      setErrorMsg('');
      dispatch(loginAction(foundedUser.role, foundedUser.login, foundedUser.isBlock, foundedUser.isIndividual, foundedUser.password))
    }
    else {
      setErrorMsg('Неправильный пароль, повторите попытку');
    }
  }

  return (
    <form className="auth__content d-flex column center" onSubmit={(e) => readDataFile(e)}>
      <h1>Авторизация</h1>
      <div className="form__inputs d-flex column" >
        {stepAuth === 1 ?
          <MyInput fontSize='20px' changeFunc={(value) => setLoginValue(value)} value={loginValue} label='Введите логин' required={true} type='text'/>
        :
          <MyInput fontSize='20px' changeFunc={(value) => setPasswordValue(value)} value={passwordValue} label={isUserHasPassword ? 'Введите пароль' : 'Создайте пароль'} required={true} type='password'/>
        }
      </div>
      <MyButton  text={stepAuth === 1 ? 'Далее' : 'Авторизоваться'} />
      {errorMsg && 
        <span className='error__msg'>{errorMsg}</span>
      }
    </form>
  )
}

export default LoginForm