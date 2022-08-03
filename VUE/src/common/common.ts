import moment from 'moment';
export function handleDate(): string {
    return moment().format("YYYY M D H m");        //时间格式
}
export const userNameRegEx = /^[\u4E00-\u9FA5A-Za-z0-9_]{6,20}$/;                    //6-20个包含中英文数字下划线的昵称
export const userNicknameRegEx = /^[\u4E00-\u9FA5A-Za-z0-9_]{6,20}$/;                //6-20个包含中英文数字下划线的昵称
export const userPhoneRegEx = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; //手机号
export const userPsdRegEx = /^[A-Za-z0-9]{6,20}$/;                //密码6-20位英文数字
export const checkUrl = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/; // 匹配网址
export const emoji = {
    step1: /(#\()[\u4E00-\u9FA5](\)#)/g //匹配#(哈哈)#  
};
export function RemoveSpaces(str: string) {
    if (str === null || str === undefined || str === '') return '';
    return str.replace(/\s+/g, "");
}

export function deepClone(params: Object) {
    return JSON.parse(JSON.stringify(params));
}

export const EMOJI = [
    "😀", "😁", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍",
    "😘", "😗", "😙", "😚", "☺", "😇", "😐", "😑", "😶", "😏", "😣", "😥", "😮", "😯", "😪",
    "😫", "😴", "😌", "😛", "😜", "😝", "😒", "😓", "😔", "😕", "😲", "😷", "😖", "😞", "😟",
    "😤", "😢", "😭", "😦", "😧", "😨", "😬", "😰", "😱", "😳", "😵", "😡", "😠",
    "👦", "👧", "👨", "👩", "👴", "👵", "👶", "👱", "👮", "👲", "👳", "👷", "👸", "💂", "🎅", "👰", "👼",
    "💆", "💇", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🙇", "🙌", "🙏", "👤", "👥", "🚶", "🏃", "👯",
    "💃", "👫", "👬", "👭", "💏", "💑", "👪", "💪", "👈", "👉", "☝", "👆", "👇", "✌", "✋", "👌",
    "👍", "👎", "✊", "👊", "👋", "👏", "👐", "✍", "👣", "👀", "👂", "👃", "👅", "👄", "💋", "👓",
    "👔", "👙", "👛", "👜", "👝", "🎒", "💼", "👞", "👟", "👠", "👡", "👢", "👑",
    "👒", "🎩", "🎓", "💄", "💅", "💍", "🌂", "📶", "📳", "📴", "♻", "🏧", "🚮", "🚰", "♿", "🚹", "🚺",
    "🚻", "🚼", "🚾", "⚠", "🚸", "⛔", "🚫", "🚳", "🚭", "🚯", "🚱", "🚷", "🔞", "💈",
    "🙈", "🐒", "🐶", "🐕", "🐩", "🐺", "🐱", "🐈", "🐯", "🐅", "🐆", "🐴", "🐎", "🐮", "🐂",
    "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🐘", "🐭",
    "🐁", "🐀", "🐹", "🐰", "🐇", "🐻", "🐨", "🐼", "🐾", "🐔", "🐓", "🐣", "🐤", "🐥",
    "🐦", "🐧", "🐸", "🐊", "🐢", "🐍", "🐲", "🐉", "🐳", "🐋", "🐬", "🐟", "🐠", "🐡",
    "🐙", "🐚", "🐌", "🐛", "🐜", "🐝", "🐞", "🦋", "💐", "🌸", "💮", "🌹", "🌺",
    "🌻", "🌼", "🌷", "🌱", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "🍀", "🍁", "🍂", "🍃",
    "🌍", "🌎", "🌏", "🌐", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚",
    "🌛", "🌜", "☀", "🌝", "🌞", "⭐", "🌟", "🌠", "☁", "⛅", "☔", "⚡", "❄", "🔥", "💧", "🌊",
    "🏀", "🏈", "🏉", "🎾", "🎱", "🎳", "⛳", "🎣", "🎽", "🎿",
    "😈", "👿", "👹", "👺", "💀", "☠", "👻", "👽", "👾", "💣",
    "🌋", "🗻", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨",
    "⛲", "🌁", "🌃", "🌆", "🌇", "🎠", "🎡", "🎢", "🚂",
    "🚌", "🚍", "🚎", "🚏", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘",
    "💌", "💎", "🔪", "💈", "🚪", "🚽", "🚿", "🛁", "⌛", "⏳", "⌚", "⏰", "🎈", "🎉",
    "💤", "💢", "💬", "💭", "♨", "🌀", "🔔", "🔕", "✡", "✝", "🔯", "📛", "🔰", "🔱", "⭕", "✅",
    "☑", "✔", "✖", "❌", "❎", "➕", "➖", "➗", "➰", "➿", "〽", "✳", "✴", "❇", "‼", "⁉", "❓", "❔", "❕", "❗",
    "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡",
    "🕖", "🕢", "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦", "⏱", "⏲", "🕰",
    "💘", "❤", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "💝", "💞", "💟❣",
    "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓",
];
export interface IconverComment {
    article_id;
    avatar;
    comment;
    comment_dislike;
    comment_like;
    like;
    parent_id;
    username;
    _id;
    children: IconverComment[];
}

export function converComment(converT: IconverComment[]) {
    console.log(converT);
    
    let currentConvarT = [] as IconverComment[];
    let vis = [];
    let k = 0;
    for (let i = 0; i < converT.length; i++) vis[i] = 0;
    for (let i = 0; i < converT.length; i++) {
        if (converT[i].parent_id === "root" && !vis[i]) {
            currentConvarT[k] = converT[i];
            currentConvarT[k++].children = [] as IconverComment[];
            vis[i] = 1;
        }
    }
    for (let i = 0; i < k; i++) {
        let len = 0;
        for (let j = 0; j < converT.length; j++) {
            if (currentConvarT[i]._id === converT[j].parent_id) {
                currentConvarT[i].children[len++] = converT[j];
            }
        }
    }

    return currentConvarT;
}
