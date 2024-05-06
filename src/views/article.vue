<template>
    <!-- 搜索 -->
    <div class="search">
        <div class="search__left">
            <div class="search__left-item">
                <el-input v-model.trim="params.title" @change="search" clearable placeholder="输入标题搜索">
                    <template #append>
                        <el-button><el-icon><i-ep-search /></el-icon></el-button>
                    </template>
                </el-input>
            </div>
            <div class="search__left-item">
                <el-select v-model="params.status" @change="search" placeholder="状态" clearable>
                    <el-option label="发布" :value="1"></el-option>
                    <el-option label="草稿" :value="0"></el-option>
                </el-select>
            </div>
            <div class="search__left-item">
                <el-select v-model="params.categoryId" @change="search" placeholder="分类" clearable>
                    <el-option v-for="item of category" :key="item.id!" :label="item.name" :value="item.id!"></el-option>
                </el-select>
            </div>
        </div>
        <div class="search__right">
            <el-button type="primary" @click="add">
                <el-icon class="el-icon--left"><i-ep-circle-plus-filled /></el-icon>新增
            </el-button>
        </div>
    </div>

    <!-- 列表 -->
    <el-table :data="list" stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
            <template #default="scope">
                <span class="link" @click="viewArticle(scope.row.id)">{{ scope.row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="150" />
        <el-table-column prop="viewCount" label="阅读量" width="150" align="center" />
        <el-table-column prop="commentCount" label="评论数" width="150" align="center" >
            <template #default="scope">
                <span class="link" v-if="scope.row.commentCount > 0" @click="viewComment(scope.row.id)">{{ scope.row.commentCount }}</span>
                <span v-else>{{ scope.row.commentCount }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="createTime" label="最新更新时间" width="200">
            <template #default="scope">
                {{ dateFormat(scope.row.createTime) }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
            <template #default="scope">
                <el-switch v-model="scope.row.status" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="发布"
                    inactive-text="草稿"
                    :active-value="1"
                    :inactive-value="0"
                    @change="$apiArticle.update(scope.row)" />
            </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="230">
            <template #default="scope">
                <el-button type="danger" plain @click="remove(scope.row)">
                    <el-icon class="el-icon--left"><i-ep-delete /></el-icon>删除
                </el-button>
                <el-button type="primary" plain @click="edit(scope.row.id)">
                    <el-icon class="el-icon--left"><i-ep-edit /></el-icon>编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background hide-on-single-page layout="sizes, prev, pager, next, total, jumper" :total="paging.total"
        v-model:page-size="paging.pageSize" v-model:current-page="paging.pageIndex" :page-sizes="[10, 15, 20, 25, 30]"
        @current-change="getList" @size-change="getList" style="margin-top: 20px;" />

	<!-- 查看评论 -->
    <el-dialog v-model="dialogVisible" title="查看评论 (红色代表尚未通过审核)">
        <el-card v-for="comment of commentList" :key="comment.id!" class="comment" :class="{ 'comment-status-0': comment.status === 0 }">
            <div class="comment-title">
                <span class="comment-nick-name">{{ comment.nickName }}</span>
                <span class="comment-date-time">{{ dateFormat(comment.createTime!) }}</span>
            </div>
            <div class="comment-content" v-html="comment.content"></div>
        </el-card>
		<el-pagination background layout="sizes, prev, pager, next, total, jumper" :total="commentTotal"
        v-model:page-size="paramsCategory.pageSize" v-model:current-page="paramsCategory.pageIndex" :page-sizes="[10, 15, 20, 25, 30]"
        @current-change="getCommentList" @size-change="getCommentList" style="margin-top: 20px;" />
    </el-dialog>
</template>

<script lang="ts" setup>
    import useList from '@/hooks/useList'
    import useConfirm from '@/hooks/useConfirm'
    import useDateFormat from '@/hooks/useDateFormat'
    import { IArticle } from '@/models/IArticle'
    import $apiArticle from '@/apis/article'
    import $apiComment from '@/apis/comment'
    import { IComment } from '@/models/IComment'
	import $apiCategory from '@/apis/category'
	import { ICategory } from '@/models/ICategory'

    const { dateFormat } = useDateFormat()

    // 列表
    const params = reactive({ title: '', status: undefined, categoryId: undefined })
    const {
        list,
        paging,
        getList,
        search
    } = useList<IArticle>($apiArticle.list, params)
    getList()

    // 删除
    const { confirm } = useConfirm()
    const remove = (row: IArticle) => {
        confirm(`确定删除文章 [${row.title}] 吗？`, () => {
            $apiArticle.delete(row.id!).then(() => {
                getList()
            })
        })
    }

    const router = useRouter()

    // 新增
    const add = () => {
        router.push('/article/edit')
    }

    // 编辑
    const edit = (id: number) => {
        router.push(`/article/edit?id=${id}`)
    }

    // 查看评论
    const dialogVisible = ref(false)
    const commentList = ref<IComment[]>([])
	const commentTotal = ref(0)
	const paramsCategory = reactive({ articleId: 0, pageIndex: 1, pageSize: 5 })
    const viewComment = async (articleId: number) => {
		paramsCategory.articleId = articleId
		paramsCategory.pageIndex = 1
        dialogVisible.value = true
		getCommentList()
    }
	const getCommentList = async () => {
		const result = await $apiComment.list(paramsCategory)
		commentList.value = result.list
		commentTotal.value = result.total
	}

	const category = ref<ICategory[]>([])
	const getCategory = async () => {
		const result = await $apiCategory.list({ name: '', pageIndex: 1, pageSize: 30 })
		category.value = result.list
	}
	getCategory()

    const viewArticle = (articleId: number) => {
        window.open('https://yanyunfeng.com/article/' +  articleId)
    }
</script>

<style scoped>
    .comment {
        margin-bottom: 20px;
    }
    .comment-status-0 {
        border: 3px solid lightpink;
    }
    .comment-title {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 10px;
    }
    .comment-nick-name {
        font-weight: bold;
    }
    .comment-date-time {
        color: #999;
    }
    .comment-content {
        text-align: justify;
    }
	.comment-content :deep(.mention) {
		color: dodgerblue;
	}
</style>