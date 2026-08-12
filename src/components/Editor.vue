<template>
    <div class="editor-container">
        <textarea
            ref="editorRef"
            :value="content"
            @input="handleInput"
            @keydown="handleKeyDown"
            class="editor"
            :class="{ 'dark-theme': isDarkTheme }"
            placeholder="输入框区域"
        ></textarea>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, type Ref } from "vue";
import type { EditorEvents } from "../types";

// 注入主题状态
const isDarkTheme = inject("isDarkTheme", ref(false)) as Ref<boolean>;

const props = defineProps<{
    content: string;
    autoFocus?: boolean;
}>();

const emit = defineEmits<EditorEvents>();

const editorRef = ref<HTMLTextAreaElement>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit("updateContent", target.value);
    emit("saveFile");
};

const handleKeyDown = (event: KeyboardEvent) => {
    // Tab键插入缩进
    if (event.key === "Tab") {
        event.preventDefault();
        const textarea = event.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value =
            textarea.value.substring(0, start) +
            "  " +
            textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;

        // 触发更新事件
        emit("updateContent", textarea.value);
    }
};

const focus = () => {
    editorRef.value?.focus();
};

onMounted(() => {
    if (props.autoFocus) {
        focus();
    }
});

// 暴露方法给父组件
defineExpose({
    focus,
});
</script>

<style scoped>
.editor-container {
    height: 100%;
    overflow: auto;
}

.editor {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 20px;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
        "Courier New", monospace;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    background: #fff;
    color: #333;
}

.editor.dark-theme {
    background: #1a1a1a;
    color: #e0e0e0;
}
</style>
