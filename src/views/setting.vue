<template>
    <el-form :model="setting" label-width="120px" label-position="top" :rules="rules" ref="ruleFormRef">
        <el-form-item label="网站公告：" prop="notice">
            <el-input v-model="setting.notice" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item>
            <el-button @click="resetForm(ruleFormRef)">重置清空</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">保存更改</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
    import { ISetting } from '@/models/ISetting'
    import type { FormInstance, FormRules } from 'element-plus'
    import $apiSetting from '@/apis/setting'

    const ruleFormRef = ref<FormInstance>()
    const rules = reactive<FormRules<ISetting>>({
        notice: [{ required: true, message: '请填写网站公告', trigger: 'blur' }]
    })

    const setting = ref<ISetting>({ id: 1, notice: '' })
    const getDetail = async () => {
        setting.value = await $apiSetting.detail()
    }
    getDetail()

    const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                $apiSetting.update(setting.value).then(() => {
                    ElMessage({ message: '保存成功', type: 'success' })
                })
            } else {
                console.log('error submit!', fields)
            }
        })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
</script>

<style scoped>

</style>