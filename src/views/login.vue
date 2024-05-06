<template>
    <div class="login">
        <div class="login__body">
            <div class="login__form">
                <h2>YYF 欢迎您！</h2>
                <el-form :model="login" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="tel">
                        <el-input v-model="login.tel" placeholder="请输入手机账号" size="large">
                            <template #prefix>
                                <el-icon class="el-input__icon"><i-ep-user /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="login.password" :type="inputType" placeholder="请输入登陆密码" size="large">
                            <template #prefix>
                                <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
                            </template>
                            <template #suffix>
                                <el-icon class="el-input__icon" @click="onOffPassword" style="cursor: pointer;">
                                    <i-ep-hide v-show="inputType === 'password'" />
                                    <i-ep-view v-show="inputType === 'text'" />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="login.isRemember" label="记住密码？" style="color: #fff;" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="onSubmit(ruleFormRef)" size="large" style="width: 100%;">登 陆</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import $apiLogin from '@/apis/login'
    import type { FormInstance, FormRules } from 'element-plus'
    import CryptoJS, { MD5 } from 'crypto-js'

    const router = useRouter()

    const login = reactive({
        tel: '13987654321',
        password: '123456',
        isRemember: false
    })

    // 如果缓存中有数据，则直接赋值
    const cacheLoginString = localStorage.getItem('loginForm')
    const cacheLogin = cacheLoginString && JSON.parse(cacheLoginString)
    cacheLogin && Object.assign(login, cacheLogin)

    // 控制密码的可见与隐藏
    const inputType = ref<'password' | 'text'>('password')
    const onOffPassword = () => {
        inputType.value = inputType.value === 'password' ? 'text' : 'password'
    }

    // 表单验证
    const ruleFormRef = ref<FormInstance>()
    const rules = reactive<FormRules>({
        tel: [{ required: true, message:'请输入账户名称', trigger: 'blur' }],
        password: [{ required: true, message:'请输入登录密码', trigger: 'blur' }]
    })

    // 表单提交
    const onSubmit = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate(async (valid, _) => {
            if (valid) {
				const MD5First = MD5(login.password + login.tel).toString(CryptoJS.enc.Base64)
                const result = await $apiLogin.signin(login.tel, MD5(MD5First + 'Th1sSAit').toString(CryptoJS.enc.Base64))
                const cache = {
                    tel: login.tel,
                    password: login.isRemember ? login.password : '',
                    isRemember: login.isRemember
                }
                localStorage.setItem('token', result.token)
                localStorage.setItem('loginForm', JSON.stringify(cache))
                router.replace('article')
            }
        })
    }
</script>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(-30deg, #03a9f4 0%, #3a78b7 50%, #262626 50%, #607d8b 100%);
    filter: hue-rotate(120deg);
    animation: animate 10s linear infinite;
}

@keyframes animate {
    0% {
        filter: hue-rotate(0deg);
    }

    100% {
        filter: hue-rotate(360deg);
    }
}

.login__body {
    position: relative;
    padding: 50px;
    width: 360px;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, .1);
    border-radius: 6px;
    box-shadow: 0 5px 35px rgba(0, 0, 0, .2);
}

.login__body::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 5px;
    pointer-events: none;
    background: linear-gradient(to bottom, rgba(255, 255, 255, .3) 0%,
            rgba(255, 255, 255, .1) 15%, transparent 50%, transparent 85%, rgba(255, 255, 255, .3) 100%);
}

.login__form {
    width: 100%;
    margin-bottom: 40px;
}

.login__form h2 {
    color: #fff;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 30px;
}
</style>