import http from '@/apis/http'

const $apiUpload = {
    upload (formData: FormData) {
        return http<string>({
            url: 'upload',
            method: 'POST',
            data: formData,
            loading: true
        })
    }
}

export default $apiUpload