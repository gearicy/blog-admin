import { EStatus } from "../enums/EStatus"

interface IAccount {
    id?: number
    tel: string
    password: string
    status: EStatus
}

const initAccount = (options?: Partial<IAccount>):IAccount => {
    const defaults = {
        tel: '',
        password: '',
        status: EStatus.启用
    }
    return { ...defaults, ...options }
}

export { initAccount }
export type { IAccount }