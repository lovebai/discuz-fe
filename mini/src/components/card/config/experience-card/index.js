import { getHeaderConfig } from './header';
import { getContentConfig } from './content';
import { checkAndGetBase64Src } from '../../utils'

const posterFrameWidth = 8;
const posterWidth = 710 - posterFrameWidth * 2;

const getConfig = async ({ site, experienceData, miniCode }) => {
  if (!miniCode) {
    return;
  }
  const codeUrl = await miniCode.base64Img ? await checkAndGetBase64Src(miniCode.base64Img) : miniCode;
  const { height: headerHeight, config: headerConfig } = getHeaderConfig();

  const { height: contentHeight, config: contentConfig } = getContentConfig({ site, experienceData, miniCode, codeUrl, baseHeight: headerHeight});

  const baseConfig = {
    width: posterWidth,
    height: contentHeight,
    backgroundColor: '#2469f6',
    debug: false,
    blocks: [],
    images: [],
    texts: [],
    lines: [],
  };
  const config = mergeObj([baseConfig, headerConfig, contentConfig]);

  return config;
};

const mergeObj = (arr) => {
  const numArgs = arr.length;
  if (!numArgs) {
    return {};
  }

  const base = arr[0];
  arr.forEach((item, index) => {
    if (index !== 0) {
      const keys = Object.keys(item);
      keys.forEach((key) => {
        console.log(item,key);
        base[key] = [...base[key], ...item[key]];
      });
    }
  });

  return base;
};

export default getConfig;
