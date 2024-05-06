import http from '@/apis/http'
import { IComment } from '@/models/IComment'
import { IList } from '@/models/IList'

const $apiComment = {
    list (params: { status?: number, articleId?: number, pageIndex?: number, pageSize?: number}) {
        return http<IList<IComment>>({
            url: 'comment',
            data: {
                articleId: params.articleId,
                status: params.status,
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (comment: IComment) {
        return http<IComment>({
            url: 'comment',
            method: 'POST',
            data: comment
        })
    },
    update (comment: IComment) {
        return http<IComment>({
            url: `comment/${comment.id}`,
            method: 'PATCH',
            data: comment
        })
    },
    delete (id: number) {
        return http<IComment>({
            url: `comment/${id}`,
            method: 'DELETE'
        })
    }
}

export default $apiComment