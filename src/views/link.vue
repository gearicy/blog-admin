<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item">
                <el-input v-model="params.title" @change="search" clearable placeholder="输入名称搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="search__right">
            <el-button type="primary" @click="addOrEdit('友链')">
                <el-icon class="el-icon--left"><i-ep-circle-plus-filled /></el-icon>新增
            </el-button>
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="title" label="名称" width="200" show-overflow-tooltip />
        <el-table-column prop="slogan" label="标语" width="250" show-overflow-tooltip />
        <el-table-column prop="cover" label="封面" />
        <el-table-column prop="href" label="网址" />
        <el-table-column prop="createTime" label="添加时间">
            <template #default="scope">
                {{ dateFormat(scope.row.createTime) }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="启用状态" width="100">
            <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="启用"
                    inactive-text="禁用"
                    :active-value="1"
                    :inactive-value="0"
                    @change="$apiLink.update(scope.row)"
                />
            </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="230">
            <template #default="scope">
                <el-button type="danger" plain @click="remove(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-delete /></el-icon>删除
                </el-button>
                <el-button type="primary" plain @click="addOrEdit('分类', scope.row)">
                    <el-icon class="el-icon--left"><i-ep-edit /></el-icon>编辑
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

    <!-- 新增/编辑 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
        <el-form :model="link">
            <el-form-item label="名称">
                <el-input v-model="link.title" />
            </el-form-item>
            <el-form-item label="标语">
                <el-input v-model="link.slogan" />
            </el-form-item>
            <el-form-item label="封面">
                <el-input v-model="link.cover" />
            </el-form-item>
            <el-form-item label="网址">
                <el-input v-model="link.href" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import useList from '@/hooks/useList'
    import useEdit from '@/hooks/useEdit'
    import useConfirm from '@/hooks/useConfirm'
    import useDateFormat from '@/hooks/useDateFormat'
    import { ILink, initLink } from '@/models/ILink'
    import $apiLink from '@/apis/link'

    const { dateFormat } = useDateFormat()

    const params = reactive({ title: '' })
    const { list, paging, getList, search } = useList<ILink>($apiLink.list, params)
    getList()

    const { confirm } = useConfirm()
    const remove = (row: ILink) => {
        confirm(`确定删除友链 [${row.title}] 吗？`, () => {
            $apiLink.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const {
        dialogVisible,
        dialogTitle,
        model: link,
        addOrEdit
    } = useEdit<ILink>(initLink)
    const save = async () => {
        if (link.value.id) {
            await $apiLink.update(link.value)
        } else {
            await $apiLink.create(link.value)
        }
        dialogVisible.value = false
        getList()
    }
</script>