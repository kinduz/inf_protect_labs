import { useEffect, useState } from 'react'
import MyInput from '../Components/UI/Input/MyInput'
import MyButton from '../Components/UI/Button/MyButton'
import { useDispatch } from 'react-redux'
import { addNewUsersAction, loginAction } from '../store/Reducers/authReducer'
import axios from 'axios'


const LoginForm = () => {

  const dispatch = useDispatch()
  const [usersList, setUsersList] = useState([]);

  const [stepAuth, setStepAuth] = useState(1)
  const [isUserHasPassword, setIsUserHasPassword] = useState(null)
  const [loginValue, setLoginValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [makePassword, setMakePassword] = useState('')
  const [confirmMakePassword, setConfirmMakePassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isBlockUser, setIsBlockUser] = useState(false)


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
      dispatch(addNewUsersAction(usersList))
    }
  }, [usersList])


  const readDataFile = (e) => {
    e.preventDefault()
    if (stepAuth === 1) {
      const isUser = usersList.find(user => user.login === loginValue)
      if (isUser && isUser.isBlock === '1') {
        setIsBlockUser(true)
        return
      }
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
    if (isUserHasPassword) {
      const foundedUser = usersList.find(user => user.login === loginValue && isUserHasPassword === passwordValue)
      if (foundedUser) {
        setErrorMsg('');
        dispatch(loginAction(foundedUser.role, foundedUser.login, foundedUser.isBlock, foundedUser.isIndividual, foundedUser.password))
      }
      else {
        setErrorMsg('Неправильный пароль, повторите попытку');
      }
    }
    else {
      const foundedUser = usersList.find(user => user.login === loginValue)
      if (makePassword === confirmMakePassword) {
        if (makePassword === foundedUser.login && foundedUser.isIndividual === '1') {
          setErrorMsg("Пароль данного аккаунта не может иметь значение логина пользователя")
          return
        }
        let userWithPassword = {...foundedUser, password: makePassword};
        const newUsersList = usersList.map(user => {
          if (user.login === loginValue) {
            return {...user, password: makePassword}
          }
          return user
        })
        const formattedData = newUsersList.map(user => `${user.role} ${user.login} ${user.isBlock} ${user.isIndividual} ${user.password ? user.password : ' '}`).join('\n');
        axios.post('/rewrite_file', {users: formattedData})
        setUsersList(newUsersList)
        dispatch(addNewUsersAction(newUsersList))
        setErrorMsg('');
        dispatch(loginAction(userWithPassword.role, userWithPassword.login, userWithPassword.isBlock, userWithPassword.isIndividual, userWithPassword.password))
      }
      else {
        setErrorMsg("Введенные пароли должны совпадать")
        return
      }
    }
  }

  return (
    <>
      {isBlockUser ? (
        <div className="user__block d-flex center column">
          Ваш аккаунт не имеет доступа к системе
          <MyButton clickFunction={() => {setLoginValue(''); setErrorMsg(''); setIsBlockUser(false)}} backColor='black' textColor='#FFF' text='Вернуться к авторизации'/>
        </div>
      ) : (
        <form
          className="auth__content d-flex column center"
          onSubmit={(e) => readDataFile(e)}
        >
          <h1>Авторизация</h1>
          <div className="form__inputs d-flex column">
            {stepAuth === 1 ? (
              <MyInput
                fontSize="20px"
                changeFunc={(value) => setLoginValue(value)}
                value={loginValue}
                label="Введите логин"
                required={true}
                type="text"
              />
            ) : isUserHasPassword ? (
              <MyInput
                fontSize="20px"
                changeFunc={(value) => setPasswordValue(value)}
                value={passwordValue}
                label="Введите пароль"
                required={true}
                type="password"
              />
            ) : (
              <div className="make__password d-flex column center">
                <MyInput
                  fontSize="20px"
                  changeFunc={(value) => setMakePassword(value)}
                  value={makePassword}
                  label="Создайте пароль"
                  required={true}
                  type="password"
                />
                <MyInput
                  fontSize="20px"
                  changeFunc={(value) => setConfirmMakePassword(value)}
                  value={confirmMakePassword}
                  label="Подтвердите пароль"
                  required={true}
                  type="password"
                />
              </div>
            )}
          </div>
          <MyButton text={stepAuth === 1 ? "Далее" : "Авторизоваться"} />
          {errorMsg && <span className="error__msg">{errorMsg}</span>}
        </form>
      )}
    </>
  );
}

export default LoginForm