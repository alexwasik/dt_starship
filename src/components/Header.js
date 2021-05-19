import React from 'react'
import { Image } from 'antd'

const Header = () => {
  return (
    <div className='animation'>
      <Image src={`${process.env.PUBLIC_URL}/millenniumfalcon.svg`}
        width={100}
        height={100}
        preview={false}
      />
    </div>
  )
}

export default Header
