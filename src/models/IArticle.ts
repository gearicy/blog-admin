import { EStatusOfArticle } from '../enums/EStatus'

interface IArticle {
    id?: number
    title: string
    coverImg: string
    keyword: string
    intro: string
    content: string
	html: string
    viewCount: number
    commentCount?: number
    status: EStatusOfArticle
    updateTime?: Date
    categoryId: number
    categoryName?: string
}

const initArticle = (options?: Partial<IArticle>):IArticle => {
    const defaults = {
        title: '',
        coverImg: '',
        keyword: '',
        intro: '',
        content: '',
		html: '',
        viewCount: 0,
        commentCount: undefined,
        status: EStatusOfArticle.发布,
        categoryId: 0,
        categoryName: undefined
    }
    return { ...defaults, ...options }
}

export { initArticle }
export type { IArticle }


