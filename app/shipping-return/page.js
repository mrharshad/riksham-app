import React from "react";
import style from "./shipping-return.module.css";
import Link from "next/link";
export const generateMetadata = () => {
  return {
    title: "Shipping & Return",
  };
};
const ShippingReturn = ({ searchParams }) => {
  const hindi = searchParams.hindi;
  return (
    <section id="productUser" className={style.section}>
      <input type="checkbox" defaultChecked={hindi ? true : false} />
      <h1 className={style.h1}>
        Shipping & Return Policy
        <Link href={hindi ? "?" : "?hindi=true"}>
          {hindi ? "English..." : "Hindi..."}
        </Link>
      </h1>
      <p>{hindi ? " महत्वपूर्ण लेख:" : " Important Notes:"}</p>
      <span>
        {hindi
          ? `वे क्षेत्र/स्थान जहां हम डिलीवरी प्रदान नहीं करते हैं। यदि आप किसी परिवहन या अन्य सुविधा के माध्यम से उत्पाद की डिलीवरी का अनुरोध करते हैं तो हम आपके या हमारे द्वारा चुनी गई सुविधा के योग्य कर्मचारी से पहले उत्पाद को पैकेज करने का प्रयास करेंगे। या हम एक वीडियो बनाएंगे. प्रोडक्ट की पैकेजिंग कर उसे आपके पास भेज दिया जाता है, जिसके बाद प्रोडक्ट खराब होने या किसी अन्य प्रकार की समस्या होने पर riksham.com किसी भी तरह से जिम्मेदार नहीं होगा।

          यदि गारंटी / वारंटी के तहत उत्पाद किसी भी तरह से दोषपूर्ण पाया जाता है, तो दावा उत्पाद के ब्रांड के नियमों और शर्तों के अनुसार किया जाएगा।`
          : `Areas / locations where we do not provide delivery. If you request delivery of the Product via any transport or other facility we will endeavor to package the Product before you or a qualified employee of the facility chosen by us. Or we'll make a video. Packaging the product and dispatching it to you, following which riksham.com will not be responsible in any way if the product gets damaged or has any other kind of problem.

      If the product under guarantee / warranty is found defective in any way, the claim will be made as per the terms and conditions of the brand of the product.`}
      </span>
      <p>{hindi ? "रद्द करने की नीति:" : "Cancellation policy:"}</p>
      <span>
        {hindi
          ? `यदि आपने अपने उत्पाद के लिए भुगतान कर दिया है और अपनी पहचान के साथ व्हाट्सएप/मेल के माध्यम से ऑर्डर किए गए उत्पाद का विवरण भेज दिया है, तो आप 6 घंटे के भीतर बदलाव, डाउनग्रेड या अपग्रेड का अनुरोध कर सकते हैं।

      कृपया ध्यान दें, यदि आप रिफंड का अनुरोध करते हैं तो स्रोत या ग्राहक से भुगतान की गई फीस आपके ऑर्डर राशि से काट ली जाएगी। यदि रिफंड के लिए आपका अनुरोध 6 घंटे के बाद प्राप्त होता है, तो राशि 1000 रुपये से अधिक होने पर 5% काटा जाएगा। यदि अनुरोध 6 घंटे से पहले किया जाता है तो 1000 रुपये की आधी राशि पर 2% काटा जाएगा।

      1000 रुपये से कम कीमत का ऑर्डर रद्द नहीं किया जा सकेगा. न ही रिफंड का अनुरोध किया जा सकता है`
          : `If you have paid for your product and sent the details of the ordered product via WhatsApp/Mail along with your identification, you can request a change, downgrade or upgrade within 6 hours.

          Please note, if you request a refund the fees paid from the source or customer will be deducted from your order amount. If your request for refund is received after 6 hours, 5% will be deducted if the amount exceeds Rs 1000. If request is made before 6 hours then 2% will be deducted on half the amount of Rs 1000.

          Orders worth less than Rs 1000 cannot be cancelled. Nor can a refund be requested`}
      </span>

      <p>{hindi ? "वापसी नीति:" : "Return Policy:"}</p>
      <span>
        {hindi
          ? `- यदि आपको उत्पाद पसंद नहीं आया तो रिटर्न की अनुमति नहीं है।

      - यदि ग्राहक द्वारा डिलीवरी पर पार्सल अस्वीकार या अस्वीकार कर दिया जाता है तो हम किसी भी रिटर्न को संसाधित करने या कोई रिफंड प्रदान करने के लिए उत्तरदायी नहीं हैं।
      
      - यदि ग्राहक को गलती से गलत उत्पाद मिलता है तो हम पिकअप की व्यवस्था करेंगे या शिपिंग की भरपाई करेंगे।
      
      ग्लोरियस जैसे विभिन्न चूहों के लिए ड्रैग या बटरफ्लाई क्लिकिंग गड़बड़ी वारंटी या दोष के अंतर्गत नहीं आती है।`
          : `- Returns are not allowed if you do not like the product.

      - We are not liable to process any returns or provide any refund if the parcel is refused or refused upon delivery by the customer.
      
      - If customer accidentally receives the wrong product we will arrange pickup or compensate shipping.
      
      Drag or butterfly clicking glitches are not covered under warranty or defect for various mice like Glorious.`}
      </span>

      <p>{hindi ? "भुगतान वापसी की नीति:" : "REFUND POLICY:"}</p>
      <span>
        {hindi
          ? `कृपया ध्यान दें, यदि आप रिफंड का अनुरोध करते हैं तो स्रोत या ग्राहक से भुगतान की गई फीस आपके ऑर्डर राशि से काट ली जाएगी। यदि रिफंड के लिए आपका अनुरोध 6 घंटे के बाद प्राप्त होता है, तो राशि 1000 रुपये से अधिक होने पर 5% काटा जाएगा। यदि अनुरोध 6 घंटे से पहले किया जाता है तो 1000 रुपये की आधी राशि पर 2% काटा जाएगा।

      1000 रुपये से कम कीमत का ऑर्डर रद्द नहीं किया जा सकेगा. न ही रिफंड का अनुरोध किया जा सकता है`
          : `Please note, if you request a refund the fees paid from the source or customer will be deducted from your order amount. If your request for refund is received after 6 hours, 5% will be deducted if the amount exceeds Rs 1000. If request is made before 6 hours then 2% will be deducted on half the amount of Rs 1000.

          Orders worth less than Rs 1000 cannot be cancelled. Nor can a refund be requested`}
      </span>

      <p>
        {hindi
          ? "विफल डिलीवरी और आरटीओ नीति:"
          : "FAILED DELIVERY & RTO POLICY:"}
      </p>
      <span>
        {hindi
          ? `यदि डिलीवरी के दौरान कोई व्यक्ति उपलब्ध नहीं है, तो लॉजिस्टिक्स द्वारा 2-3 प्रयास किए जाएंगे, आप लॉजिस्टिक्स के साथ संवाद कर सकते हैं और अपनी सुविधानुसार डिलीवरी शेड्यूल कर सकते हैं।

          दोबारा प्रयास के बाद भी यदि पार्सल डिलीवर नहीं हुआ तो उसे लॉजिस्टिक्स द्वारा हमें वापस भेज दिया जाएगा। आरटीओ या रिटर्न टू ओरिजिन के ऐसे मामलों में, आप हमें 300/- रुपये की अतिरिक्त शिपिंग लागत या ऑर्डर मूल्य के 10% (दुर्लभ मामलों में) का भुगतान करके इसे पुनः शिप करने के लिए कह सकते हैं, जो हर मामले में अलग-अलग होता है।
          
          नोट: यह नीति केवल विफल डिलीवरी के वास्तविक मामलों के लिए है और यदि आप जानबूझकर पार्सल को अस्वीकार या अस्वीकार करते हैं, तो आपको कोई रिफंड नहीं मिलेगा।`
          : `If no person is available during delivery, 2-3 attempts will be made by logistics, You can communicate with the logistics and schedule delivery at your convenience.

      Even after re-attempts, if the parcel remains undelivered it will be sent back to us by logistics. In such cases of RTO or Return to origins, You may ask us to reship it by paying the additional shipping cost of Rs 300/- or up to 10% (In rare cases) of the order value varies from case to case.
      
      Note: This policy is for genuine cases of failed deliveries only and if you refuse or declined the parcel on purpose, you will not get any refund.`}
      </span>
      <p>
        {hindi
          ? "कानूनी अधिकार - (riksham.com) को कानूनी कार्रवाई करने का अधिकार है यदि (लेकिन यहीं तक सीमित नहीं)"
          : "LEGAL RIGHTS - ( riksham.com ) has the right to take legal action if (But Not Limited To)"}
      </p>
      <span>
        {hindi
          ? `ग्राहक ऑर्डर देने के लिए कोई भी अनैतिक तरीका आज़मा रहा है।

          यदि कोई ग्राहक उत्पाद की सफल डिलीवरी के बाद विवाद शुरू करता है।

          यदि कोई ग्राहक ऑर्डर देने के लिए वेबसाइट का फायदा उठाने का प्रयास करता है।

          यदि ग्राहक नकली या चोरी हुए क्रेडिट/डेबिट कार्ड का उपयोग करता है।

          यदि ग्राहक डिलीवरी के बाद बैंकिंग प्रणाली से भुगतान रोक देता है।`
          : `The customer is trying any unethical method to place an order.

      If a customer opens a dispute after the successful delivery of the product(s).

      If a customer attempt to exploit the website to place an order.

      If the customer uses a fake or stolen credit/debit card.

      If the customer stops payments from the banking system after delivery.`}
      </span>

      <p>{hindi ? "सीमित देयता नीति:" : "LIMITED LIABILITY POLICY:"}</p>
      <span>
        {hindi
          ? `(riksham.com) निम्नलिखित मामलों में होने वाले किसी भी नुकसान को सहन करने के लिए उत्तरदायी नहीं है

          महामारी, तूफान और अन्य राष्ट्रीय आपात स्थितियों के दौरान पूर्ति में देरी।
          
          लॉजिस्टिक्स सेवाओं द्वारा डिलीवरी में देरी के कारण अतिरिक्त हानि।
          
          आपके परिसर में पति/पत्नी, फ्लैटमेट्स, सुरक्षा गार्ड, या अन्य कर्मियों द्वारा प्राप्त पार्सल।
          
          प्राकृतिक आपदाएँ/खतरे या अन्य मुद्दे/स्थितियाँ जिनके कारण राष्ट्रीय आपातस्थितियों और सरकारी कार्रवाइयों सहित कूरियर सेवा ठीक से काम करने में बाधा उत्पन्न होती है।
          
          ग्राहक द्वारा जला हुआ/पानी से क्षतिग्रस्त/दुर्व्यवहार किया गया पार्सल।
          
          यदि लॉजिस्टिक सेवाओं द्वारा डिलीवरी या पॉड का प्रमाण प्रदान किया जाता है तो पार्सल को डिलीवर माना जाता है।`
          : `(riksham.com) IS NOT LIABLE TO BEAR ANY LOSS OCCURS IN FOLLOWING CASES

      Delay in fulfillment during pandemics, storms, and other national emergencies.
      
      Additional Loss Due To Delayed Delivery By Logistics Services.
      
      Parcel received by the spouse, flatmates, security guard, or other personnel on your premises.
      
      Natural disasters/hazards or other issues/situations due which disrupt courier service to work properly including national emergencies and government actions.
      
      Burned/water damaged/mistreated parcel by the client.
      
      The parcel is considered delivered if proof of delivery or pod is provided by logistic services.`}
      </span>

      <p>
        {hindi
          ? "प्रयुक्त सामान्य नियम और शब्द"
          : "COMMON TERMS AND WORDS USED"}
      </p>

      <span>
        {hindi
          ? `पैकेज - पैक किए गए उत्पाद या उत्पादों को संदर्भित करता है जिन्हें शिप किया जाना है।

      भेजा गया - कूरियर या लॉजिस्टिक सेवा प्रदाता के माध्यम से पार्सल भेजने को संदर्भित करता है।
      
      मूल स्थिति - उत्पाद और उसकी पैकेजिंग पर मूल स्थिति को संदर्भित करता है जिसमें यह खरीदार तक पहुंचता है।
      
      अनबॉक्सिंग - पार्सल को उसकी पैकेजिंग से निकालने की प्रक्रिया को संदर्भित करता है।
      
      सुविधा शुल्क - विभिन्न भुगतान गेटवे सेवाओं की फीस, पैकेजिंग शुल्क और देर से रद्दीकरण के कारण होने वाली असुविधा की भरपाई के लिए लगने वाले शुल्क को संदर्भित करता है। यह विभिन्न मामलों के लिए 0% से 10% तक भिन्न होता है।`
          : `Package - Refers to the packed product or products that are meant to be shipped.

          Shipped - Refers to sending the parcel through a courier or logistic service provider.
          
          Original Condition - Refers to the original states on the product and its packaging in which it reaches the buyer.
          
          Unboxing - Refers to the process of extraction of the parcel from its packaging.
          
          Convenience fee - Refers to the charges to compensate for the fees of various payment gateway services, packaging charges, and inconvenience due to late cancellation. It varies from 0% to 10% for different cases.`}
      </span>
    </section>
  );
};

export default ShippingReturn;
