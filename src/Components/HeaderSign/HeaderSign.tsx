import React from 'react'
import style from './HeaderSign.module.css'
import logo from './../../../src/assets/img/Logo.png'
interface dataProps{
    title:string,
    disc:string
  }
const HeaderSign = ({title, disc}:dataProps) => {
  return (
    <div className={style.header}>
      <img src={logo}/>
      <div className={style.parg}>
      <h2>{title}</h2>
      <p> {disc} </p>
      </div>
    </div>
  )
}

export default HeaderSign
