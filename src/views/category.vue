<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item">
                <el-input v-model="params.name" @change="search" clearable placeholder="输入名称搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="search__right">
            <el-button type="primary" @click="addOrEdit('分类')">
                <el-icon class="el-icon--left"><i-ep-circle-plus-filled /></el-icon>新增
            </el-button>
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="sort" label="排序" />
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
        <el-form :model="category">
            <el-form-item label="名称">
                <el-input v-model="category.name" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="category.sort" :min="0" :max="100" />
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
    import { ICategory, initCategory } from '@/models/ICategory'
    import $apiCategory from '@/apis/category'

    const params = reactive({ name: '' })
    const { list, paging, getList, search } = useList<ICategory>($apiCategory.list, params)
    getList()

    const { confirm } = useConfirm()
    const remove = (row: ICategory) => {
        confirm(`确定删除分类 [${row.name}] 吗？`, () => {
            $apiCategory.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const {
        dialogVisible,
        dialogTitle,
        model: category,
        addOrEdit
    } = useEdit<ICategory>(initCategory)
    const save = async () => {
        if (category.value.id) {
            await $apiCategory.update(category.value)
        } else {
            await $apiCategory.create(category.value)
        }
        dialogVisible.value = false
        getList()
    }
</script>