export default interface IRequest {
    url: string
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    data?: any
    loading?: boolean
}