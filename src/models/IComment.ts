import { EStatusOfCheck } from "../enums/EStatus"

interface IComment {
    id?: number
    articleId: number | null
    nickName: string
    content: string
    status: EStatusOfCheck
    createTime?: Date
    isOwner: number
}

const initComment = (options?: Partial<IComment>): IComment => {
    const defaults = {
        articleId: null,
        nickName: '',
        content: '',
        status: EStatusOfCheck.待定,
        isOwner: 0
    }
    return { ...defaults, ...options }
}

export { initComment }
export type { IComment }