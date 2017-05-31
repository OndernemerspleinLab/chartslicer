import glamorous from 'glamorous'

export const Media = glamorous.span(
  {
    display: 'flex',
    flexDirection: 'row',
  },
  ({ alignItems }) => ({
    alignItems,
  })
)

export const InlineMedia = glamorous.span({
  display: 'inline-flex',
  flexDirection: 'row',
})

export const MediaText = glamorous.span({
  flex: '1 1 auto',
})

export const MediaFigure = glamorous.span({
  flex: '0 0 auto',
})
