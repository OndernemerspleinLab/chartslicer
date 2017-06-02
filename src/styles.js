import { css } from 'glamor'

const borderRadiusSize = '4px'

export const resetBorderRadius = css({
  borderRadius: 0,
})

export const borderRadius = css({
  borderRadius: borderRadiusSize,
})

export const borderRadiusLeft = css({
  borderTopLeftRadius: borderRadiusSize,
  borderBottomLeftRadius: borderRadiusSize,
})

export const borderRadiusRight = css({
  borderTopRightRadius: borderRadiusSize,
  borderBottomRightRadius: borderRadiusSize,
})

export const borderRadiusOnlyLeft = css(resetBorderRadius, borderRadiusLeft)

export const borderRadiusOnlyRight = css(resetBorderRadius, borderRadiusRight)

export const fadeInKeyframes = css.keyframes({
  from: {
    opacity: 0,
  },
})

export const fadeInAnimation = `300ms ease-in ${fadeInKeyframes}`
