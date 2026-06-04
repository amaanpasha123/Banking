import React from 'react'

const HeaderBox = ({type="title", title, user, subtext}
    :
    HeaderBoxProps) => {
  return (
    <div>
        <h1 className='header-box-title'>{title}</h1>
    </div>
  )
}

export default HeaderBox