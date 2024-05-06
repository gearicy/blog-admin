<template>
    <div ref="editor"></div>
</template>

<script lang="ts" setup>
// @ts-ignore
import Editor from '@toast-ui/editor'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

import Prism from 'prismjs'
import 'prismjs/components/prism-csharp.min.js'
import 'prismjs/components/prism-css.min.js'
import 'prismjs/components/prism-typescript.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-javascript.min.js'

import '@toast-ui/editor/dist/toastui-editor.css'
import 'prismjs/themes/prism-dark.min.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import $apiUpload from '@/apis/upload'

const editor = ref<HTMLElement>()
const props = withDefaults(defineProps<{modelValue: string}>(), { modelValue: '' })
const emits = defineEmits<{
	(event: 'update:modelValue', content: string):void,
	(event: 'getHTML', html: string):void
}>()

let edit:Editor | null = null
onMounted(() => {
    edit = new Editor({
        el: editor.value!,
        height: '900px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        placeholder: '期待您的新作…',
        initialValue: props.modelValue,
        plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
        events: {
            change: () => {
				emits('update:modelValue', edit?.getMarkdown() || '')
				emits('getHTML', edit?.getHTML() || '')
			}
        }
    })
    
    // 图片上传
    edit.removeHook('addImageBlobHook')
    edit.on('addImageBlobHook', async (file: File, cb: Function) => {
        const form = new FormData()
        form.append('file', file)
        const result = await $apiUpload.upload(form)
        cb(`/api/${result}`, file.name)
    })
})

watch(() => props.modelValue, (newValue, _) => {
    edit?.setMarkdown(newValue)
})
</script>