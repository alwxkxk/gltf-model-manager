
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { useState } from 'react'

function ColorPicker (params) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const defaultColor = {
    r: '255',
    g: '255',
    b: '255',
    a: '1'
  }
  if (params.defaultColor) {
    Object.keys(params.defaultColor).forEach(key => {
      defaultColor[key] = params.defaultColor[key]
    })
  }
  const [color, setColor] = useState(defaultColor)

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker)
  }

  const handleClose = () => {
    setDisplayColorPicker(false)
  }

  const handleChange = (colorObj) => {
    setColor({ ...colorObj.rgb })
    params.onChange(colorObj)
  }

  const styles = reactCSS({
    default: {
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  })

  return (
    <div>
    <div style={ styles.swatch } onClick={ handleClick }>
      <div style={{
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
      }}/>
    </div>
    { displayColorPicker
      ? <div style={ styles.popover }>
      <div style={ styles.cover } onClick={ handleClose }/>
      <SketchPicker color={ color } onChange={ handleChange } />
    </div>
      : null }

  </div>

  )
}

export default ColorPicker
