import axios from '@/apis/index'

const fileUrl = '/file'
export function uploadFile (file) {
  const formData = new FormData()
  formData.append('file', file)
  axios.post(fileUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
