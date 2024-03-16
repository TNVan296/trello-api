/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
/**
 * Lưu ý: Mặc định ta không cần phải custom message ở phía BE vì để cho FE tự validate và custom message
 * ( hiểu nôm na là phía FE tự validate và custom lỗi sao cho đẹp)
 * BE chỉ cần validate để đảm bảo dữ liệu được chuẩn xác, và trả về message mặc định từ thư viện.
 * ( nó như vầy: "ValidationError: \"title\" is not allowed to be empty. \"description\" is not allowed to be empty")
 * Quan trọng: việc Validate dữ liệu là BẮT BUỘC phải có ở phía BE vì đây là điểm cuối để lưu trữ dữ liệu
 * vào Database.
 * Và trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả FE và BE.
 */

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (ThuongNVa)',
      'string.empty': 'Title is not allowed to be empty (ThuongNVa)',
      'string.min': 'Title length must be at least 3 characters long (ThuongNVa)',
      'string.max': 'Title length must be less than or equal to 50 characters long (ThuongNVa)',
      // string.trim: phải đi kèm với strict vì nếu không có
      // khi người dùng vô tình nhập phải khoảng trống thì sẽ bỏ qua và nhận luôn cả khoảng trống
      'string.trim': 'Title must not have leading or trailing whitespace (ThuongNVa)'
    }),
    description: Joi.string().required().min(3).max(255).trim().strict().messages({
      'string.min': 'Description length must be at least 3 characters long (ThuongNVa)',
      'string.max': 'Description length must be less than or equal to 255 characters long (ThuongNVa)',
      'string.trim': 'Description must not have leading or trailing whitespace (ThuongNVa)'
    })
  })

  try {
    // console.log(req.body)

    // abortEarly: false
    // khi true dừng validation ở lỗi đầu tiên, nếu false sẽ trả toàn bộ lỗi được tìm thấy
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong, hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}