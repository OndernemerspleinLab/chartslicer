import React from 'react'
import glamorous from 'glamorous'

const Svg = glamorous.svg({
  width: '0.8rem',
  height: '0.8rem',
  display: 'block',
})

export const Pencil = props => (
  <Svg {...props} viewBox="0 0 512 512">
    <path d="M432 0c44.182 0 80 35.817 80 80 0 18.010-5.955 34.629-16 48l-32 32-112-112 32-32c13.371-10.045 29.989-16 48-16zM32 368l-32 144 144-32 296-296-112-112-296 296zM357.789 181.789l-224 224-27.578-27.578 224-224 27.578 27.578z" />
  </Svg>
)
