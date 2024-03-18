/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xử lý logic dữ liệu tùy đặc thù của dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    // ...

    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án ...
    // Bắn email, notification về cho admin khi có 1 board mới được tạo ra ...
    // Trả kết quả về trong Service (lưu ý là luôn phải có return, nếu không là nó cứ request đến chết web luôn đó)
    return newBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}