import http from '@/apis/http'
import { IVisit } from '@/models/IVisit'
import { IList } from '@/models/IList'

const $apiVisit = {
    list (params: { country?: string, province?: string, city?: string, pageIndex?: number, pageSize?: number}) {
        return http<IList<IVisit>>({
            url: 'visit',
            data: {
                country: params.country,
                province: params.province,
                city: params.city,
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (visit: IVisit) {
        return http<IVisit>({
            url: 'visit',
            method: 'POST',
            data: visit
        })
    },
    update (visit: IVisit) {
        return http<IVisit>({
            url: `visit/${visit.id}`,
            method: 'PATCH',
            data: visit
        })
    },
    delete (id: number) {
        return http<IVisit>({
            url: `visit/${id}`,
            method: 'DELETE'
        })
    }
}

export default $apiVisit