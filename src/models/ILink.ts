import { EStatusOfCheck } from "../enums/EStatus"

interface ILink {
    id?: number
    title: string
    slogan: string
    cover: string
    href: string
    status: EStatusOfCheck
    createTime?: Date
}

const initLink = (options?: Partial<ILink>):ILink => {
    const defaults = {
        title: '',
        slogan: '',
        cover: '',
        href: '',
        status: EStatusOfCheck.通过
    }
    return { ...defaults, ...options }
}

export { initLink }
export type { ILink }