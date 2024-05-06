interface IReward {
    id?: number
    nickName: string
    amount: number
    payMethod: string
}

const initReward = (options?: Partial<IReward>):IReward => {
    const defaults = {
        nickName: '',
        amount: 0.1,
        payMethod: '微信'
    }
    return { ...defaults, ...options }
}

export { initReward }
export type { IReward }