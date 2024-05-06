<template>
    <div class="bodyer">
        <div class="bodyer-main">
            <div class="main-title"><input class="title" type="text" v-model="article.title" placeholder="请输入文章标题"></div>
            <div class="main-editor">
                <tui-editor v-model="article.content" @getHTML="(html) => article.html = html" />
            </div>
            <div class="main-setting"><el-icon class="el-icon--left"><i-ep-paperclip /></el-icon>发布设置</div>
            <div class="main-intro">
                <el-input v-model="article.keyword" placeholder="请输入 SEO 关键字，多个关键词用 | 分隔"></el-input>
            </div>
			<div class="main-intro">
				<el-input type="textarea" v-model="article.intro" placeholder="请输入文章简介，一段好的介绍更能吸引读者的目光~" :rows="5"></el-input>
			</div>
            <div class="main-uploader">
                <el-upload
                    drag
                    :show-file-list="false"
					:headers="{ Authorization }"
                    action="/api/upload"
                    :on-success="uploadSuccess"
                >
                    <template v-if="article.coverImg">
                        <img :src="`/api/${article.coverImg}`" class="main-uploader-img" alt="文章封面图" width="100%" height="200">
                    </template>
                    <template v-else>
                        <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
                        <div class="el-upload__text">
                            上传文章封面图，可将图片拖到此处 或 <em>点击上传</em>
                        </div>
                    </template>
                </el-upload>
            </div>
            <div class="main-category">
                <el-radio-group v-model="article.categoryId">
                    <el-radio v-for="item of category" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
                </el-radio-group>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="footer-main">
            <div><span>【存为草稿】只在后台列表显示，仅管理员可见；【立即发布】则线上所有读者可见～</span></div>
            <div>
                <el-button @click="router.back()">
                    <el-icon class="el-icon--left"><i-ep-back /></el-icon>返回列表
                </el-button>
                <el-button type="primary" plain @click="save(EStatusOfArticle.草稿)">
                    <el-icon class="el-icon--left"><i-ep-tickets /></el-icon>存为草稿
                </el-button>
                <el-button type="primary" @click="save(EStatusOfArticle.发布)">
                    <el-icon class="el-icon--left"><i-ep-promotion /></el-icon>立即发布
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
	import { IArticle, initArticle } from '@/models/IArticle'
	import $apiArticle from '@/apis/article'
    import { UploadFile, UploadFiles } from 'element-plus'
    import { EStatusOfArticle } from '@/enums/EStatus'
	import $apiCategory from '@/apis/category'
	import { ICategory } from '@/models/ICategory'

	const router = useRouter()
	const route = useRoute()
	const article = ref<IArticle>(initArticle())

	const detail = async () => {
		const id = route.query.id
		if (id) {
			const model = await $apiArticle.detail(~~id)
			article.value = model
		}
	}

	detail()

    const uploadSuccess = (res: any, _: UploadFile, __: UploadFiles) => {
        article.value.coverImg = res.data
    }

	const save = async (mark: number) => {
        article.value.status = mark
        if (article.value.id) {
            await $apiArticle.update(article.value)
        } else {
            await $apiArticle.create(article.value)
        }
		router.replace('/article')
	}

	const Authorization = ref(`Bearer ${localStorage.getItem('token')}`)

	const category = ref<ICategory[]>([])
	const getCategory = async () => {
		const result = await $apiCategory.list({ name: '', pageIndex: 1, pageSize: 30 })
		category.value = result.list
	}
	getCategory()
</script>

<style scoped>
    :deep(.el-upload-dragger) {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 0;
        width: 100%;
        height: 200px;
    }

    .bodyer {
        margin-bottom: 80px;
    }
    .bodyer-main {
        width: 90%;
        min-height: 900px;
        margin: 0 auto;
    }
    .main-title {
        border-bottom: 1px dashed #eee;
    }
    .title {
        width: 100%;
        height: 40px;
        font-size: 30px;
        font-weight: bold;
        padding: 15px 0;
        border: none;
        outline: none;
    }
    .main-editor {
        height: 900px;
        background-color: #fff;
        margin-top: 30px;
    }

    .main-setting {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        margin-top: 40px;
        color: #666;
    }

    .main-intro, .main-uploader {
        margin-top: 30px;
    }

    .main-uploader-img {
        width: 100%;
        height: 200px;
    }

    .main-category {
        border: 1px solid #dcdfe6;
        padding: 15px;
        border-radius: 5px;
        margin-top: 30px;
    }
    
    .footer {
        position: fixed;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 60px;
        border-top: 1px solid #eee;
        background-color: #f0f8ff;
        display: flex;
        justify-content: flex-end;
		z-index: 2000;
    }
    .footer-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 150px);
        height: 100%;
        color: #999;
        font-size: 14px;
        box-sizing: border-box;;
        padding: 0 5.5%;
    }
</style>