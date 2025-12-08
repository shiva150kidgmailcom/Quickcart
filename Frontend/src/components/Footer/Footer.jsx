import React from 'react'
import style from './footer.module.css'
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className={style.Footer} id="Footer">
      <div className={style.FooterContent}>
        <div className={style.FooterContentLeft}>
            <img src={assets.logo} alt=""  className={style.logo}/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt rem aperiam voluptatibus architecto! Harum alias veniam, architecto quisquam ratione asperiores?</p>
            <div className={style.FooterSocial}>
                <img src={assets.facebook_icon} alt="" /><img src={assets.twitter_icon} alt="" /><img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className={style.FooterContentMiddle}>
            <h2>
                COMPANY
            </h2>
            <ul>
                <li><Link to="/">home</Link></li>
                <li>deilvery</li>
                <li>privacy policy</li>
            </ul>
        </div>
        <div className={style.FooterContentRight}>
            <h2>Get In Touch</h2>
            <ul>
                <li>+91 7019468597</li>
                <li>QuickCart@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className={style.FooterCopyrigth}>
        CopyRight 2024 ©️ Company.com - All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer