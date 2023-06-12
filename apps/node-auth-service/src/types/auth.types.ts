import { UserAttrs } from '../models'

export interface RegisterBody extends UserAttrs {} // eslint-disable-line
export interface LoginBody {
  username: string
  password: string
}
