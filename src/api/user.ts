import { User } from '@/type'
import request from '@/utils/request'

// 登录
export function api_login(loginInfo: { userName: string, password: string }) {
  return request.post('/users/login', loginInfo) as unknown as loginType
}

type loginType = {
  code: number,
  msg: string,
  userInfo: User
}

// 注册
export function api_signin(userInfo: { userName: string, password: string, email?: string, avatar?: string }) {
  return request.post('/users/signin', userInfo) as unknown as signinType
}

type signinType = {
  code: number,
  msg: string,
  userInfo: User
}

// 判断是否登录
export function api_getLogin() {
  return request.get('/users/getlogin') as unknown as getLoginType
}

type getLoginType = {
  code: number,
  msg: string,
  userInfo: User
}

// 退出登录
export function api_logout() {
  return request.get('/users/logout') as unknown as logoutType
}

type logoutType = {
  code: number,
  msg: string,
}

// 获取用户信息
export function api_getUserInfo(params: { userId: string }) {
  return request.get('/users/get_user_info', { params }) as unknown as getUserInfoType
}

type getUserInfoType = {
  code: number,
  userInfo: User,
}
