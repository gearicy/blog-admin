<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item">
                <el-input v-model="params.country" @change="search" clearable placeholder="输入国家名称搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
            <div class="search__left-item">
                <el-input v-model="params.province" @change="search" clearable placeholder="输入省份名称搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
            <div class="search__left-item">
                <el-input v-model="params.city" @change="search" clearable placeholder="输入城市名称搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="search__right">
            <el-button type="primary" @click="addOrEdit('访客')">
                <el-icon class="el-icon--left"><i-ep-circle-plus-filled /></el-icon>新增
            </el-button>
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="country" label="国家" />
        <el-table-column prop="province" label="省份" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="ip" label="IP" />
        <el-table-column prop="createTime" label="访问时间" width="200">
            <template #default="scope">
                {{ dateFormat(scope.row.createTime) }}
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
        <el-form :model="visit">
            <el-form-item label="国家">
                <el-input v-model="visit.country" />
            </el-form-item>
            <el-form-item label="省份">
                <el-input v-model="visit.province" />
            </el-form-item>
            <el-form-item label="城市">
                <el-input v-model="visit.city" />
            </el-form-item>
            <el-form-item label="IP号">
                <el-input v-model="visit.ip" />
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
    import { IVisit, initVisit } from '@/models/IVisit'
    import useDateFormat from '@/hooks/useDateFormat'
    import $apiVisit from '@/apis/visit'

    const { dateFormat } = useDateFormat()

    const params = reactive({ country: '', province: '', city: '' })
    const { list, paging, getList, search } = useList<IVisit>($apiVisit.list, params)
    getList()

    const { confirm } = useConfirm()
    const remove = (row: IVisit) => {
        confirm(`确定删除访客记录 [${row.ip}] 吗？`, () => {
            $apiVisit.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const {
        dialogVisible,
        dialogTitle,
        model: visit,
        addOrEdit
    } = useEdit<IVisit>(initVisit)
    const save = async () => {
        if (visit.value.id) {
            await $apiVisit.update(visit.value)
        } else {
            await $apiVisit.create(visit.value)
        }
        dialogVisible.value = false
        getList()
    }
</script>