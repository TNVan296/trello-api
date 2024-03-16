/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. Hello ${env.AUTHOR}, Back-End Server is running successfully at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  // Thực hiện các tác vụ Cleanup trước khi dùng Server
  exitHook(() => {
    console.log('4. Server is shutting down ...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Atlas Cloud !')
  })
}

// chỉ khi kết nối tới Database thành công thì Start Server Back-End lên.
// Immediately-Invoked / Anonymous Async Functions (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas ...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas !')

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// // chỉ khi kết nối tới Database thành công thì Start Server Back-End lên.
// console.log('1. Connecting to MongoDB Cloud Atlas ...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas !'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })