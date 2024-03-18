/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
// import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)
    // console.log('req.query: ', req.query)
    // console.log('req.params: ', req.params)
    // console.log('req.files: ', req.files)
    // console.log('req.cookies: ', req.cookies)
    // console.log('req.jwtDecoded', req.jwtDecoded)

    // Điều hướng dữ liệu sang tầng Service
    const createBoard = await boardService.createNew(req.body)

    // sinh lỗi để xử lý tầng middleware
    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'This is test error')

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    // khi gọi next(error) hay ở những chỗ ta muốn trả ra lỗi ở những chỗ xử lý
    // logic thì ExpressJS sẽ đưa về những chỗ xử lý lỗi tập trung (Middleware)
    next(error)
  }
}

export const boardController = {
  createNew
}