import React from 'react';
import { languageMap } from '../../Locales/i18n';
import { useTranslator } from '@/app/translator/provider';

const MyLanguage = () => {
  const { handleLanguageChange } = useTranslator();
  const lenLanguages = Object.keys(languageMap).length;

  return (
    <div className='bg-white w-full'>
      <hr />
      <div className='text-center'>
        <h1 className='text-sm mt-4 mb-1'>Select Language</h1>
      </div>
      <div className='flex justify-center'>
        {Object.entries(languageMap).map(([languageName, languageCode], index) => (
        <div key={languageCode}>
          <button
            className="hover:text-purple-600 text-gray-500 mb-2 p-2"
            onClick={() => handleLanguageChange(languageCode)}
          >
            {languageName}
          </button>
          { index < lenLanguages - 1 && <span>|</span> }
        </div>
      ))}
      </div>
    </div>
  );
};

export default MyLanguage;
