import { posterWidth } from '../constants';

const notesData = ['通过限时体验卡加入的用户，将被授权付费站', '点的查看权限，仅能查看站点仅30天内发布的', '内容。',' 一个用户仅可使用体验卡一次，到期后需要付','费加入。'];
const circlesData = [
  {
    x: 16 * 2,
    y: 26 * 2,
    width: 8 * 2,
    height: 8 * 2,
    backgroundColor: '#fff'
  },
  {
    x: 16 * 2,
    y: 105 * 2,
    width: 8 * 2,
    height: 8 * 2,
    backgroundColor: '#fff'
  },
  {
    x: 2 * 2,
    y: 1083,
    width: 16 * 2,
    height: 16 * 2,
    zIndex: 20,
    backgroundColor: '#2469F6'
  },
  {
    x: posterWidth - 18 * 2,
    y: 1083,
    width: 16 * 2,
    height: 16 * 2,
    zIndex: 20,
    backgroundColor: '#2469F6'
  },
]

export const getHeaderConfig = () => {
    const notes = handleTexts({texts: notesData, x: 32 * 2, y: 25 * 2 });
    const circles = handleCircle(circlesData);
    const headerConfig = {
      height: 350,
      config: {
        texts: [
          // 昵称
          ...notes,
        ],
        blocks: [
          ...circles
        ]
      }
    };

    return headerConfig;
}


const handleCircle = (circles) => circles.map(item => ({
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    borderRadius: item.width,
    backgroundColor: item.backgroundColor,
    zIndex: item.zIndex || 0
}));

const handleTexts = ({ x, y, texts}) => texts.map((item, index) => {
  return    {
    text: item,
    color: '#8590A6',
    x,
    y: y + index * (26 * 2),
    lineHeight: 26 * 2,
    fontSize: 14 * 2,
    textAlign: 'left',
    color: '#fff',
    baseLine: 'top'
  }
});