import { FileItem } from '@/type'
import request from '@/utils/request'

// 获取文件列表
export function api_getFileList(params: { lastTime?: number }) {
  return request.get('/files/get_file_list', { params }) as unknown as getFileListType
}

type getFileListType = {
  code: number,
  list: FileItem[],
}