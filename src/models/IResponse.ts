export default interface IResponse<T> {
    data: T
    code: string
    tips: string
}