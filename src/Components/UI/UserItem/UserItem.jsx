import { useState } from "react"
import MyInput from "../Input/MyInput"

const UserItem = ({user}) => {

  const [isBlock, setIsBlock] = useState(user.isBlock === '0' ? false : true)
  const [isIndividual, setIsIndividual] = useState(user.isIndividual === '0' ? false : true)

  return (
    <div className="current__user d-flex">
      <div className="current__user-login">{user.login}</div>
      <div className="current__user-limits">
        <MyInput type='checkbox'  value={isBlock} changeFunc={() => setIsBlock(!isBlock)}/>
        <MyInput type='checkbox' value={isIndividual} changeFunc={() => setIsIndividual(!isIndividual)}/>
        {user.isBlock} {user.isIndividual}

      </div>
    </div>
  )
}

export default UserItem