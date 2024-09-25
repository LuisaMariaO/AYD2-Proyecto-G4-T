import * as req from './APIs/adminService'
import * as reqUser from './APIs/userService'

export default{
    ...req,
    ...reqUser
}