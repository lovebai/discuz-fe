import replaceStringInRegex from '@common/utils/replace-string-in-regex';
//
/**
 * 计算帖子内容的长度，用于是否激活“查看更多”
 * 逻辑：
 * 1. lengthInLine代表一行能有多少字
 * 2. Emoj是用<img ... class="qq-emotion" .../> 表示的，算作1.5个字
 * 3. 图片的<img>算作是四行字的长度，要考虑Emoj的情况
 * 4. 对于回车符，回车之后的长度要计算在内
 * 5. <img>会被替换成[图片]以便计算字数
*/
export default function fuzzyCalcContentLength(content, lengthInLine = 50) {
    content = '' + content;
    if (!content || content === '') return 0;

    let _content = content;

    const EMOJ_SIZE = 1.5;
    const IMG_SIZE = lengthInLine * 4;
    const countImgs = (_content?.match(/<img/g) || []).length;
    const countEmojs = (_content?.match(/qq-emotion/g) || []).length;

    // 替换表情标签
    let newContent = replaceStringInRegex(_content, "emoj", '');

    // 替换图片标签
    newContent = replaceStringInRegex(newContent, "img", '');

    // 把代码块中的<br>换成*br*从而不参与计算长度，并换回占位符，回车换成'\n'
    newContent = replaceStringInRegex(newContent, "breakInCode", '*br*');
    newContent = replaceStringInRegex(newContent, "break", '\n');

    // 替换所有标签
    newContent = replaceStringInRegex(newContent, "tags", '');

    if(!newContent || newContent === '') return 0;

    const countReturns = (newContent.match(/\n/g) || []).length; // 匹配回车符
    let totalCount = newContent.length +
        EMOJ_SIZE * countEmojs + // 表情大小
        IMG_SIZE * (countImgs - countEmojs > 0 ? countImgs - countEmojs : 0); // 加上图片大小

    for(let i = 0; i < countReturns; i++) {
        if(newContent.indexOf('\n') >= 0) {
            const restInLine = lengthInLine - newContent.indexOf('\n') > 0 ? // 防止长文章最后一个字是回车
                                lengthInLine - newContent.indexOf('\n') : 0;
            totalCount += restInLine;
            newContent = newContent.substr(newContent.indexOf('\n') + 1);
        }
    }
    return parseInt(totalCount);
}
  