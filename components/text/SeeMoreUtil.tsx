import { PixelRatio } from 'react-native';
import reactNativeTextSize, { TSFontWeight } from 'react-native-text-size';

/**
 * When difference between partialTextWidth and widthLimit is less than
 * this value, we mark the truncation index.
 */
const DIFFERENCE_THRESHOLD = 10;

interface Props {
  text: string;
  numberOfLines: number;
  fontSize: number;
  containerWidth: number;
  fontFamily?: string;
  fontWeight?: TSFontWeight;
  seeMoreText?: string;
}

/**
 * Finds the point where the text will be truncated, leaving enough space to show
 * the "read more" link
 */
async function getTruncationIndex({
  text,
  numberOfLines,
  fontSize,
  fontFamily,
  fontWeight,
  containerWidth,
  seeMoreText = '...'
}: Props) {

  const scaledFontSize = Math.round(fontSize * PixelRatio.getFontScale());
  const { lineCount: lineCount } = await reactNativeTextSize.measure({
    text: text,
    width: containerWidth,
    fontSize: scaledFontSize,
    fontFamily,
    fontWeight,
  });

  if (lineCount <= numberOfLines) {
    // console.log('quit')
    return undefined
  }

  let index = 0
  let currentLine = 1
  let partialText = text

  while (currentLine <= numberOfLines) {
    const linebreakIndex = text.indexOf('\n', index)
    // console.log(currentLine, currentLine <= numberOfLines, linebreakIndex)
    partialText = text.slice(index, linebreakIndex)

    // Handle Empty line \n
    if (partialText.length == 0) {
      currentLine = currentLine + 1
      index = index + 1
      continue
    }

    // console.log(partialText)
    let { lineCount } = await reactNativeTextSize.measure({
      text: partialText,
      width: containerWidth,
      fontSize: scaledFontSize,
      fontFamily,
      fontWeight,
    });

    // console.log('\n전체 글자수 :', partialText.length,
    //   '\n전체 라인 수 : ', lineCount)

    // console.log(lineCount, numberOfLines - currentLine)
    if (lineCount <= numberOfLines - currentLine) {
      currentLine = currentLine + lineCount
      index = index + linebreakIndex + 1
      continue
    }
    const { lineInfo: lineInfo } = await reactNativeTextSize.measure({
      text: partialText,
      width: containerWidth,
      fontSize: scaledFontSize,
      fontFamily,
      fontWeight,
      lineInfoForLine: numberOfLines - currentLine
    });
    currentLine = currentLine + lineCount
    index = index + lineInfo?.end || 0
  }

  const { lineCount: finalLineCount } = await reactNativeTextSize.measure({
    text: text.slice(0, index) + seeMoreText,
    width: containerWidth,
    fontSize: scaledFontSize,
    fontFamily,
    fontWeight,

  });
  // console.log('index point :', index, seeMoreText.length, finalLineCount)
  let truncationIndex = Math.floor(index)
  if (finalLineCount == numberOfLines + 1 && truncationIndex > seeMoreText.length) {
    truncationIndex = truncationIndex - seeMoreText.length
  }
  // console.log('index point after calculation:', truncationIndex)
  // console.log("\n\n", text.slice(0, truncationIndex), seeMoreText, "\n\n",)

  return truncationIndex;
}

export default {
  getTruncationIndex,
};