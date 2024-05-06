interface ICategory {
    id?: number
    name: string
    sort: number
}

const initCategory = (options?: Partial<ICategory>):ICategory => {
    const defaults = {
        name: '',
        sort: 0
    }
    return { ...defaults, ...options }
}

export { initCategory }
export type { ICategory }