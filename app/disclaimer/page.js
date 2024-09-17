import React from "react";
import style from "./disclaimer.module.css";
import Link from "next/link";
export const generateMetadata = () => {
  return {
    title: "Disclaimer",
  };
};
const Disclaimer = ({ searchParams }) => {
  const hindi = searchParams.hindi;
  return (
    <section id="productUser" className={style.section}>
      <input type="checkbox" defaultChecked={hindi ? true : false} />
      <h1 className={style.h1}>
        Website Disclaimer
        <Link href={hindi ? "?" : "?hindi=true"}>
          {hindi ? "English..." : "Hindi..."}
        </Link>
      </h1>
      <p>
        {hindi
          ? `
        हमारी एक छोटी टीम होने के कारण, इस वेबसाइट पर मौजूद उत्पादों के बारे में अधिकांश जानकारी इंटरनेट के माध्यम से एक से अधिक वेबसाइटों से एकत्र की गई है। हम उत्पाद पर अपना स्वयं का अधिक शोध नहीं करते हैं, हम अपने ग्राहकों तक जानकारी पहुंचाने के लिए ब्रांड/कंपनी द्वारा प्रदान की गई जानकारी के साथ अपने स्वयं के शोध से मिली जानकारी को शामिल करते हैं, हालांकि हम जानकारी को अद्यतन और सही रखने का प्रयास करते हैं। इसे बनाए रखने के लिए हर संभव प्रयास करें.`
          : `Due to us being a small team, most of the information about the products present on this website has been collected from more than one website through the internet. We do not do much of our own research on the product, we incorporate information from our own research with information provided by the brand/company to deliver information to our customers, however we make every effort to keep the information updated and correct. Let's try. Make every effort to maintain it.`}
      </p>
      <p>
        {hindi
          ? `यदि तकनीकी खराबी के कारण हमारे उपयोगकर्ताओं का किसी भी प्रकार का डेटा डिलीट हो जाता है तो riksham.com कोई जिम्मेदारी नहीं लेता है।`
          : `riksham.com does not take any responsibility if any type of data of our users gets deleted due to technical failure.`}
      </p>
      <p>
        {hindi
          ? `किसी भी स्थिति में हम किसी भी हानि या क्षति के लिए उत्तरदायी नहीं होंगे, जिसमें बिना किसी सीमा के, अप्रत्यक्ष या परिणामी हानि या क्षति, या इस वेबसाइट के उपयोग के संबंध में डेटा या लाभ की हानि से उत्पन्न कोई भी हानि शामिल है। हानि या क्षति शामिल है.`
          : `In no event will we be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss arising from loss of data or profits arising out of or in connection with the use of this website. Loss or damage is involved. ,`}
      </p>
      <p>
        {hindi
          ? `वेबसाइट को सुचारू रूप से चालू रखने के लिए हर संभव प्रयास किया जाता है। हालाँकि, riksham.com हमारे नियंत्रण से परे तकनीकी मुद्दों के कारण वेबसाइट के अस्थायी रूप से अनुपलब्ध होने के लिए कोई जिम्मेदारी नहीं लेता है और इसके लिए उत्तरदायी नहीं होगा।`
          : `Every effort is made to keep the website running smoothly. However, riksham.com takes no responsibility for and will not be liable for the website being temporarily unavailable due to technical issues beyond our control.`}
      </p>
    </section>
  );
};

export default Disclaimer;
