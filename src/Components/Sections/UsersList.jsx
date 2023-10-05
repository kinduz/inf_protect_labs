import { useSelector } from "react-redux"
import UserList from '../UI/UserList/UserList'

const UsersList = () => {

  const {users} = useSelector(state => state.auth)

  return (
    <div className="list__block d-flex column center">
      <h1 className="d-flex center">Список пользователей</h1>
      <UserList users={users} key={users.userLogin}/>
    </div>
  )
}

export default UsersList