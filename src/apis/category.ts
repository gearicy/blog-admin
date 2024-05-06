import http from '@/apis/http'
import { ICategory } from '@/models/ICategory'
import { IList } from '@/models/IList'

const $apiCategory = {
    list (params: { name: string, pageIndex?: number, pageSize?: number}) {
        return http<IList<ICategory>>({
            url: 'category',
            data: {
                name: params.name,
                pageIndex: params.pageIndex || 1,
                pageSize: params.pageSize || 10
            },
            loading: false
        })
    },
    create (category: ICategory) {
        return http<ICategory>({
            url: 'category',
            method: 'POST',
            data: category
        })
    },
    update (category: ICategory) {
        return http<ICategory>({
            url: `category/${category.id}`,
            method: 'PATCH',
            data: category
        })
    },
    delete (id: number) {
        return http<ICategory>({
            url: `category/${id}`,
            method: 'DELETE'
        })
    }
}

export default $apiCategory