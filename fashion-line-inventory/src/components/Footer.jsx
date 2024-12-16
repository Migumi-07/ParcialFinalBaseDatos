import { FaIcons } from "react-icons/fa";
import "../css/Footer.css";
import { FaFacebook, FaInstagram, FaGooglePlus } from "react-icons/fa";
import { SlSocialFacebook } from "react-icons/sl";
import { IoLogoYoutube } from "react-icons/io";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { GrGooglePlus } from "react-icons/gr";

function Footer() {
  return (
    <>
      <div className="footerContainer">
        <div className="logosContainer">
          <FaFacebook className="logosFooter" />
          <FaInstagram className="logosFooter" />
          <IoLogoYoutube className="logosFooter" />
          <FaXTwitter className="logosFooter" />
          <AiFillGoogleCircle className="logosFooter" />
        </div>
      </div>
    </>
  );
}

export default Footer;
