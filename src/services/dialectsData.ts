export interface Dialect {
  id: string;
  name: string;
  nativeName: string;
  state: string;
  region: 'NER' | 'Himalayan' | 'Tribal & Central' | 'Southern' | 'Western' | 'Eastern' | 'Northern';
  family: 'Tibeto-Burman' | 'Austroasiatic (Khasian/Munda)' | 'Indo-Aryan' | 'Dravidian' | 'Tai-Kadai';
  speakers: string;
  censusCode: string;
  phoneticSample: string;
}

export const CENSUS_TOTAL_DIALECTS_COUNT = 19569;

export const FEATURED_DIALECTS: Dialect[] = [
  // North Eastern Region (NER) Indigenous Dialects
  { id: 'd-kha-sohra', name: 'Khasi (Sohra)', nativeName: 'Ka Ktien Khasi (Sohra)', state: 'Meghalaya', region: 'NER', family: 'Austroasiatic (Khasian/Munda)', speakers: '1.4M', censusCode: 'MEG-KHA-01', phoneticSample: 'Jingmahham: Don ka jinghiar khyndew ba ma. Pynkynriah sha ki jak shngiam stet.' },
  { id: 'd-kha-pnar', name: 'Pnar (Jaintia)', nativeName: 'Ka Ktien Pnar', state: 'Meghalaya', region: 'NER', family: 'Austroasiatic (Khasian/Munda)', speakers: '320K', censusCode: 'MEG-PNA-02', phoneticSample: 'Jingmahham: Em ka khyndew ba hiar. Lai sha ka thaw ba yada mar-ya.' },
  { id: 'd-kha-war', name: 'War Khasi', nativeName: 'War-Jaintia', state: 'Meghalaya', region: 'NER', family: 'Austroasiatic (Khasian/Munda)', speakers: '85K', censusCode: 'MEG-WAR-03', phoneticSample: 'Jingma khyndew hiar. Pynkynriah sha khlieh lum stet.' },
  { id: 'd-kha-bhoi', name: 'Bhoi Khasi', nativeName: 'Bhoi Dialect', state: 'Meghalaya', region: 'NER', family: 'Austroasiatic (Khasian/Munda)', speakers: '110K', censusCode: 'MEG-BHO-04', phoneticSample: 'Jingmahham stet ia ki lum: pynkynriah noh sha ba shngiam.' },
  { id: 'd-grt-achik', name: 'Garo (A·chik)', nativeName: 'A·chik Ku·sik', state: 'Meghalaya', region: 'NER', family: 'Tibeto-Burman', speakers: '1.1M', censusCode: 'MEG-GAR-05', phoneticSample: 'Mikrakani: A·bri ru·ani dongsoenga. Baksa nama a·songchi katbo.' },
  
  { id: 'd-lus-mizo', name: 'Mizo (Lushai)', nativeName: 'Mizo ṭawng', state: 'Mizoram', region: 'NER', family: 'Tibeto-Burman', speakers: '850K', censusCode: 'MIZ-LUS-01', phoneticSample: 'Hriattirna: Leimin hlauhawm chhuah a ni. Hmun himah insawn chhuak rawu le.' },
  { id: 'd-lus-hmar', name: 'Hmar', nativeName: 'Hmar ṭawng', state: 'Mizoram & Assam', region: 'NER', family: 'Tibeto-Burman', speakers: '95K', censusCode: 'MIZ-HMA-02', phoneticSample: 'Fimkhurna: Leimin a hlauhawm ta. Hmun zawlah tlan suh u.' },
  { id: 'd-lus-lai', name: 'Lai (Pawi)', nativeName: 'Lai holh', state: 'Mizoram', region: 'NER', family: 'Tibeto-Burman', speakers: '140K', censusCode: 'MIZ-LAI-03', phoneticSample: 'Ralrinna: Lungto a tla ding. Hmun himah kal cio u.' },
  
  { id: 'd-njz-nyishi', name: 'Nyishi', nativeName: 'Nyishi Agam', state: 'Arunachal Pradesh', region: 'NER', family: 'Tibeto-Burman', speakers: '300K', censusCode: 'ARU-NYI-01', phoneticSample: 'Notice: Critical landslide creep detected. Go to safe shelter immediately.' },
  { id: 'd-njz-apatani', name: 'Apatani (Tanw)', nativeName: 'Tanii Agam', state: 'Arunachal Pradesh', region: 'NER', family: 'Tibeto-Burman', speakers: '45K', censusCode: 'ARU-APA-02', phoneticSample: 'Alert: Dree valley slope shift detected. Move to higher ground.' },
  { id: 'd-njz-galo', name: 'Galo', nativeName: 'Galo Agam', state: 'Arunachal Pradesh', region: 'NER', family: 'Tibeto-Burman', speakers: '130K', censusCode: 'ARU-GAL-03', phoneticSample: 'Karka Notice: Landslide warning active in valley.' },
  { id: 'd-njz-adi', name: 'Adi (Minyong/Padam)', nativeName: 'Adi Agam', state: 'Arunachal Pradesh', region: 'NER', family: 'Tibeto-Burman', speakers: '120K', censusCode: 'ARU-ADI-04', phoneticSample: 'Siang river slope alert: Evacuate slope hamlets immediately.' },
  { id: 'd-njz-mishmi', name: 'Mishmi (Idu/Digaru)', nativeName: 'Idu Mishmi', state: 'Arunachal Pradesh', region: 'NER', family: 'Tibeto-Burman', speakers: '35K', censusCode: 'ARU-MIS-05', phoneticSample: 'Lohit gorge warning: Slope instability verified.' },
  { id: 'd-njz-wancho', name: 'Wancho', nativeName: 'Wancho Language', state: 'Arunachal Pradesh', region: 'NER', family: 'Tibeto-Burman', speakers: '60K', censusCode: 'ARU-WAN-06', phoneticSample: 'Tirap ridge warning: Evacuate immediately.' },
  
  { id: 'd-nag-angami', name: 'Angami', nativeName: 'Tenyidie', state: 'Nagaland', region: 'NER', family: 'Tibeto-Burman', speakers: '150K', censusCode: 'NAG-ANG-01', phoneticSample: 'Tenyidie warning: Kijü kevi kephü mhachü chüya.' },
  { id: 'd-nag-ao', name: 'Ao Naga', nativeName: 'Ao Opar', state: 'Nagaland', region: 'NER', family: 'Tibeto-Burman', speakers: '230K', censusCode: 'NAG-AO-02', phoneticSample: 'Mokokchung warning: Alisüm mapang tetsübu lir.' },
  { id: 'd-nag-sumi', name: 'Sumi (Sema)', nativeName: 'Sümi Tsakheh', state: 'Nagaland', region: 'NER', family: 'Tibeto-Burman', speakers: '240K', censusCode: 'NAG-SUM-03', phoneticSample: 'Zunheboto warning: Aghiphi sütsü alhou paniki.' },
  { id: 'd-nag-lotha', name: 'Lotha', nativeName: 'Lotha Yena', state: 'Nagaland', region: 'NER', family: 'Tibeto-Burman', speakers: '180K', censusCode: 'NAG-LOT-04', phoneticSample: 'Wokha slope warning: Kyong elan pyothok chie.' },
  { id: 'd-nag-konyak', name: 'Konyak', nativeName: 'Konyak Dialect', state: 'Nagaland', region: 'NER', family: 'Tibeto-Burman', speakers: '250K', censusCode: 'NAG-KON-05', phoneticSample: 'Mon district warning: Slope slide risk high.' },
  { id: 'd-nag-nagamese', name: 'Nagamese Creole', nativeName: 'Nagamese', state: 'Nagaland', region: 'NER', family: 'Indo-Aryan', speakers: '3.0M', censusCode: 'NAG-CRE-06', phoneticSample: 'Gaon manu khan shuni lobi: Danger landslide creep dekhi pase.' },
  
  { id: 'd-as-assamese', name: 'Assamese', nativeName: 'অসমীয়া', state: 'Assam', region: 'NER', family: 'Indo-Aryan', speakers: '15.3M', censusCode: 'ASM-ASS-01', phoneticSample: 'সতৰ্কবাৰ্তা: গম্ভীৰ ভূমিস্খলনৰ সম্ভাৱনা ধৰা পৰিছে। ততালিকে সুৰক্ষিত আশ্ৰয়স্থললৈ যাওক।' },
  { id: 'd-as-bodo', name: 'Bodo', nativeName: "बर'", state: 'Assam', region: 'NER', family: 'Tibeto-Burman', speakers: '1.4M', censusCode: 'ASM-BOD-02', phoneticSample: 'सांग्रां जा: गोगोम हा सिफायनायनि खथि नुदों। थाबैनो रैखाथि आश्रयसालायाव थां।' },
  { id: 'd-as-karbi', name: 'Karbi (Mikir)', nativeName: 'Karbi Lam', state: 'Assam', region: 'NER', family: 'Tibeto-Burman', speakers: '520K', censusCode: 'ASM-KAR-03', phoneticSample: 'Karbi Anglong warning: Longri kachevo alam tame.' },
  { id: 'd-as-dimasa', name: 'Dimasa', nativeName: 'Dimasa Grao', state: 'Assam', region: 'NER', family: 'Tibeto-Burman', speakers: '140K', censusCode: 'ASM-DIM-04', phoneticSample: 'Dima Hasao warning: Ha gajap baodeing.' },
  { id: 'd-as-mising', name: 'Mising', nativeName: 'Mising Agom', state: 'Assam', region: 'NER', family: 'Tibeto-Burman', speakers: '600K', censusCode: 'ASM-MIS-05', phoneticSample: 'Riverbank slope alert: Mishing agom warning.' },

  { id: 'd-mni-meitei', name: 'Manipuri (Meiteilon)', nativeName: 'মৈতৈলোন্', state: 'Manipur', region: 'NER', family: 'Tibeto-Burman', speakers: '1.8M', censusCode: 'MAN-MNI-01', phoneticSample: 'চেরাং: চিংশিং কাইবগী অচৌবা ভয় লৈরে। হৌজিকমক চেকশিনবা মফমদা চৎলু।' },
  { id: 'd-mni-tangkhul', name: 'Tangkhul Naga', nativeName: 'Tangkhul Tui', state: 'Manipur', region: 'NER', family: 'Tibeto-Burman', speakers: '180K', censusCode: 'MAN-TAN-02', phoneticSample: 'Ukhrul warning: Kazei kahai vashak ngalu.' },
  
  { id: 'd-trv-kokborok', name: 'Kokborok', nativeName: 'Kokborok', state: 'Tripura', region: 'NER', family: 'Tibeto-Burman', speakers: '1.0M', censusCode: 'TRI-KOK-01', phoneticSample: 'Warning: High landslide creep swakha. Tabokno kaham hachuk safe shelter than-di.' },
  { id: 'd-trv-reang', name: 'Reang (Bru)', nativeName: 'Kau Bru', state: 'Tripura', region: 'NER', family: 'Tibeto-Burman', speakers: '190K', censusCode: 'TRI-REA-02', phoneticSample: 'Bru warning: Ha kasingha danger. Suba safe place-o than.' },
  
  { id: 'd-sik-lepcha', name: 'Lepcha (Róng)', nativeName: 'Róng Ríng', state: 'Sikkim', region: 'NER', family: 'Tibeto-Burman', speakers: '50K', censusCode: 'SIK-LEP-01', phoneticSample: 'Sikkim warning: Lóngníng lóng-ágáng warning active.' },
  { id: 'd-sik-bhutia', name: 'Bhutia (Sikkimese)', nativeName: 'Denzongke', state: 'Sikkim', region: 'NER', family: 'Tibeto-Burman', speakers: '70K', censusCode: 'SIK-BHU-02', phoneticSample: 'Denzongke warning: Ri-shig danger warning.' },

  // Himalayan & Northern Dialects
  { id: 'd-him-ladakhi', name: 'Ladakhi (Bhoti)', nativeName: 'ལ་དྭགས་སྐད།', state: 'Ladakh', region: 'Himalayan', family: 'Tibeto-Burman', speakers: '110K', censusCode: 'LAD-LAD-01', phoneticSample: 'Ladakh Warning: Ri-drut hazard detected. Move to safe high ground.' },
  { id: 'd-him-kashmiri', name: 'Kashmiri', nativeName: 'کٲشُر / कॉशुर', state: 'Jammu & Kashmir', region: 'Himalayan', family: 'Indo-Aryan', speakers: '6.8M', censusCode: 'JNK-KAS-01', phoneticSample: 'خبردار: پَہاڑ کھِسنُک خطرٕ چھُ। فوري طور مَحفُوظ جائہِ پؠٹھ گَچھِو۔' },
  { id: 'd-him-dogri', name: 'Dogri', nativeName: 'डोगरी', state: 'Jammu & Kashmir', region: 'Himalayan', family: 'Indo-Aryan', speakers: '2.6M', censusCode: 'JNK-DOG-02', phoneticSample: 'चेतावनी: पहाड़ खिसकने का खतरा है। तुरंत सुरक्षित स्थान पर जाएँ।' },
  { id: 'd-him-garhwali', name: 'Garhwali', nativeName: 'गढ़वाली', state: 'Uttarakhand', region: 'Himalayan', family: 'Indo-Aryan', speakers: '2.5M', censusCode: 'UTT-GAR-01', phoneticSample: 'चेतावनी: पहाड़ भस्कण को खतरा च। जल्द सुरक्षित जगै जांवा।' },
  { id: 'd-him-kumaoni', name: 'Kumaoni', nativeName: 'कुमाऊंनी', state: 'Uttarakhand', region: 'Himalayan', family: 'Indo-Aryan', speakers: '2.0M', censusCode: 'UTT-KUM-02', phoneticSample: 'चेतावनी: पैंया गिरणो ख़तरो छ। तौखि सुरछित ठांव जा।' },

  // Central, Tribal & Adivasi Dialects
  { id: 'd-tri-gondi', name: 'Gondi', nativeName: 'गोइंदी', state: 'Madhya Pradesh & CG', region: 'Tribal & Central', family: 'Dravidian', speakers: '3.0M', censusCode: 'MP-GON-01', phoneticSample: 'Warning: Metta jurval danger. Jaldi safe thana sondu.' },
  { id: 'd-tri-santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', state: 'Jharkhand & WB', region: 'Tribal & Central', family: 'Austroasiatic (Khasian/Munda)', speakers: '7.3M', censusCode: 'JHK-SAN-01', phoneticSample: 'ᱪᱮᱛᱟ line: ᱵᱩᱨᱩ ᱧᱩᱨᱩᱜ ᱠᱷᱟᱹᱛᱤᱨ ᱵᱚᱛᱚᱨ ᱢᱮᱱᱟᱜᱼᱟ. ᱞᱟᱹᱜᱤᱫ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ ᱛᱮ ᱪᱟᱞᱟᱣ ᱯᱮ.' },
  { id: 'd-tri-ho', name: 'Ho', nativeName: '𑢹𑣉𑣉 𑣏𑣈𑣕a', state: 'Jharkhand & Odisha', region: 'Tribal & Central', family: 'Austroasiatic (Khasian/Munda)', speakers: '1.4M', censusCode: 'JHK-HO-02', phoneticSample: 'Alert: Buru leka danger. Safe lugar senpe.' },
  { id: 'd-tri-mundari', name: 'Mundari', nativeName: 'मुंडारी', state: 'Jharkhand', region: 'Tribal & Central', family: 'Austroasiatic (Khasian/Munda)', speakers: '1.1M', censusCode: 'JHK-MUN-03', phoneticSample: 'Warning: Buru khasra danger active.' },
  { id: 'd-tri-kurukh', name: 'Kurukh (Oraon)', nativeName: 'कुड़ुख़', state: 'Jharkhand & CG', region: 'Tribal & Central', family: 'Dravidian', speakers: '2.1M', censusCode: 'JHK-KUR-04', phoneticSample: 'Alert: Parta khatra danger. Safe jagah kala.' },

  // Southern & Western Dialects
  { id: 'd-sou-tulu', name: 'Tulu', nativeName: 'তুಳು / തുളു', state: 'Karnataka & Kerala', region: 'Southern', family: 'Dravidian', speakers: '2.0M', censusCode: 'KAR-TUL-01', phoneticSample: 'Macharike: Gudde koripuna abhadhara undu. Begane pathropu jagak poyi.' },
  { id: 'd-sou-konkani', name: 'Konkani', nativeName: 'कोंकणी', state: 'Goa & Maharashtra', region: 'Western', family: 'Indo-Aryan', speakers: '2.3M', censusCode: 'GOA-KON-01', phoneticSample: 'शिटकावणी: दोंगर कुसळपाचो धोको आसा. बेगीन सुरक्षीत सुवातेर वचात.' },
  { id: 'd-sou-kodava', name: 'Kodava (Coorgi)', nativeName: 'ಕೊಡವ ತಕ್ಕ್‌', state: 'Karnataka', region: 'Southern', family: 'Dravidian', speakers: '120K', censusCode: 'KAR-KOD-02', phoneticSample: 'Warning: Betta bozhivodhu danger. Safe place-gi poni.' },

  // Scheduled & Major National Languages
  { id: 'd-[#1]', name: 'Hindi', nativeName: 'हिन्दी', state: 'All India', region: 'Northern', family: 'Indo-Aryan', speakers: '528M', censusCode: 'IND-HIN-01', phoneticSample: 'ग्रामीणों ध्यान दें: भूस्खलन का गंभीर खतरा 87/100 सीमा पर पाया गया है। तुरंत सुरक्षित स्थान पर जाएं।' },
  { id: 'd-[#2]', name: 'Bengali', nativeName: 'বাংলা', state: 'West Bengal & Tripura', region: 'Eastern', family: 'Indo-Aryan', speakers: '97M', censusCode: 'IND-BEN-02', phoneticSample: 'গ্রামবাসী সতর্ক হন: মারাত্মক ভূমিধসের সম্ভাবনা দেখা গেছে। অবিলম্বে নিরাপদ আশ্রয়ে চলে যান।' },
  { id: 'd-[#3]', name: 'Telugu', nativeName: 'తెలుగు', state: 'Andhra Pradesh & TS', region: 'Southern', family: 'Dravidian', speakers: '83M', censusCode: 'IND-TEL-03', phoneticSample: 'హెచ్చరిక: కొండచరియలు విరిగిపడే ప్రమాదం ఉంది. తక్షణమే సురక్షిత ప్రాంతానికి వెళ్ళండి.' },
  { id: 'd-[#4]', name: 'Marathi', nativeName: 'मराठी', state: 'Maharashtra', region: 'Western', family: 'Indo-Aryan', speakers: '83M', censusCode: 'IND-MAR-04', phoneticSample: 'इशारा: दरड कोसळण्याचा मोठा धोका आहे. त्वरित सुरक्षित स्थळी जा.' },
  { id: 'd-[#5]', name: 'Tamil', nativeName: 'தமிழ்', state: 'Tamil Nadu', region: 'Southern', family: 'Dravidian', speakers: '69M', censusCode: 'IND-TAM-05', phoneticSample: 'எச்சரிக்கை: நிலச்சரிவு அபாயம் உள்ளது. உடனடியாக பாதுகாப்பான இடத்திற்கு செல்லவும்.' },
  { id: 'd-[#6]', name: 'Gujarati', nativeName: 'ગુજરાતી', state: 'Gujarat', region: 'Western', family: 'Indo-Aryan', speakers: '55M', censusCode: 'IND-GUJ-06', phoneticSample: 'ચેતવણી: ભૂસ્ખલનનું મોટું જોખમ છે. તાત્કાલિક સુરક્ષિત સ્થળે ખસી જાઓ.' },
  { id: 'd-[#7]', name: 'Kannada', nativeName: 'ಕನ್ನಡ', state: 'Karnataka', region: 'Southern', family: 'Dravidian', speakers: '44M', censusCode: 'IND-KAN-07', phoneticSample: 'எச்சரிக்கை: நிலச்சரிவு அபாயம் உள்ளது. உடனடியாக பாதுகாப்பான இடத்திற்கு செல்லவும்.' },
  { id: 'd-[#8]', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', state: 'Odisha', region: 'Eastern', family: 'Indo-Aryan', speakers: '37M', censusCode: 'IND-ODI-08', phoneticSample: 'ସତର୍କତା: ଭୂସ୍ଖଳନର ଆଶଙ୍କା ରହିଛି | ତୁରନ୍ତ ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ଚାଲିଯାଅ |' },
  { id: 'd-[#9]', name: 'Malayalam', nativeName: 'മലയാളം', state: 'Kerala', region: 'Southern', family: 'Dravidian', speakers: '34M', censusCode: 'IND-MAL-09', phoneticSample: 'മുന്നറിയിപ്പ്: ഉരുൾപൊട്ടൽ സാധ്യതയുണ്ട്. ഉടനടി സുരക്ഷിത സ്ഥാനത്തേക്ക് മാറുക.' },
  { id: 'd-[#10]', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', state: 'Punjab', region: 'Northern', family: 'Indo-Aryan', speakers: '33M', censusCode: 'IND-PUN-10', phoneticSample: 'ਚੇਤਾਵਨੀ: ਜ਼ਮੀਨ खਿਸਕਣ ਦਾ ਖਤਰਾ ਹੈ। ਤੁਰੰਤ ਸੁਰੱਖਿਅਤ ਜਗ੍ਹਾ ਜਾਓ।' },
];

/**
 * Dynamic AI Dialect Speech Synthesizer Simulator
 * Generates alert transcript and voice metadata for ANY searched dialect in India (19,569 Index).
 */
export function synthesizeDialectAudio(dialect: Dialect, hamletName: string) {
  return {
    dialectName: dialect.name,
    nativeName: dialect.nativeName,
    censusCode: dialect.censusCode,
    languageFamily: dialect.family,
    region: dialect.region,
    state: dialect.state,
    speakerBase: dialect.speakers,
    synthesizedScript: `[GIRI-PRAHARI NEURAL IVR - ${dialect.name.toUpperCase()} (${dialect.nativeName})]: "${dialect.phoneticSample.replace('{HAMLET}', hamletName)}"`,
    audioFrequencyHz: 44100,
    bitrateKbps: 128,
    confidenceScore: 98.6,
  };
}
