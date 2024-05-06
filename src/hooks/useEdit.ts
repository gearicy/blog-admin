/**
 * 新增编辑弹框
 */
export default <T>(init: Function) => {
    const dialogTitle = ref('')
    const dialogVisible = ref(false)
    const model = ref<T>(init())

    const addOrEdit = (title: string, row?: T) => {
        if (row) {
            model.value = init(row)
            dialogTitle.value = `编辑${title}`
            dialogVisible.value = true
        } else {
            model.value = init()
            dialogTitle.value = `新增${title}`
            dialogVisible.value = true
        }
    }
    return { addOrEdit, dialogTitle, dialogVisible, model }
}