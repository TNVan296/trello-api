/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

// eslint-disable-next-line no-unused-vars
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// Khởi tạo 1 object trelloDatabaseInstance ban đầu với giá trị null (vì ta chưa connect)
let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // Lưu ý: đọc thêm tài liệu dưới đường link đây
  // https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
  // serverApi: {
  //   version: ServerApiVersion.v1,
  //   strict : true,
  //   deprecationErrors: true
  // }
})

// Kết nối tới Database
export const CONNECT_DB = async () => {
  // gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến
  // trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Đóng kết nối Database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

// Function GET_DB (không async) này có nhiệm vụ export ra Trello Database Instance
// sau khi đã connect thành công tới MongoDB để ta sử dụng ở nhiều nơi khác nhau
// trong code
// Lưu ý: phải đảm bảo chỉ luôn gọi GET_DB này sau khi đã connect thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to the database first !')
  return trelloDatabaseInstance
}