<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item">
                <el-select v-model="params.status" @change="search" placeholder="审核状态" clearable>
                    <el-option label="通过" :value="1"></el-option>
                    <el-option label="待定" :value="0"></el-option>
                </el-select>
            </div>
        </div>
        <div class="search__right" style="color: #999; font-size: 14px;">
            每一条评论都源自你的内容～
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="content" label="评论内容">
            <template #default="scope">
                <span class="link" @click="viewDetail(scope.row.content)" v-html="overflow(scope.row.content)"></span>
            </template>
        </el-table-column>
        <el-table-column prop="content" label="所属文章" width="120">
            <template #default="scope">
                <span class="link" @click="viewArticle(scope.row.articleId)">[点击查看]</span>
            </template>
        </el-table-column>
        <el-table-column prop="nickName" label="评论人昵称" width="130" />
        <el-table-column prop="createTime" label="评论时间" width="200">
            <template #default="scope">
                {{ dateFormat(scope.row.createTime) }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="100">
            <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="通过"
                    inactive-text="待定"
                    :active-value="1"
                    :inactive-value="0"
                    @change="$apiComment.update(scope.row)"
                />
            </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="300">
            <template #default="scope">
                <el-button type="primary" plain @click="replyComment(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-chat-line-round /></el-icon>回复
                </el-button>
                <el-button type="warning" plain @click="editComment(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-edit /></el-icon>编辑
                </el-button>
                <el-button type="danger" plain @click="remove(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-delete /></el-icon>删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background
        hide-on-single-page
        layout="sizes, prev, pager, next, total, jumper"
        :total="paging.total"
        v-model:page-size="paging.pageSize"
        v-model:current-page="paging.pageIndex"
        :page-sizes="[10, 15, 20, 25, 30]"
        @current-change="getList"
        @size-change="getList"
        style="margin-top: 20px;"
    />

    <!-- 评论详情 -->
    <el-dialog v-model="dialogVisible" title="评论详情" width="500px">
        <el-card shadow="never" class="comment-card">
			<span v-html="detail"></span>
        </el-card>
    </el-dialog>

    <!-- 回复评论 -->
    <el-dialog v-model="dialogVisibleReply" :title="`回复: ${replyTo}`" width="500px">
        <el-form :model="reply" ref="ruleFormRef" :rules="rules">
            <el-form-item prop="content">
                <el-input type="textarea" v-model="reply.content" :rows="10" placeholder="最少5个字…" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisibleReply = false; resetForm(ruleFormRef);">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 编辑评论 -->
    <el-dialog v-model="dialogVisibleEdit" title="编辑评论" width="500px">
        <el-form :model="comment" ref="editFormRef" :rules="editRules">
            <el-form-item prop="nickName">
                <el-input v-model="comment.nickName" placeholder="昵称" />
            </el-form-item>
            <el-form-item prop="content">
                <el-input type="textarea" v-model="comment.content" :rows="10" placeholder="最少5个字…" />
            </el-form-item>
            <el-form-item>
                <el-switch
                    v-model="comment.isOwner"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="站长"
                    inactive-text="用户"
                    :active-value="1"
                    :inactive-value="0"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisibleEdit = false; resetEditForm(editFormRef);">取消</el-button>
                <el-button type="primary" @click="submitEditForm(editFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import useList from '@/hooks/useList'
    import useConfirm from '@/hooks/useConfirm'
    import useDateFormat from '@/hooks/useDateFormat'
    import { IComment, initComment } from '@/models/IComment'
    import $apiComment from '@/apis/comment'
    import { FormRules, FormInstance } from 'element-plus'
    
    const { dateFormat } = useDateFormat()

    const params = reactive({ status: undefined })
    const { list, paging, getList, search } = useList<IComment>($apiComment.list, params)
    getList()

    const { confirm } = useConfirm()
    const remove = (row: IComment) => {
        confirm(`确定删除 [${row.nickName}] 的留言吗？`, () => {
            $apiComment.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const overflow = (text: string, len: number = 50) => {
        if (text.length <= len) {
            return text
        }
        return text.substring(0, 50) + '...'
    }

    const dialogVisible = ref(false)
    const detail = ref('')
    const viewDetail = (content: string) => {
        detail.value = content
        dialogVisible.value = true
    }
    const viewArticle = (articleId: number) => {
        window.open('https://yanyunfeng.com/article/' + articleId)
    }

    //#region == 回复评论 ==
    const dialogVisibleReply = ref(false)
    let replyTo = ref('')
    const reply = reactive<IComment>({
        nickName: '',
        articleId: 0,
        status: 1,
        content: '',
        isOwner: 1
    })
    const replyComment = (row: IComment) => {
        replyTo.value = row.nickName
        reply.nickName = '鄢云峰'
        reply.articleId = row.articleId
        reply.content = ''
        dialogVisibleReply.value = true
    }
    const ruleFormRef = ref<FormInstance>()
    const validateContent = (_: any, value: any, callback: any) => {
        if (value.length < 2) {
            callback(new Error('最少请回复2个字'))
        } else {
            callback()
        }
    }
    const rules = reactive<FormRules<typeof reply>>({
        content: [{ validator: validateContent, trigger: 'blur' }]
    })
    const saveReply = async () => {
        await $apiComment.create({ ...reply, content: `<span class="mention">@${replyTo.value}</span> ${reply.content}` })
        getList()
        dialogVisibleReply.value = false
    }
    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                saveReply()
            } else {
                return false
            }
        })
    }
    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
    //#endregion


    //#region == 修改评论 ==
    const dialogVisibleEdit = ref(false)
    const comment = ref<IComment>(initComment())
    const editComment = (row: IComment) => {
        comment.value = { ...row }
        dialogVisibleEdit.value = true
    }
    const editFormRef = ref<FormInstance>()
    const validateEditContent = (_: any, value: any, callback: any) => {
        if (value.length < 5) {
            callback(new Error('最少请回复5个字'))
        } else {
            callback()
        }
    }
    const editRules = reactive<FormRules<typeof reply>>({
        nickName: [{ required: true, message: '请填写昵称', trigger: 'blur' }],
        content: [{ validator: validateEditContent, trigger: 'blur' }]
    })
    const saveEdit = async () => {
        await $apiComment.update(comment.value)
        getList()
        dialogVisibleEdit.value = false
    }
    const submitEditForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                saveEdit()
            } else {
                return false
            }
        })
    }
    const resetEditForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
    //#endregion
</script>

<style scoped>
:deep(.el-card__body) {
    text-align: justify;
}

.comment-card :deep(.mention) {
	color: dodgerblue;
}
</style>