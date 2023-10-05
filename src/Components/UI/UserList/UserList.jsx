import UserItem from '../UserItem/UserItem'

const UserList = ({users}) => {
  return (
    <div className='users__list d-flex column '>
      {users.map(user =>  
        <UserItem user={user} key={user.login}/>
      )}
    </div>
  )
}

export default UserList