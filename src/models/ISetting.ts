interface ISetting {
    id?: number
    notice: string
}

const initSetting = (options?: Partial<ISetting>):ISetting => {
    const defaults = {
        notice: ''
    }
    return { ...defaults, ...options }
}

export { initSetting }
export type { ISetting }