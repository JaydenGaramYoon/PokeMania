
// import express from 'express'
// import userCtrl from '../controllers/user.controller.js'
// import authCtrl from '../controllers/auth.controller.js'
// import {isAdmin} from '../controllers/user.controller.js'

// const router = express.Router()
// router.route('/api/users')
//     .get(userCtrl.list)
//     .post(userCtrl.create)

// router.get('/api/users/me', authCtrl.requireSignin, (req, res) => {
//   res.json(req.auth);
// });

// router.route('/api/users/:userId')
//     .get(authCtrl.requireSignin, userCtrl.read)
//     .put(authCtrl.requireSignin, authCtrl.hasAuthorization,
//         userCtrl.update)
//     .delete(authCtrl.requireSignin, isAdmin, authCtrl.hasAuthorization,
//         userCtrl.remove)
// router.param('userId', userCtrl.userByID)
// router.route('/api/users/:userId').get(userCtrl.read)
// router.route('/api/users/:userId').put(userCtrl.update)
// router.route('/api/users/:userId').delete(userCtrl.remove)
// router.route('/api/users/:userId/password').put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.changePassword)
// router.route('/api/users/:userId/role').put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.updateRole)
// export default router

import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import { isAdmin } from '../controllers/user.controller.js'

const router = express.Router()

// 전체 유저 목록 조회 및 회원가입
router.route('/api/users')
    .get(authCtrl.requireSignin, isAdmin, userCtrl.list)  // 관리자인 경우만 전체 목록 조회 가능
    .post(userCtrl.create)

// 현재 로그인된 유저 정보 조회
router.get('/api/users/me', authCtrl.requireSignin, (req, res) => {
  res.json(req.auth)
})

// 개별 유저 정보 읽기 / 수정 / 삭제
router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, isAdmin, userCtrl.remove)

// 비밀번호 변경 (관리자 또는 본인 가능)
router.route('/api/users/:userId/password')
  .put(authCtrl.requireSignin, (req, res, next) => {
    // 본인 또는 관리자만 접근 가능
    if (req.auth._id === req.params.userId || req.auth.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Access denied' });
  }, userCtrl.changePassword);
  
// 역할 변경 (관리자만 가능)
router.route('/api/users/:userId/role')
    .put(authCtrl.requireSignin, isAdmin, userCtrl.updateRole)

// userId param resolver
router.param('userId', userCtrl.userByID)

export default router
