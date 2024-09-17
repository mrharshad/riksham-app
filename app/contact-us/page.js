import React from "react";
import style from "./contactUs.module.css";
import Link from "next/link";
import Contact from "./contact";
import { cookies } from "next/headers";

export const generateMetadata = () => {
  return {
    title: "Contact-Us",
  };
};

const ContactUs = () => {
  const userInfo = cookies().get("userInfo")?.value;

  const { fName, lName, email } = userInfo ? JSON.parse(userInfo) : {};
  return (
    <section id="productUser" className={style.section}>
      <h1>CONTACT US</h1>
      <div className={style.address}>
        <div>
          <svg viewBox="0 0 64 64" id="address">
            <path
              d="M17.378,30.847,31.205,52.581a.942.942,0,0,0,1.59,0L46.621,30.847a.86.86,0,0,0,.047-.084,18.058,18.058,0,0,0,3.561-10.792,18.229,18.229,0,1,0-36.458,0,18.053,18.053,0,0,0,3.558,10.787A.864.864,0,0,0,17.378,30.847ZM32,3.625A16.364,16.364,0,0,1,48.345,19.971a16.188,16.188,0,0,1-3.29,9.8.893.893,0,0,0-.117.208L32,50.321,19.067,29.992a.934.934,0,0,0-.122-.217,16.188,16.188,0,0,1-3.29-9.8A16.364,16.364,0,0,1,32,3.625Z"
              fill="#ffffff"
            ></path>
            <path
              d="M40.756 50.939a.942.942 0 0 0-.154 1.878c5.906.485 9.432 1.806 9.432 3.532 0 1.279-6.366 3.767-18.034 3.767s-18.034-2.488-18.034-3.767c0-.822.9-2.812 9.281-3.52a.942.942 0 0 0-.159-1.877c-7.406.626-11.006 2.392-11.006 5.4C12.082 60.232 22.407 62 32 62s19.918-1.768 19.918-5.651C51.918 53.326 48.267 51.556 40.756 50.939zM21.9 23.116h2.5v7.935a.941.941 0 0 0 .942.941H38.657a.941.941 0 0 0 .942-.941V23.116h2.5a2.193 2.193 0 0 0 2.109-1.38 1.831 1.831 0 0 0-.622-2.07l-10.1-8.191a2.436 2.436 0 0 0-2.974 0l-10.1 8.19a1.83 1.83 0 0 0-.622 2.069A2.194 2.194 0 0 0 21.9 23.116zm11.734 6.993h-2.9a.917.917 0 0 0 .185-.531V26.265a1.268 1.268 0 1 1 2.535 0v3.313A.917.917 0 0 0 33.632 30.109zM31.7 12.938a.546.546 0 0 1 .6 0l10.1 8.19.033-.023c-.01.025-.1.126-.334.126H38.657a.942.942 0 0 0-.942.942v7.935H35.146a.923.923 0 0 0 .184-.531V26.265a3.151 3.151 0 1 0-6.3 0v3.313a.917.917 0 0 0 .185.531H26.285V22.174a.941.941 0 0 0-.941-.942H21.9c-.233 0-.325-.1-.3-.1z"
              fill="#ffffff"
            ></path>
          </svg>
          <p>Office Address</p>
          <span>
            Gandhi nagar murra bhatti gudhiyari raipur (chhattisgarh) PinCode:
            492011
          </span>
        </div>
        <Link href="tel:7771998614">
          <svg width="24" height="24" viewBox="0 0 24 24" id="phone">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              fill="#ffffff"
              d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52c-.12-1.01-.97-1.77-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"
            ></path>
          </svg>
          <p>Call Now</p>
          <span>Tel: 7771998614 </span>
        </Link>
        <div>
          <svg
            fill="#ffffff"
            data-name="Layer 1"
            viewBox="0 0 64 64"
            id="clock"
          >
            <path d="M32,3A29,29,0,1,0,61,32,29,29,0,0,0,32,3Zm7.05,40.29-5.04-6.71.016-.017A4.949,4.949,0,0,1,32,37a4.991,4.991,0,0,1-1.2-9.837L29,11l3-4,3,4L33.2,27.163a4.967,4.967,0,0,1,3.359,6.864l.017-.017,6.71,5.04L44,44Z"></path>
          </svg>
          <p>Service Available</p>
          <span>Mon-Sat: 10:30AM - 08:00PM</span>
        </div>
        <Link href="mailto:rikshamsahu@gmail.com">
          <svg
            fill="#ffffff"
            id="mail"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 29 29"
          >
            <path d="M2 7.42v14.172l7.086-7.086zM3.408 6l8.971 8.971c1.133 1.133 3.109 1.133 4.242 0L25.592 6H3.408z"></path>
            <path d="M18.035 16.385c-.943.944-2.199 1.465-3.535 1.465s-2.592-.521-3.535-1.465l-.465-.465L3.42 23h22.16l-7.08-7.08-.465.465zM19.914 14.506L27 21.592V7.42z"></path>
          </svg>
          <p>Send Mail</p>
          <span>rikshamsahu@gmail.com</span>
        </Link>
      </div>
      <Contact fName={fName} lName={lName} email={email} Link={Link} />
    </section>
  );
};

export default ContactUs;
