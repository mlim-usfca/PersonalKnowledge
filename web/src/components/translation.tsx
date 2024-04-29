import React from 'react';
import i18n from '../Locales/i18n'

const MyLanguage = () => {
  const handleLanguageChange = (lang) => {
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang);
      localStorage.setItem('dai-lng', lang);
    } else {
      console.error('i18n or changeLanguage not available');
    }
  };

  return (
    <div>
      <button className="hover:bg-gray-50 text-gray-500  mb-2 py-2 border border-gray-300 rounded shadow" onClick={() => handleLanguageChange('en')}>English</button>
      <button className="hover:bg-gray-50 text-gray-500  mb-2 py-2 border border-gray-300 rounded shadow" onClick={() => handleLanguageChange('ko')}>Korean</button>
    </div>
  );
};

export default MyLanguage;
