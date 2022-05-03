import axios from '@/apis/index'

const fileUrl = '/file'
export function uploadFile (file, otherFliedObj = {}) {
  const formData = new FormData()
  formData.append('file', file)
  // 其它字段
  Object.keys(otherFliedObj).forEach(key => {
    formData.append(key, otherFliedObj[key])
  })
  return axios.post(fileUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
