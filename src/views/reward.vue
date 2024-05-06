<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item" style="color: #999; font-size: 14px;">
                每一份打赏，都是读者对我的认可 ：）
            </div>
        </div>
        <div class="search__right">
            <el-button type="primary" @click="addOrEdit('打赏')">
                <el-icon class="el-icon--left"><i-ep-circle-plus-filled /></el-icon>新增
            </el-button>
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="nickName" label="老板昵称" />
        <el-table-column prop="amount" label="打赏金额(元)">
            <template #default="scope">
                ¥ {{ scope.row.amount }}
            </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" />
        <el-table-column prop="createTime" label="打赏日期">
            <template #default="scope">
                {{ dateFormat(scope.row.createTime) }}
            </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="230">
            <template #default="scope">
                <el-button type="danger" plain @click="remove(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-delete /></el-icon>删除
                </el-button>
                <el-button type="primary" plain @click="addOrEdit('打赏', scope.row)">
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
        <el-form :model="reward">
            <el-form-item label="老板昵称">
                <el-input v-model="reward.nickName" />
            </el-form-item>
            <el-form-item label="打赏金额">
                <el-input v-model="reward.amount" />
            </el-form-item>
            <el-form-item label="支付方式">
                <el-select v-model="reward.payMethod">
                    <el-option label="微信" value="微信"></el-option>
                    <el-option label="支付宝" value="支付宝"></el-option>
                </el-select>
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
    import { IReward, initReward } from '@/models/IReward'
    import $apiReward from '@/apis/reward'

    const { dateFormat } = useDateFormat()

    const { list, paging, getList } = useList<IReward>($apiReward.list, {})
    getList()

    const { confirm } = useConfirm()
    const remove = (row: IReward) => {
        confirm(`确定删除打赏 [${row.nickName} - ¥${row.amount}] 吗？`, () => {
            $apiReward.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const {
        dialogVisible,
        dialogTitle,
        model: reward,
        addOrEdit
    } = useEdit<IReward>(initReward)
    const save = async () => {
        reward.value.amount = +reward.value.amount
        if (reward.value.id) {
            await $apiReward.update(reward.value)
        } else {
            await $apiReward.create(reward.value)
        }
        dialogVisible.value = false
        getList()
    }
</script>