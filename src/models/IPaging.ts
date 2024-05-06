interface IPaging {
    pageSize: number
    pageIndex: number
    total: number
}

const initPaging = (options?: Partial<IPaging>):IPaging => {
    const defaults = {
        pageSize: 10,
        pageIndex: 1,
        total: 0
    }
    return { ...defaults, ...options }
}

export { initPaging }
export type { IPaging }