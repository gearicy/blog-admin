import http from '@/apis/http'
import { IAccount } from '@/models/IAccount'
import { IList } from '@/models/IList'

const $apiAccount = {
    list (params: { tel: string, status?: number, pageIndex?: number, pageSize?: number}) {
        return http<IList<IAccount>>({
            url: 'account',
            data: {
                tel: params.tel,
                status: params.status,
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (account: IAccount) {
        return http<IAccount>({
            url: 'account',
            method: 'POST',
            data: account
        })
    },
    update (account: IAccount) {
        return http<IAccount>({
            url: `account/${account.id}`,
            method: 'PATCH',
            data: account
        })
    },
    delete (id: number) {
        return http<IAccount>({
            url: `account/${id}`,
            method: 'DELETE'
        })
    },
	password (tel: string, oldPassword: string, newPassword: string) {
		return http<IAccount>({
            url: `account/password`,
            method: 'POST',
			data: {
                tel,
                oldPassword,
                newPassword
            }
        })
	}
}

export default $apiAccount