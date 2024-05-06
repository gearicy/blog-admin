import http from '@/apis/http'
import { IReward } from '@/models/IReward'
import { IList } from '@/models/IList'

const $apiReward = {
    list (params: { pageIndex?: number, pageSize?: number}) {
        return http<IList<IReward>>({
            url: 'reward',
            data: {
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (reward: IReward) {
        return http<IReward>({
            url: 'reward',
            method: 'POST',
            data: reward
        })
    },
    update (reward: IReward) {
        return http<IReward>({
            url: `reward/${reward.id}`,
            method: 'PATCH',
            data: reward
        })
    },
    delete (id: number) {
        return http<IReward>({
            url: `reward/${id}`,
            method: 'DELETE'
        })
    }
}

export default $apiReward