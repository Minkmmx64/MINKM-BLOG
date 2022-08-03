interface Article {
    picture: string,//封面
    label: string,//标签
    title: string,//标题
    categorie: string,//分类
    update_at: string,
    created_at: string,
}
export interface WebShare {
    imgUrl: string,             //图片封面
    url: string,                //路径
    title: string,              //标题
    describe: string,           //描述
    create_at: string,          //创建时间
}
export interface Comment {
    id?: number,
    _id?: string,
    avatar: string,//头像
    username: string,//用户头像
    comment: string,//评论内容
    create_at: string,//评论时间
    comment_dislike: number,
    comment_like: number,
    like: number,
    children?: Comment[]
}
export const ArticleListMook = <Article[]>[
    {
        picture: 'https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500',
        label: '标签1,标签2,标签3',
        title: '这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题',
        categorie: '分类分类',
        update_at: '2000 11:11',
        created_at: '1999 11:11'
    },
    {
        picture: 'https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500',
        label: '标签1,标签2,标签3',
        title: '这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题',
        categorie: '分类分类',
        update_at: '2000 11:11',
        created_at: '1999 11:11'
    },
    {
        picture: 'https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500',
        label: '标签1,标签2,标签3',
        title: '这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题',
        categorie: '分类分类',
        update_at: '2000 11:11',
        created_at: '1999 11:11'
    },
    {
        picture: 'https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500',
        label: '标签1,标签2,标签3',
        title: '这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题',
        categorie: '分类分类',
        update_at: '2000 11:11',
        created_at: '1999 11:11'
    },
    {
        picture: 'https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500',
        label: '标签1,标签2,标签3',
        title: '这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题',
        categorie: '分类分类',
        update_at: '2000 11:11',
        created_at: '1999 11:11'
    },
    {
        picture: 'https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500',
        label: '标签1,标签2,标签3',
        title: '这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题',
        categorie: '分类分类',
        update_at: '2000 11:11',
        created_at: '1999 11:11'
    },
];

export const commentList: Comment[] = [
    {
        avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645153596062-t8.jpg', //用户头像
        username: 'mjw12345',   //用户名
        comment: '评论内容',     //内容
        create_at: '2022 2 19', //发表时间
        like: 1,                //我是否点赞
        comment_dislike: 100,   //评论踩
        comment_like: 200,      //评论点赞
        id: 1,      //评论用户唯一ID!!!!!!!!
        children: [         //如果在当前文章id下有人评论了用户ID下的评论
            {
                id: 2,
                avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645153596062-t8.jpg',
                username: 'mjw12345',
                comment: '评论评论内容评论内容评论内评论评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容内容评论评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容内容评论评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容内容容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容内容',
                create_at: '2022 2 19',
                like: 1,
                comment_dislike: 100,
                comment_like: 200,
            },
            {
                id: 3,
                avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645083124297-head.jpg',
                username: 'test',
                comment: '评论内容',
                create_at: '2022 2 19',
                like: 1,
                comment_dislike: 100,
                comment_like: 200,
            },
            {
                id: 4,
                avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645153596062-t8.jpg',
                username: 'mjw12345',
                comment: '评论内容',
                create_at: '2022 2 19',
                like: 1,
                comment_dislike: 100,
                comment_like: 200,
            },
            {
                id: 5,
                avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645083124297-head.jpg',
                username: 'test',
                comment: '评论内容评论内容评论内容评论内容',
                create_at: '2022 2 19',
                like: 1,
                comment_dislike: 100,
                comment_like: 200,
            },
        ]
    },
    {
        avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645083124297-head.jpg',
        username: 'test',
        comment: '评论内容',
        create_at: '2022 2 19',
        like: 1,
        comment_dislike: 100,
        comment_like: 200,
        id: 9,
        children: [
            {
                id: 6,
                avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645153596062-t8.jpg',
                username: 'mjw12345',
                comment: '评论内容',
                create_at: '2022 2 19',
                like: 1,
                comment_dislike: 100,
                comment_like: 200,
            },
            {
                id: 7,
                avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645153596062-t8.jpg',
                username: 'test',
                comment: '评论内容',
                create_at: '2022 2 19',
                like: 1,
                comment_dislike: 100,
                comment_like: 200,
            }
        ]
    },
    {
        id: 8,
        avatar: 'http://localhost:8080/chat/upload/img/chat_head/1645153596062-t8.jpg',
        username: 'test',
        comment: '评论内容',
        create_at: '2022 2 19',
        like: 1,
        comment_dislike: 100,
        comment_like: 200,
    }
];

export const BlogWebShare: WebShare[] = [
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
    {
        title: "测试titlt",
        url: "http://www.baidu.com",
        imgUrl: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        create_at: "2022 2 10",
        describe: "一段很长的描述一段很长的描述一段很长的描述一段很长的描述",
    },
];