import axios, { AxiosError } from 'axios'
import IRequest from '@/models/IRequest'
import IResponse from '@/models/IResponse'
import router from '@/routers'

const instance = axios.create({ baseURL: '/api/', timeout: 3000 })

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(res => {
    return res
}, error => {
    return Promise.reject(error)
})

let loading: { [key: string]: any } | null = null
const request = <T>(params: IRequest): Promise<T> => {
    return new Promise((resolve, reject) => {
        params.loading && (loading = ElLoading.service({ text: 'loading...' }))
        !params.method && (params.method = 'GET')
        instance.request({
            url: params.url,
            method: params.method,
            params: params.method === 'GET' ? params.data : null,
            data: params.method !== 'GET' ? params.data : null
        }).then(res => {
            loading && loading.close()
            const model = res.data as IResponse<T>
            if (model.code === '1000') {
                resolve(model.data)
            } else {
                ElMessage.error(model.tips)
            }
        }).catch((error: AxiosError) => {
            const model = error?.response?.data as IResponse<T>
            if (model?.code === '4001') {
                router.push('/login')
            } else {
                ElMessage.error(model?.tips || '哦豁，接口请求异常了，真奇怪：～')
            }
            reject(error)
        }).finally(() => loading && loading.close())
    })
}

export default request