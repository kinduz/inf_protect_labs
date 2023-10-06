import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addNewUsersAction, setNewLimitsAction } from "../../../store/Reducers/authReducer"
import axios from "axios"

const UserItem = ({user}) => {

  const [isBlock, setIsBlock] = useState(user.isBlock === '0' ? false : true)
  const [isIndividual, setIsIndividual] = useState(user.isIndividual === '0' ? false : true)

  const {users, userLogin} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const setNewUsers = (type) => {
    let blockUser = isBlock;
    let individualUser = isIndividual;
    if (type === 1) {
      blockUser = !blockUser;
      setIsBlock(!isBlock)
    } 
    if (type === 2) {
      individualUser = !individualUser;
      setIsIndividual(!isIndividual)
    }
    
    const updatedUsers = users.map(currentUser => {
      if (user.login === currentUser.login) {
        return {...currentUser, isBlock: blockUser === false ? '0' : '1', isIndividual: individualUser === false ? '0' : '1'}
      }
      return currentUser;
    })

    console.log(updatedUsers);

    try {
      dispatch(addNewUsersAction(updatedUsers))
      dispatch(setNewLimitsAction(blockUser === false ? '0' : '1', individualUser === false ? '0' : '1'))
      const formattedData = updatedUsers.map(user => `${user.role} ${user.login} ${user.isBlock} ${user.isIndividual} ${!user.password ? ' ' : user.password}`).join('\n');
      console.log(formattedData);
      axios.post('/rewrite_file', {users: formattedData})
    }
    catch(e) {
      console.log(e);
    }
  }


  return (
    <div className="current__user d-flex">
      <div className="current__user-login">{user.login}</div>
      <div className="current__user-limits d-flex">
        <div className="input__box-access d-flex center">
          <span>Доступ: </span>
          <input type="checkbox" className="checkbox-input" id="checkbox" value={isBlock} defaultChecked={isBlock} onChange={(type) => setNewUsers(1)} />
        </div>
        <div className="input__box-access d-flex center">
          <span>Индивидуальное ограничение: </span>
          <input type="checkbox" className="checkbox-input" id="checkbox" value={isIndividual} defaultChecked={isIndividual} onChange={(type) => setNewUsers(2)} />
        </div>
      </div>
    </div>
  )
}

export default UserItem