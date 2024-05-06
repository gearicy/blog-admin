/**
 * 分页列表
 */
import { IList } from "@/models/IList"
import { IPaging, initPaging } from "@/models/IPaging"

export default <T>(listRequest: Function, params: { [key: string]: unknown }) => {
    const list = ref<T[]>([]) as Ref<T[]>
    const paging = reactive<IPaging>(initPaging())
    const getList = async () => {
        const result:IList<T> = await listRequest({ ...params, ...paging })
        list.value = result.list
        paging.total = result.total
    }
    const search = () => {
        paging.pageIndex = 1
        getList()
    }
    return { list, paging, getList, search }
}