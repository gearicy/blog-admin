import http from '@/apis/http'
import { ILink } from '@/models/ILink'
import { IList } from '@/models/IList'

const $apiLink = {
    list (params: { title: string, pageIndex?: number, pageSize?: number}) {
        return http<IList<ILink>>({
            url: 'link',
            data: {
                title: params.title,
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (link: ILink) {
        return http<ILink>({
            url: 'link',
            method: 'POST',
            data: link
        })
    },
    update (link: ILink) {
        return http<ILink>({
            url: `link/${link.id}`,
            method: 'PATCH',
            data: link
        })
    },
    delete (id: number) {
        return http<ILink>({
            url: `link/${id}`,
            method: 'DELETE'
        })
    }
}

export default $apiLink