module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        [
            'prismjs',
            {
                languages: ['javascript', 'css', 'markup', 'java', 'cpp', 'csharp', 'python', 'ruby', 'php'], //高亮语言类型
                plugins: ['line-numbers'],
                theme: 'tomorrow', //主题
                css: true,
            },
        ],
    ],
};
