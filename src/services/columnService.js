import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Xử lý cấu trúc data ở đây trước khi trả về dữ liệu
      getNewColumn.cards = []
    }

    // Cập nhật mảng columnOrderIds trong collection boards
    await boardModel.pushColumnOrderIds(getNewColumn)

    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }

    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    // Xóa Column
    await columnModel.deleteOneById(columnId)
    // Xóa toàn bộ Card thuộc Column đó
    await cardModel.deleteManyByColumnId(columnId)

    return { deleteResult: 'Column and its Cards deleted Successfully !' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}