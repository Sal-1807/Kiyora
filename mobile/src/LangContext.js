import React, { createContext, useContext, useState } from 'react';

const TRANSLATIONS = {
  en: {
    // tabs
    mapTab: 'Map', reportsTab: 'Reports', reportBtn: 'Report Spot',
    // dashboard
    dashboard: 'Dashboard', totalReports: 'Total Reports', inProgress: 'In Progress',
    cleaned: 'Cleaned ✓', highSev: 'High Sev.',
    // leaderboard
    leaderboard: 'Leaderboard', topCleaners: 'Top Cleaners',
    cleanups: 'cleanups', pts: 'pts', you: 'You',
    // list
    spots: 'Spots', noMatch: 'No reports match this filter.',
    // filters
    all: 'All', low: 'Low', medium: 'Medium', high: 'High',
    statusAll: 'All', statusReported: 'Reported', statusInProgress: 'In Progress',
    statusCleaned: 'Cleaned', statusPending: 'Pending',
    // map
    mapHint: '📍 Tap anywhere on the map to report a spot',
    claimCleanup: 'Claim Cleanup', markCleaned: 'Mark Cleaned', uploadProof: 'Upload Proof',
    // report form
    reportTitle: 'Report a Spot', location: 'Location',
    locPlaceholder: 'Type an address or use GPS…',
    useGPS: '📡 Use GPS', tapOnMap: '🗺 Tap on Map',
    sevLabel: 'Severity', photoOptional: 'Photo (optional)',
    camera: 'Camera', gallery: 'Gallery', removePhoto: '✕ Remove',
    submitReport: 'Submit Report', cancel: 'Cancel',
    // detail modal
    claimBtn: '♻️  Claim Cleanup',
    markCleanedBtn: '✅  Mark as Cleaned',
    pendingProofBtn: '📸  Upload Proof',
    // after photo modal
    afterTitle: 'Upload After Photo',
    afterSub: 'Proof required to mark as cleaned',
    afterPhotoLabel: 'After Photo (required)',
    beforeLabel: 'Before', afterLabel: 'After',
    submitCleaned: '✅  Mark as Cleaned',
    // status labels
    labelReported: 'Reported', labelInProgress: 'In Progress',
    labelCleaned: 'Cleaned', labelPendingProof: 'Pending Proof',
    // badges
    beforeAfterBadge: 'Before/After',
    // toasts
    reportSubmitted: '📍 Report submitted! Thank you.',
    claimToast: "🔧 Cleanup claimed! You're making a difference.",
    cleanedToast: '✅ Marked as cleaned! Great work.',
    pointsToast: '🏆 +{pts} pts earned!',
    pendingProofToast: '📸 Upload an after photo to complete cleanup',
    gpsGetting: '📡 Getting your location…',
    gpsOk: '✅ Location captured from GPS',
    noAfterPhoto: 'Please upload an after photo to confirm cleanup',
    // permission
    permNeeded: 'Permission needed',
    photoLibAccess: 'Photo library access required.',
    cameraAccess: 'Camera access required.',
  },
  hi: {
    mapTab: 'नक्शा', reportsTab: 'रिपोर्ट', reportBtn: 'स्थान रिपोर्ट करें',
    dashboard: 'डैशबोर्ड', totalReports: 'कुल रिपोर्ट', inProgress: 'प्रगति में',
    cleaned: 'साफ ✓', highSev: 'उच्च गंभीर.',
    leaderboard: 'लीडरबोर्ड', topCleaners: 'शीर्ष स्वयंसेवक',
    cleanups: 'सफाई', pts: 'अंक', you: 'आप',
    spots: 'स्थान', noMatch: 'कोई रिपोर्ट नहीं मिली।',
    all: 'सभी', low: 'कम', medium: 'मध्यम', high: 'उच्च',
    statusAll: 'सभी', statusReported: 'रिपोर्ट', statusInProgress: 'प्रगति में',
    statusCleaned: 'साफ', statusPending: 'लंबित',
    mapHint: '📍 गार्बेज रिपोर्ट करने के लिए नक्शे पर टैप करें',
    claimCleanup: 'सफाई दावा', markCleaned: 'साफ चिह्नित', uploadProof: 'प्रमाण अपलोड',
    reportTitle: 'स्थान रिपोर्ट करें', location: 'स्थान',
    locPlaceholder: 'पता टाइप करें या GPS उपयोग करें…',
    useGPS: '📡 GPS', tapOnMap: '🗺 नक्शे पर टैप',
    sevLabel: 'गंभीरता', photoOptional: 'फ़ोटो (वैकल्पिक)',
    camera: 'कैमरा', gallery: 'गैलरी', removePhoto: '✕ हटाएं',
    submitReport: 'रिपोर्ट जमा करें', cancel: 'रद्द करें',
    claimBtn: '♻️  सफाई दावा करें',
    markCleanedBtn: '✅  साफ चिह्नित करें',
    pendingProofBtn: '📸  प्रमाण अपलोड करें',
    afterTitle: 'बाद की फ़ोटो', afterSub: 'साफ चिह्नित करने के लिए प्रमाण आवश्यक',
    afterPhotoLabel: 'बाद की फ़ोटो (आवश्यक)',
    beforeLabel: 'पहले', afterLabel: 'बाद',
    submitCleaned: '✅  साफ चिह्नित करें',
    labelReported: 'रिपोर्ट किया', labelInProgress: 'प्रगति में',
    labelCleaned: 'साफ', labelPendingProof: 'प्रमाण लंबित',
    beforeAfterBadge: 'पहले/बाद',
    reportSubmitted: '📍 रिपोर्ट जमा हुई! धन्यवाद।',
    claimToast: '🔧 सफाई दावा! आप बदलाव ला रहे हैं।',
    cleanedToast: '✅ साफ चिह्नित! बहुत अच्छा।',
    pointsToast: '🏆 +{pts} अंक मिले!',
    pendingProofToast: '📸 सफाई पूरी करने के लिए फ़ोटो अपलोड करें',
    gpsGetting: '📡 स्थान प्राप्त हो रहा है…',
    gpsOk: '✅ GPS से स्थान मिला',
    noAfterPhoto: 'कृपया सफाई प्रमाण के लिए फ़ोटो अपलोड करें',
    permNeeded: 'अनुमति चाहिए',
    photoLibAccess: 'फ़ोटो लाइब्रेरी एक्सेस आवश्यक।',
    cameraAccess: 'कैमरा एक्सेस आवश्यक।',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');

  function t(key, vars) {
    const str =
      (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
      TRANSLATIONS.en[key] ||
      key;
    if (!vars) return str;
    return Object.entries(vars).reduce(
      (s, [k, v]) => s.replace(`{${k}}`, String(v)),
      str,
    );
  }

  function toggleLang() {
    setLang(l => (l === 'en' ? 'hi' : 'en'));
  }

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
