import Joi from 'joi'
import { ObjectId } from 'mongodb'
// Bắt đầu tương tác bất đồng bộ với Database r nên phải import ra nha !!!
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (Name & Schema)
// COLLECTION = Table (SQL)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  // Thời gian tạo ra vào ngay thời điểm được tạo
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updateAt: Joi.date().timestamp('javascript').default(null),
  // Bản ghi đã xóa hay chưa, nếu đã xóa thì là true
  // Nếu người dùng thực hiện xóa board thì ta sẽ gắn cho _destroy là true và không trả về dữ liệu đó cho người dùng
  // Bản chất đã xóa nhưng dữ liệu ở Database không thể xóa được
  _destroy: Joi.boolean().default(false)
})

// Validation dữ liệu trước khi khởi tạo API
const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Thao tác đến Database thì hầu như xử lý bất đồng bộ nhiều (async, await)
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

// Query tổng hợp (aggrerate) để lấy toàn bộ Columns và Cards thuộc Board
const getDetails = async (id) => {
  try {
    // tạm thời để giống findOneById (vì tương tự nhau)
    // update phần aggrerate sau
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails
}