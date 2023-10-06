import { useEffect, useState } from "react"
import MyInput from "../UI/Input/MyInput"
import MyButton from "../UI/Button/MyButton"
import { useDispatch, useSelector } from "react-redux"
import { addNewUsersAction } from "../../store/Reducers/authReducer"
import axios from "axios"

const AddUser = () => {
  const {users, userLogin, userPassword} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [newUser, setNewUser] = useState('')
  const [usersAll, setUsersAll] = useState(users)
  const [msg, setMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    let userExist = false;
    usersAll.map(user => {
      if (newUser === user.login) {
        userExist = true;
        setMsg("Пользователь с таким именем уже есть")
        return
      }
    })
    if (userExist) return
    setMsg("Пользователь успешно добавлен")
    const newUsersArray = [...usersAll, {role: '0', login: newUser, isBlock: '0', isIndividual: '0'}]
    setUsersAll(newUsersArray)
    dispatch(addNewUsersAction(newUsersArray))

    const formattedData = newUsersArray.map(user => `${user.role} ${user.login} ${user.isBlock} ${user.isIndividual} ${!user.password ? ' ' : user.password}`).join('\n');
    axios.post('/rewrite_file', {users: formattedData});
  }
  
  return (
    <div className='reset__password d-flex column center'>
      <h1>Добавление нового пользователя</h1>
      {msg && <h2 style={{color: msg === 'Пользователь успешно добавлен' && 'green'}}>{msg}</h2>}
      <form className='d-flex center column' onSubmit={(e) => handleSubmit(e)}>
        <MyInput fontSize='20px' changeFunc={(value) => setNewUser(value)} label='Введите имя' required={true} type='text' value={newUser}/>
        <MyButton backColor='red' text='Добавить' textColor='#FFF'/>
      </form>
    </div>
  )
}

export default AddUser