interface IVisit {
    id?: number
    country: string
    province: string
    city: string
    ip: string
    createTime?: Date
}

const initVisit = (options?: Partial<IVisit>):IVisit => {
    const defaults = {
        country: '',
        province: '',
        city: '',
        ip: '',
    }
    return { ...defaults, ...options }
}

export { initVisit }
export type { IVisit }