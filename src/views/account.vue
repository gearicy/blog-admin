<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item">
                <el-input v-model="params.tel" @change="search" clearable placeholder="输入手机号搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
            <div class="search__left-item">
                <el-select v-model="params.status" @change="search" placeholder="账号状态" clearable>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="0"></el-option>
                </el-select>
            </div>
        </div>
        <div class="search__right">
            <el-button type="primary" @click="addOrEdit('账户')">
                <el-icon class="el-icon--left"><i-ep-circle-plus-filled /></el-icon>新增
            </el-button>
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="tel" label="手机号" />
        <el-table-column prop="password" label="密码" />
        <el-table-column prop="createTime" label="创建时间">
            <template #default="scope">
                {{ dateFormat(scope.row.createTime) }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
            <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="启用"
                    inactive-text="禁用"
                    :active-value="1"
                    :inactive-value="0"
                    @change="$apiAccount.update(scope.row)"
                />
            </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="230">
            <template #default="scope">
                <el-button type="danger" plain @click="remove(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-delete /></el-icon>删除
                </el-button>
                <el-button type="primary" plain @click="addOrEdit('账户', scope.row)">
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
        <el-form :model="account">
            <el-form-item label="手机">
                <el-input v-model="account.tel" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="account.password" type="password" />
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
    import { IAccount, initAccount } from '@/models/IAccount'
    import $apiAccount from '@/apis/account'
	import CryptoJS, { MD5 } from 'crypto-js'
    
    const { dateFormat } = useDateFormat()

    const params = reactive({ tel: '', status: undefined })
    const { list, paging, getList, search } = useList<IAccount>($apiAccount.list, params)
    getList()

    const { confirm } = useConfirm()
    const remove = (row: IAccount) => {
        confirm(`确定删除账户 [${row.tel}] 吗？`, () => {
            $apiAccount.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const {
        dialogVisible,
        dialogTitle,
        model: account,
        addOrEdit
    } = useEdit<IAccount>(initAccount)
    const save = async () => {
		account.value.password = MD5(account.value.password + account.value.tel).toString(CryptoJS.enc.Base64)
        if (account.value.id) {
            await $apiAccount.update(account.value)
        } else {
            await $apiAccount.create(account.value)
        }
        dialogVisible.value = false
        getList()
    }
</script>