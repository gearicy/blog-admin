import http from '@/apis/http'
import { IArticle } from '@/models/IArticle'
import { IList } from '@/models/IList'

const $apiArticle = {
    list (params: { title: string, status?: number, categoryId?: number, pageIndex?: number, pageSize?: number}) {
        return http<IList<IArticle>>({
            url: 'article',
            data: {
                title: params.title,
                status: params.status,
                categoryId: params.categoryId,
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (article: IArticle) {
        return http<IArticle>({
            url: 'article',
            method: 'POST',
            data: article
        })
    },
    update (article: IArticle) {
        return http<IArticle>({
            url: `article/${article.id}`,
            method: 'PATCH',
            data: {
                ...article,
                commentCount: undefined,
                categoryName: undefined
            }
        })
    },
    delete (id: number) {
        return http<IArticle>({
            url: `article/${id}`,
            method: 'DELETE'
        })
    },
    detail (id: number) {
        return http<IArticle>({
            url: `article/${id}`,
            method: 'GET'
        })
    }
}

export default $apiArticle
