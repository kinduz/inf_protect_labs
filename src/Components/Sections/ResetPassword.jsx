import { useEffect, useState } from 'react'
import MyInput from '../../Components/UI/Input/MyInput'
import MyButton from '../../Components/UI/Button/MyButton'
import { useDispatch, useSelector } from 'react-redux'
import { addAllUsers, setNewPasswordAction } from '../../store/Reducers/authReducer'
import axios from 'axios'

const ResetPassword = () => {

  const {users, userLogin, userPassword, isIndividual} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [submitMsg, setSubmitMsg] = useState('')
  const [usersAll, setUsersAll] = useState(users)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPassword !== userPassword) {
      setSubmitMsg("Текущий пароль не совпадает с указанным")
      return;
    }
    if (newPassword === userLogin && isIndividual !== '0') {
      setSubmitMsg("Пароль данного аккаунта не может иметь значение логина пользователя")
      return;
    }
    
    const updatedUsers = usersAll.map(user => {
      if (user.login === userLogin) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    
    dispatch(addAllUsers(updatedUsers))
    dispatch(setNewPasswordAction(newPassword))
    setSubmitMsg("Пароль успешно изменен")


    const formattedData = usersAll.map(user => `${user.role} ${user.login} ${user.isBlock} ${user.isIndividual} ${user.login === userLogin ? newPassword : !user.password ? ' ' : user.password}`).join('\n');
    axios.post('/rewrite_file', {users: formattedData})
  }

  return (
    <div className='reset__password d-flex column center'>
      <h1>Сброс пароля пользователя</h1>
      {submitMsg && <h2 style={{color: submitMsg === 'Пароль успешно изменен' && 'green'}}>{submitMsg}</h2>}
      <form className='d-flex center column' onSubmit={(e) => handleSubmit(e)}>
        <MyInput changeFunc={(value) => setOldPassword(value)} value={oldPassword} label='Введите текущий пароль' type='password' required={true}/>
        <MyInput changeFunc={(value) => setNewPassword(value)} value={newPassword} label='Введите новый пароль' type='password' required={true}/>
        <MyButton backColor='red' textColor='#FFF' text='Сменить пароль' clickFunction={(e) => handleSubmit(e)}/>
      </form>
    </div>
  )
}

export default ResetPassword