import en from "./en";

export default {
    AddPluginModal: {
        title: "添加插件",
        msg: "插件URL",
        confirm: "添加",
        cancel: "取消"
    },
    DeleteAllModal: {
        title: "删除所有文件",
        msg: "确定删除所有文件吗？",
        delete: "全部删除",
        cancel: "取消"
    },
    DeleteModal: {
        title: "删除文件",
        msg: "确定删除 ",
        delete: "删除",
        cancel: "取消"
    },
    DeviceSelector: {
        input: "输入设备"
    },
    EditorMainControlsUI: {
        stop: "停止",
        play: "播放",
        pause: "暂停",
        loop: "循环",
        record: "录音",
        monitor: "监听"
    },
    EditorMonitorUI: {
        start: "起始",
        end: "结束",
        duration: "时长",
        selection: "已选",
        view: "视图"
    },
    ExportModal: {
        title: "导出",
        fileName: "文件名",
        type: "文件类型",
        sampleRate: "采样率",
        addSampleRate: "添加 ",
        applyFx: "应用启用的插件",
        channels: "声道数",
        mix: "声道映射",
        bitrate: "比特率",
        bitDepth: "位深度",
        confirm: "导出",
        cancel: "取消"
    },
    FileManagerUI: {
        rename: "重命名",
        delete: "删除",
        files: "文件",
        newFile: "新文件",
        newFolder: "新文件夹",
        deleteAll: "全部删除"
    },
    InsertSilenceModal: {
        title: "插入静音",
        msg: "时长",
        insert: "插入",
        cancel: "取消"
    },
    NewAudioModal: {
        createNewAudio: "新音频文件",
        fileName: "文件名",
        sampleRate: "采样率",
        addSampleRate: "添加 ",
        channels: "声道数",
        create: "创建"
    },
    NewFolderModal: {
        title: "新文件夹",
        folderName: "文件夹名称",
        confirm: "创建",
        cancel: "取消"
    },
    PluginManagerUI: {
        add: "添加",
        delete: "移除",
        files: "插件",
        show: "显示界面",
        apply: "应用",
        applyFull: "整个文件",
        applySelected: "已选片段",
        preGain: "前置增益",
        postGain: "后置增益"
    },
    RemixModal: {
        title: "声道重混",
        channels: "声道数",
        matrix: "矩阵",
        confirm: "混合",
        cancel: "取消"
    },
    ResampleModal: {
        resampleAudio: "音频重采样",
        from: "源",
        to: "目标",
        addSampleRate: "添加 ",
        cancel: "取消",
        confirm: "重采样"
    },
    SaveAsModal: {
        title: "另存为",
        fileName: "文件名",
        confirm: "保存",
        cancel: "取消"
    },
    FileMenu: {
        fileMenu: "文件",
        new: "新音频文件",
        open: "打开...",
        save: "保存",
        duplicate: "制作副本",
        export: "导出..."
    },
    EditMenu: {
        editMenu: "编辑",
        undo: "撤销",
        redo: "重做",
        cut: "剪切",
        copy: "复制",
        paste: "粘贴",
        delete: "删除",
        silence: "静音",
        insertSilence: "插入静音",
        reverse: "反向",
        inverse: "反相",
        resample: "重采样",
        remixChannels: "声道重混",
        selectAll: "全选",
        playStop: "播放/停止"
    },
    TopMenu: {
        feedback: "使用反馈..."
    },
    UI: {
        drop: "拖拽文件到此处加载...",
        start: "双击文件名或拖拽文件到此处开始编辑..."
    }
} as typeof en;
