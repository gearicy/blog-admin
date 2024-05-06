import http from '@/apis/http'

const $apiLogin = {
    signin(tel: string, password: string) {
        return http<{token: string}>({
            url: 'login',
            method: 'POST',
            data: { tel, password }
        })
    }
}

export default $apiLogin