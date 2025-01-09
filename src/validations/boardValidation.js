import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

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
    description: Joi.string().required().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PRIVATE, BOARD_TYPES.PUBLIC).required()
  })

  try {
    // abortEarly: false
    // khi true dừng validation ở lỗi đầu tiên, nếu false sẽ trả toàn bộ lỗi được tìm thấy
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong, hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}