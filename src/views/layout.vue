<template>
    <el-container>
        <el-header style="background-color: #f5f5f5;">
            <div class="header">
                <div class="header-left-wrapper">
                    <div class="header__logo">
                        <span>Hello World!</span>
                        <el-icon style="cursor: pointer;" class="collapse-icon" @click="isCollapse = !isCollapse">
                            <i-ep-expand v-show="isCollapse" />
                            <i-ep-fold v-show="!isCollapse" />
                        </el-icon>
                    </div>
                    <div class="header__tool">
                        <span @click="router.back()"><el-icon><i-ep-arrow-left /></el-icon>&nbsp;返回</span>
                        <span @click="fullScreen"><el-icon><i-ep-full-screen /></el-icon>&nbsp;全屏</span>
                        <span @click="doRefresh"><el-icon><i-ep-refresh /></el-icon>&nbsp;刷新</span>
                    </div>
                </div>
                <div class="header__quit">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <span>管理员</span>
                            <el-icon class="el-icon--right">
                                <i-ep-arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="modify">修改密码</el-dropdown-item>
                                <el-dropdown-item command="logout" divided>退出登陆</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-menu style="height: calc(100vh - 60px); z-index: 2500;"
                active-text-color="#ffd04b"
                background-color="#545c64"
                :default-active="menuDefaultActive"
                :collapse="isCollapse"
                text-color="#fff"
                router
            >
				<el-menu-item index="/article">
                    <el-icon><i-ep-memo /></el-icon>
                    <span>文章管理</span>
                </el-menu-item>
				<el-menu-item index="comment">
                    <el-icon><i-ep-chat-dot-round /></el-icon>
                    <span>评论管理</span>
                </el-menu-item>
                <el-menu-item index="/link">
                    <el-icon><i-ep-connection /></el-icon>
                    <span>友链管理</span>
                </el-menu-item>
				<el-menu-item index="/reward">
                    <el-icon><i-ep-bowl /></el-icon>
                    <span>打赏管理</span>
                </el-menu-item>
                <el-menu-item index="/category">
                    <el-icon><i-ep-operation /></el-icon>
                    <span>分类管理</span>
                </el-menu-item>
                <el-menu-item index="/account">
                    <el-icon><i-ep-user /></el-icon>
                    <span>账户管理</span>
                </el-menu-item>
                <el-menu-item index="/visit">
                    <el-icon><i-ep-message-box /></el-icon>
                    <span>访客记录</span>
                </el-menu-item>
                <el-menu-item index="/setting">
                    <el-icon><i-ep-setting /></el-icon>
                    <span>网站设置</span>
                </el-menu-item>
            </el-menu>
            <el-main style="height: calc(100vh - 60px);"><router-view v-if="refresh"></router-view></el-main>
        </el-container>
    </el-container>

    <!-- 修改密码 -->
    <el-dialog v-model="dialogVisible" title="修改密码" width="500px">
        <el-form :model="password" :rules="rules" ref="ruleFormRef">
            <el-form-item label="原密码" prop="old">
                <el-input v-model="password.old" type="password" placeholder="请输入原密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="new">
                <el-input v-model="password.new" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newRepeat">
                <el-input v-model="password.newRepeat" type="password" placeholder="请确认新密码" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="modifyPassword(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { FormRules, FormInstance } from 'element-plus'
	import CryptoJS, { MD5 } from 'crypto-js'
	import $apiAccount from '@/apis/account'

    const router = useRouter()
    const route = useRoute()
    const isCollapse = ref(false)
    const menuDefaultActive = ref('article')
    watch(() => route.path, (newValue) => { menuDefaultActive.value = newValue }, { immediate: true })
    const fullScreen = () => {
        const doc = document as any
        let isFull = doc.isFullScreen || doc.mozIsFullScreen || doc.webkitIsFullScreen
        if (isFull) {
            let close = doc.exitFullscreen || doc.webkitCancelFullScreen ||
                doc.mozCancelFullScreen || doc.msExitFullscreen
            close && close.call(doc)
        } else {
            let docElm = document.documentElement as any
            let open = docElm.requestFullScreen || docElm.webkitRequestFullScreen ||
                docElm.mozRequestFullScreen || docElm.msRequestFullscreen
            open && open.call(docElm)
        }
    }

    const refresh = ref<boolean>(true)
    const doRefresh = () => {
        refresh.value = false
        setTimeout(() => refresh.value = true, 10)
    }

    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref(false)
    const password = reactive({ old: '', new: '', newRepeat: '' })
    const handleCommand = (command: string) => {
        if (command === 'logout') {
            localStorage.removeItem('token')
            router.replace('/login')
        } else {
            password.old = ''
            password.new = ''
            password.newRepeat = ''
            dialogVisible.value = true
        }
    }
    const modifyPassword = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate(async valid => {
            if (valid) {
				const loginForm = JSON.parse(localStorage.getItem('loginForm')!)
				const oldPwd = MD5(password.old + loginForm.tel).toString(CryptoJS.enc.Base64)
				const newPwd = MD5(password.new + loginForm.tel).toString(CryptoJS.enc.Base64)
				await $apiAccount.password(loginForm.tel, oldPwd, newPwd)
                dialogVisible.value = false
            } else {
                return false
            }
        })
    }
    const compareNewPassword = (_: any, value: string, callback: Function) => {
        if (value !== password.new) {
            callback(new Error('两次密码不一致'))
        } else {
            callback()
        }
    }
    const rules = reactive<FormRules>({
        old: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newRepeat: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: compareNewPassword, trigger: 'blur' }
        ]
    })
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }
    .header-left-wrapper {
        display: flex;
    }
    .header__logo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 130px;
        margin-right: 20px;
    }
    .header__tool {
        display: flex;
    }
    .header__tool span {
        display: flex;
        align-items: center;
        margin-right: 20px;
        font-size: 14px;
        cursor: pointer;
    }
	:deep(.el-menu-item) {
		padding-right: 45px;
	}
</style>