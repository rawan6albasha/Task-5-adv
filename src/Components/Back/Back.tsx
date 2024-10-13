import React from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import style from './Back.module.css'
const Back = () => {
  return (
    <Link className={style.back} to="/">
    <FontAwesomeIcon icon={faAngleLeft} />
  </Link>
  )
}

export default Back
