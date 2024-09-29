import * as req from './APIs/adminService'
import * as reqUser from './APIs/userService'
import * as reqCat from './APIs/catalogoService'

export default{
    ...req,
    ...reqUser,
    ...reqCat
}